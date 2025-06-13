import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { SessionProviderWrapper } from './SessionProvider'
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "테스트",
  description: "테스트입니다",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SessionProviderWrapper>{children}</SessionProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
