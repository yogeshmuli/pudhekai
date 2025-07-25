import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ReduxProvider from "../store/Provider"; // <-- Import the provider

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "AI-PudheKai - AI Powered Career Guidance for Young Minds",
  description: "AI-PudheKai is an AI-powered platform for career guidance, helping young minds discover their best-fit careers based on personality, interests, and abilities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.FontAwesomeConfig = { autoReplaceSvg: 'nest' };`,
          }}
        />
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ReduxProvider>
          <Toaster position="top-center" />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
