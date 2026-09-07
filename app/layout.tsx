import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SafeConnect — Report Safely, Stay Anonymous",
  description:
    "A secure, anonymous platform for college students to report harassment, bullying, or unsafe behaviour. Your identity is never collected — not even by us.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-surface">
        {children}
      </body>
    </html>
  );
}
