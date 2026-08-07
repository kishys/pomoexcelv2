import type { Metadata } from "next";
import { Inter, DM_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500"]
});

const dmMono = DM_Mono({ 
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-mono"
});

export const metadata: Metadata = {
  title: "POMO",
  description: "A single-focus timer experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${dmMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
