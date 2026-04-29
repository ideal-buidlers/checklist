"use client";

import { useEffect } from "react";
import Script from "next/script";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase";

export default function Home() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    createClient()
      .auth.getSession()
      .then(({ data: { session } }) => {
        if (session?.access_token) {
          window.__SUPABASE_TOKEN = session.access_token;
        }
      });
  }, [user]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <div className="app">
        <div className="tabs">
          <div className="brand" title="Ideal Builders">
            <svg
              className="brand-icon"
              viewBox="0 0 70 50"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M5 44 L5 14 L35 4 L65 14 L65 44"
                fill="none"
                stroke="#C8A157"
                strokeWidth="3.5"
                strokeLinecap="square"
                strokeLinejoin="miter"
              />
            </svg>
            <span className="brand-text">IDEAL BUILDERS</span>
          </div>
          <div id="tab-strip" style={{ display: "contents" }}></div>
          <div className="spacer"></div>
          <div className="toolbar" id="toolbar-checklist">
            <button
              className="btn slack"
              id="sync-slack-btn"
              title="Read recent Slack messages and auto-check matching items"
            >
              Sync from Slack
            </button>
            <button className="btn" id="add-house-btn">
              + Add House
            </button>
            <button
              className="btn secondary"
              onClick={signOut}
              style={{ marginLeft: "8px" }}
            >
              Sign Out
            </button>
          </div>
        </div>
        <div className="banner" id="banner"></div>
        <div className="legend" id="legend">
          <span className="legend-item">
            <span className="legend-swatch manual"></span> Manual check
          </span>
          <span className="legend-item">
            <span className="legend-swatch slack"></span> From Slack — click to
            confirm
          </span>
          <span className="legend-item">
            Auto-sync runs every time you open the dashboard.
          </span>
          <span
            className="legend-item auto-sync-status"
            id="auto-sync-status"
          ></span>
        </div>
        <div className="pane" id="pane-checklist">
          <div className="checklist-wrap">
            <table className="checklist" id="checklist-table"></table>
          </div>
        </div>
        <div className="pane" id="pane-summary" style={{ display: "none" }}>
          <div className="summary" id="summary-content"></div>
        </div>
        <div className="pane" id="pane-costs" style={{ display: "none" }}></div>
      </div>
      <div className="popover-backdrop" id="popover-backdrop"></div>
      <div className="popover" id="note-popover">
        <div className="popover-title" id="popover-house"></div>
        <div className="popover-subtitle" id="popover-item"></div>
        <textarea
          id="popover-textarea"
          placeholder="Add a note (e.g., contractor, date, blocker)…"
        ></textarea>
        <div className="popover-actions">
          <span className="popover-hint">⌘/Ctrl+Enter to save</span>
          <button className="btn secondary" id="popover-cancel">
            Cancel
          </button>
          <button className="btn" id="popover-save">
            Save
          </button>
        </div>
      </div>
      <Script
        id="supabase-config"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.__SUPABASE_URL="${process.env.NEXT_PUBLIC_SUPABASE_URL}";window.__SUPABASE_ANON_KEY="${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}";`,
        }}
      />
      <Script src="/supabase-bridge.js" strategy="afterInteractive" />
      <Script src="/app-logic.js" strategy="afterInteractive" />
    </>
  );
}
