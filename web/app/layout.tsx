// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Relayer",
  description:
    "A visual interface that shows how accounts are connected and interact over time. Designed for devs, users, and analysts, it brings context to raw on-chain data without needing to sift through complex transaction logs.",

  metadataBase: new URL("https://relayer.theaanurag.xyz"),

   icons: {
      icon: { url: "/file.svg", sizes: "any" },
   },

  openGraph: {
    title: "Relayer",
    description:
      "Explore how accounts are visually connected over time. For devs, users, analysts.",
    url: "https://relayer.theaanurag.xyz",
    siteName: "Relayer",
    images: [
      {
        url: "/metadata.jpg",
        width: 1200,
        height: 630,
        alt: "Relayer Visual Account Interface",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Relayer",
    description:
      "Explore how accounts are visually connected over time. For devs, users, analysts.",
    images: ["/metadata.jpg"],
    creator: "@theaanurag", // optional
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
