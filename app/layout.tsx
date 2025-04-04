import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google'
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "zmov",
  description: "Watch your favorite movies and shows for free!",
  keywords: "zmov, 123movies, 123movie, 123 movies, movies123, free movies, watch movies online, movies123, fmovies, putlocker, solarmovies",
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.className} antialiased`}
      >
        {children}
      </body>
      <GoogleAnalytics gaId="G-K8YZBHVLJ9" />
    </html>
  );
}
