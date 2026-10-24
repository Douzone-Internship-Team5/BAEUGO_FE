import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AppQueryProvider from "./QueryProvider";
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
  title: {
    default: "배우고",
    template: "%s | 배우고",
  },
  description: "직무에 맞는 강좌를 찾고, 짧게 배우고 바로 써먹어요.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppQueryProvider>{children}</AppQueryProvider>
      </body>
    </html>
  );
}
