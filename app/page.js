"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { authenticate } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const success = authenticate(password);

    if (success) {
      router.push("/home");
      router.refresh();
    } else {
      setError("Incorrect password");
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.brand}>
          <svg
            style={styles.brandIcon}
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
          <span style={styles.brandText}>IDEAL BUILDERS</span>
        </div>

        <h1 style={styles.title}>Sign In</h1>
        <p style={styles.subtitle}>
          Access your construction checklist dashboard
        </p>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              style={styles.input}
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button
            type="submit"
            disabled={loading}
            style={loading ? styles.buttonDisabled : styles.button}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>Contact your administrator for access</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fafafa",
    padding: "20px",
  },
  card: {
    background: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 24px rgba(0, 0, 0, 0.08)",
    padding: "48px",
    width: "100%",
    maxWidth: "420px",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "32px",
    justifyContent: "center",
  },
  brandIcon: {
    width: "40px",
    height: "32px",
  },
  brandText: {
    fontFamily: "Georgia, Times New Roman, serif",
    fontSize: "18px",
    letterSpacing: "0.18em",
    color: "#1a1a1a",
    fontWeight: "400",
  },
  title: {
    fontSize: "28px",
    fontWeight: "600",
    color: "#111",
    margin: "0 0 8px 0",
    textAlign: "center",
  },
  subtitle: {
    fontSize: "14px",
    color: "#57606a",
    textAlign: "center",
    margin: "0 0 32px 0",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#24292f",
  },
  input: {
    padding: "10px 12px",
    border: "1px solid #d0d7de",
    borderRadius: "6px",
    fontSize: "14px",
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color 0.15s",
  },
  error: {
    padding: "12px",
    background: "#ffebe9",
    border: "1px solid #ff8182",
    borderRadius: "6px",
    color: "#82071e",
    fontSize: "13px",
  },
  button: {
    padding: "12px",
    background: "#1f6feb",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background 0.15s",
  },
  buttonDisabled: {
    padding: "12px",
    background: "#8c959f",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "not-allowed",
  },
  footer: {
    marginTop: "24px",
    textAlign: "center",
  },
  footerText: {
    fontSize: "13px",
    color: "#57606a",
    margin: "0",
  },
  link: {
    color: "#1f6feb",
    textDecoration: "none",
  },
};
