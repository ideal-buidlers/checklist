"use client";

import { useEffect } from "react";
import Script from "next/script";
import { useAuth } from "../auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isAuthenticated, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, loading, router]);

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

  if (!isAuthenticated) {
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
          <button
            className="btn danger"
            id="popover-delete"
            style={{ marginRight: "auto" }}
          >
            Delete
          </button>
          <span className="popover-hint">⌘/Ctrl+Enter to save</span>
          <button className="btn secondary" id="popover-cancel">
            Cancel
          </button>
          <button className="btn" id="popover-save">
            Save
          </button>
        </div>
      </div>
      <div
        className="popover"
        id="house-popover"
        style={{ width: "380px", padding: "16px" }}
      >
        <div className="popover-title">New House</div>
        <div className="popover-subtitle">
          Add a house to your build portfolio
        </div>
        <div style={{ marginTop: "16px" }}>
          <div style={{ marginBottom: "14px" }}>
            <label
              htmlFor="house-name-input"
              style={{
                fontSize: "11px",
                fontWeight: "600",
                color: "#24292f",
                display: "block",
                marginBottom: "6px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              House Address *
            </label>
            <input
              id="house-name-input"
              type="text"
              placeholder="e.g., 519 E Farnum"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d0d7de",
                borderRadius: "6px",
                fontSize: "14px",
                fontFamily: "inherit",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#1f6feb")}
              onBlur={(e) => (e.target.style.borderColor = "#d0d7de")}
            />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="house-slack-input"
              style={{
                fontSize: "11px",
                fontWeight: "600",
                color: "#24292f",
                display: "block",
                marginBottom: "6px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Slack Channel
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span
                style={{
                  color: "#57606a",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                #
              </span>
              <input
                id="house-slack-input"
                type="text"
                placeholder="e.g., 519_farnum"
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  border: "1px solid #d0d7de",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#1f6feb")}
                onBlur={(e) => (e.target.style.borderColor = "#d0d7de")}
              />
            </div>
            <div
              style={{ fontSize: "11px", color: "#57606a", marginTop: "4px" }}
            >
              Optional — for auto-sync from Slack messages
            </div>
          </div>
        </div>
        <div
          className="popover-actions"
          style={{
            marginTop: "18px",
            paddingTop: "14px",
            borderTop: "1px solid #e5e5e5",
          }}
        >
          <span className="popover-hint">⌘/Ctrl+Enter to save</span>
          <button className="btn secondary" id="house-popover-cancel">
            Cancel
          </button>
          <button className="btn" id="house-popover-save">
            Add House
          </button>
        </div>
      </div>
      <div className="mobile-menu-backdrop" id="mobile-menu-backdrop"></div>
      <div className="mobile-menu" id="mobile-menu">
        <div className="mobile-menu-header">
          <div className="mobile-menu-title">Menu</div>
          <button className="mobile-menu-close" id="mobile-menu-close">
            ×
          </button>
        </div>
        <div className="mobile-menu-section">
          <div className="mobile-menu-section-title">Actions</div>
          <button className="mobile-menu-item" id="mobile-sync-slack">
            <span>🔄</span>
            <span>Sync from Slack</span>
          </button>
          <button className="mobile-menu-item" id="mobile-add-house">
            <span>+</span>
            <span>Add House</span>
          </button>
        </div>
        <div className="mobile-menu-section" id="mobile-costs-section">
          <div className="mobile-menu-section-title">House Costs</div>
          <div id="mobile-costs-list"></div>
        </div>
        <div
          className="mobile-menu-section"
          style={{
            marginTop: "auto",
            borderTop: "2px solid #e5e5e5",
            borderBottom: "none",
          }}
        >
          <button
            className="mobile-menu-item"
            id="mobile-logout"
            style={{ color: "#cf222e" }}
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
      <Script src="/supabase-bridge.js" strategy="afterInteractive" />
      <Script src="/app-logic.js" strategy="afterInteractive" />
      <div style={styles.footer}>
        <a href="/privacy" style={styles.link}>
          Privacy
        </a>
        <span style={styles.separator}>•</span>
        <a href="/tos" style={styles.link}>
          Terms
        </a>
      </div>
    </>
  );
}

const styles = {
  footer: {
    position: "fixed",
    bottom: "8px",
    right: "12px",
    fontSize: "10px",
    color: "#ccc",
    zIndex: 1,
  },
  link: {
    color: "#ccc",
    textDecoration: "none",
    transition: "color 0.2s",
  },
  separator: {
    margin: "0 4px",
    color: "#ccc",
  },
};
