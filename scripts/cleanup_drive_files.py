#!/usr/bin/env python3
"""
One-time script to delete files from Google Drive that don't contain "final" in their name.
This cleans up files that were uploaded before the "final" filter was added.

Requirements:
    pip install google-auth google-auth-httplib2 google-api-python-client requests python-dotenv

Usage:
    python cleanup_drive_files.py --dry-run  # Preview what would be deleted
    python cleanup_drive_files.py            # Actually delete files
    
    The script will automatically load credentials from your .env file
"""

import argparse
import sys
import os
import json
from pathlib import Path
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import requests
from dotenv import load_dotenv

# Load .env file from project root
env_path = Path(__file__).parent.parent / '.env'
if env_path.exists():
    load_dotenv(env_path)
    print(f"✓ Loaded environment from {env_path}")
else:
    print(f"⚠ No .env file found at {env_path}, using system environment variables")


def get_supabase_config():
    """Get Supabase URL and service key from environment."""
    supabase_url = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
    supabase_key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if not supabase_url or not supabase_key:
        print("ERROR: Missing environment variables!")
        print("Please add to your .env file:")
        print("  NEXT_PUBLIC_SUPABASE_URL='https://your-project.supabase.co'")
        print("  SUPABASE_SERVICE_ROLE_KEY='your-service-role-key'")
        sys.exit(1)
    
    return supabase_url, supabase_key


def get_house_folders(supabase_url, supabase_key):
    """Get all house Drive folder IDs from Supabase."""
    response = requests.get(
        f"{supabase_url}/rest/v1/house_drive_folders?select=drive_folder_id,houses(name)",
        headers={
            "Authorization": f"Bearer {supabase_key}",
            "apikey": supabase_key,
        }
    )
    
    if response.status_code != 200:
        print(f"ERROR: Failed to fetch house folders from Supabase: {response.status_code}")
        print(response.text)
        sys.exit(1)
    
    data = response.json()
    if not data or len(data) == 0:
        print("ERROR: No house folders found in Supabase")
        print("Make sure you've set up house Drive folders in the app first")
        sys.exit(1)
    
    return [(f['drive_folder_id'], f['houses']['name']) for f in data]


def get_credentials_from_supabase(supabase_url, supabase_key):
    """Get Google OAuth credentials from Supabase google_tokens table."""
    # Fetch tokens from Supabase
    response = requests.get(
        f"{supabase_url}/rest/v1/google_tokens?select=access_token,refresh_token",
        headers={
            "Authorization": f"Bearer {supabase_key}",
            "apikey": supabase_key,
        }
    )
    
    if response.status_code != 200:
        print(f"ERROR: Failed to fetch tokens from Supabase: {response.status_code}")
        print(response.text)
        sys.exit(1)
    
    data = response.json()
    if not data or len(data) == 0:
        print("ERROR: No Google tokens found in Supabase google_tokens table")
        print("Make sure you've connected your Google account in the app first")
        sys.exit(1)
    
    token_data = data[0]
    
    # Create credentials object
    creds = Credentials(
        token=token_data['access_token'],
        refresh_token=token_data.get('refresh_token'),
        token_uri='https://oauth2.googleapis.com/token',
        client_id=os.environ.get('GOOGLE_CLIENT_ID'),
        client_secret=os.environ.get('GOOGLE_CLIENT_SECRET'),
    )
    
    # Refresh if expired
    if creds.expired and creds.refresh_token:
        print("Refreshing expired access token...")
        creds.refresh(Request())
    
    return creds


def list_files_without_final(service, folder_id=None):
    """List all files that don't contain 'final' in their name."""
    try:
        query = "trashed=false"
        if folder_id:
            query += f" and '{folder_id}' in parents"
        
        results = service.files().list(
            q=query,
            pageSize=1000,
            fields="nextPageToken, files(id, name, mimeType, parents, webViewLink)"
        ).execute()
        
        items = results.get('files', [])
        
        # Filter files that don't contain "final" (case-insensitive)
        files_to_delete = [
            f for f in items 
            if 'final' not in f['name'].lower() and f['mimeType'] != 'application/vnd.google-apps.folder'
        ]
        
        return files_to_delete
    
    except HttpError as error:
        print(f'An error occurred: {error}')
        return []


def delete_file(service, file_id, file_name, dry_run=True):
    """Delete a file from Google Drive."""
    if dry_run:
        print(f"[DRY RUN] Would delete: {file_name} (ID: {file_id})")
        return True
    
    try:
        service.files().delete(fileId=file_id).execute()
        print(f"✓ Deleted: {file_name}")
        return True
    except HttpError as error:
        print(f"✗ Failed to delete {file_name}: {error}")
        return False


def main():
    parser = argparse.ArgumentParser(
        description='Delete Google Drive files without "final" in their name from house folders'
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Preview files that would be deleted without actually deleting them'
    )
    
    args = parser.parse_args()
    
    print("Fetching configuration from Supabase...")
    supabase_url, supabase_key = get_supabase_config()
    
    print("Fetching house folders...")
    house_folders = get_house_folders(supabase_url, supabase_key)
    print(f"✓ Found {len(house_folders)} house folder(s)")
    for folder_id, house_name in house_folders:
        print(f"  • {house_name}")
    
    print("\nFetching Google credentials...")
    creds = get_credentials_from_supabase(supabase_url, supabase_key)
    print("✓ Authenticated with Google Drive")
    service = build('drive', 'v3', credentials=creds)
    
    print("\nScanning house folders for files without 'final' in their name...")
    all_files_to_delete = []
    for folder_id, house_name in house_folders:
        print(f"  Scanning {house_name}...")
        files = list_files_without_final(service, folder_id)
        all_files_to_delete.extend(files)
    
    files_to_delete = all_files_to_delete
    
    if not files_to_delete:
        print("\n✓ No files found without 'final' in their name!")
        return
    
    print(f"\nFound {len(files_to_delete)} file(s) to delete:")
    print("-" * 80)
    for f in files_to_delete:
        print(f"  • {f['name']}")
        print(f"    Link: {f.get('webViewLink', 'N/A')}")
    print("-" * 80)
    
    if args.dry_run:
        print("\n[DRY RUN MODE] No files were deleted.")
        print("Run without --dry-run to actually delete these files.")
        return
    
    # Confirm deletion
    response = input(f"\nAre you sure you want to delete {len(files_to_delete)} file(s)? (yes/no): ")
    if response.lower() != 'yes':
        print("Aborted.")
        return
    
    print("\nDeleting files...")
    success_count = 0
    for f in files_to_delete:
        if delete_file(service, f['id'], f['name'], dry_run=False):
            success_count += 1
    
    print(f"\n✓ Successfully deleted {success_count}/{len(files_to_delete)} file(s)")


if __name__ == '__main__':
    main()
