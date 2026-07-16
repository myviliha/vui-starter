import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vui-starter.dev"),
  title: {
    default: "Vui Starter — React Admin & CRM Design System",
    template: "%s · Vui Starter",
  },
  description:
    "Vui Starter is a free, open-source React admin & CRM design system built on Tailwind CSS v4, shadcn/ui and Radix Icons — install @viliha/vui-ui and ship faster.",
  keywords: [
    "react admin template",
    "tailwind css admin",
    "shadcn ui",
    "crm design system",
    "react component library",
    "next.js admin dashboard",
    "vui starter",
  ],
  openGraph: {
    title: "Vui Starter — React Admin & CRM Design System",
    description:
      "A free, open-source React admin & CRM design system on Tailwind CSS v4, shadcn/ui and Radix Icons.",
    siteName: "Vui Starter",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
