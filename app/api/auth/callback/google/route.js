import { createClient } from "@supabase/supabase-js";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return Response.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/?error=${encodeURIComponent(error)}`,
    );
  }

  if (!code) {
    return Response.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/?error=no_code`,
    );
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`;

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }).toString(),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error("Token exchange failed:", error);
      return Response.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/?error=token_exchange_failed`,
      );
    }

    const tokens = await tokenResponse.json();
    const { access_token, refresh_token, expires_in } = tokens;

    if (!refresh_token) {
      console.error("No refresh token received from Google");
      return Response.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/?error=no_refresh_token`,
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    );

    const { error: insertError } = await supabase.from("google_tokens").upsert(
      {
        refresh_token,
        access_token,
        expires_at: new Date(Date.now() + expires_in * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );

    if (insertError) {
      console.error("Failed to store tokens in Supabase:", insertError);
      return Response.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/?error=storage_failed`,
      );
    }

    return Response.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/?google_auth=success`,
    );
  } catch (error) {
    console.error("OAuth callback error:", error);
    return Response.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/?error=callback_error`,
    );
  }
}
