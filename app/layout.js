import "./globals.css";
import { AuthProvider } from "./AuthProvider";

export const metadata = {
  title: "Ideal Builders — House Build Checklist",
  description:
    "Construction checklist + cost tracker dashboard for builds across multiple houses",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
