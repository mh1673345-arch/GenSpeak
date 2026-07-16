import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GenSpeak | Understand the Internet",
  description: "The world's most beautiful and intelligent platform for understanding Gen Z, Gen Alpha, internet slang, memes, emojis, gaming language, and online trends.",
  metadataBase: new URL("https://genspeak.app"),
  openGraph: {
    title: "GenSpeak | Understand the Internet",
    description: "The world's most beautiful and intelligent platform for understanding Gen Z, Gen Alpha, internet slang, memes, emojis, gaming language, and online trends.",
    url: "https://genspeak.app",
    siteName: "GenSpeak",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GenSpeak | Understand the Internet",
    description: "The world's most beautiful and intelligent platform for understanding Gen Z, Gen Alpha, internet slang, memes, emojis, gaming language, and online trends.",
  },
  verification: {
    google: "google-search-console-verification-token-12345",
  }
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal?: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#030712] text-[#F9FAFB] selection:bg-[#8B5CF6]/30 selection:text-white">
        {/* Google Analytics GA4 Script Integration */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GENSPEAK2026"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GENSPEAK2026');
          `}
        </Script>

        {/* Microsoft Clarity Script Integration */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window,document,"clarity","script","clarity-project-id-999");
          `}
        </Script>

        {/* Sentry Error Logging System Mock Handler */}
        <Script id="sentry-logger" strategy="afterInteractive">
          {`
            window.sentryMock = {
              captureException: function(err) {
                console.warn("[Sentry Captured Exception]:", err);
              },
              captureMessage: function(msg) {
                console.log("[Sentry Captured Message]:", msg);
              }
            };
          `}
        </Script>

        <AuthProvider>
          {children}
          {modal}
        </AuthProvider>
      </body>
    </html>
  );
}
