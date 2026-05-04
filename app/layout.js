import "./globals.css";
import { AuthProvider } from "./auth";
import Script from "next/script";

export const metadata = {
  title: "Ideal Builders — House Build Checklist",
  description:
    "Construction checklist + cost tracker dashboard for builds across multiple houses",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Script
          id="supabase-config"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.__SUPABASE_URL="${process.env.NEXT_PUBLIC_SUPABASE_URL}";window.__SUPABASE_ANON_KEY="${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}";console.log("[SUPABASE CONFIG] URL set to:", window.__SUPABASE_URL);`,
          }}
        />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
