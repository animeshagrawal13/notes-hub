import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import AppShell from "@/components/layout/AppShell";
import { THEME_INIT_SCRIPT } from "@/lib/theme";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "College Notes Hub | SGSITS B.Tech First Year",
  description:
    "Unit-wise notes, official syllabus, class slides and previous year questions for every first-year subject — Semester I & II.",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Apply a stored dark-mode preference before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="antialiased pb-16 md:pb-0">
        <Providers>
          <AppShell>{children}</AppShell>
          {modal}
        </Providers>
      </body>
    </html>
  );
}
