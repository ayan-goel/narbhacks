import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import ConvexClientProvider from "./ConvexClientProvider";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ChatGPT Wrapped",
  description: "Transform your ChatGPT conversations into stunning visual insights",
  keywords: "ChatGPT, AI, wrapped, analytics, insights, conversations",
  authors: [{ name: "ChatGPT Wrapped Team" }],
  creator: "ChatGPT Wrapped",
  publisher: "ChatGPT Wrapped",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(inter.variable, jetbrainsMono.variable)}>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className
        )}
      >
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
