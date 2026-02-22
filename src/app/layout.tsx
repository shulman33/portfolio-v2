import type { Metadata } from "next";
import { Syne, Fragment_Mono, DM_Sans } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const fragmentMono = Fragment_Mono({
  variable: "--font-fragment-mono",
  subsets: ["latin"],
  weight: "400",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Sam Shulman — Software Engineer & AI Builder",
  description:
    "Portfolio of Samuel Shulman. Software engineer building AI-native applications with Next.js, Python, LangChain, and Gemini.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${syne.variable} ${fragmentMono.variable} ${dmSans.variable} antialiased`}
      >
        <a
          href="#hero"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[10001] focus:bg-green focus:text-void focus:px-4 focus:py-2 font-mono text-sm"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
