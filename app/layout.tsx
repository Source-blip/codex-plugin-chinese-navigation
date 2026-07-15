import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Codex Plugins & Apps Directory",
  description:
    "A bilingual directory for finding Codex plugins and ChatGPT apps by everyday Chinese or English keywords.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
  },
  openGraph: {
    title: "Codex Plugins & Apps Directory",
    description: "Search Codex plugins and ChatGPT apps in Chinese or English.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
