import React from "react";
import type { Metadata, Viewport } from "next";
import { DM_Sans, Playfair_Display, Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { CartProvider } from "@/src/components/boty/cart-context";
import "./globals.css";
import { cn } from "@/src/lib/utils";
import { Toaster } from "@/src/components/ui/sonner";
import { INTRO_FAILSAFE_MS } from "@/src/components/boty/site-intro-decision";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600"],
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Vitoria Moreira — Terapeuta Ocupacional Infantil",
  description:
    "Terapia Ocupacional especializada em desenvolvimento infantil, autismo, TDAH e atrasos no desenvolvimento. Atendimento acolhedor e personalizado.",
  keywords: [
    "terapia ocupacional",
    "terapeuta ocupacional",
    "autismo",
    "TDAH",
    "desenvolvimento infantil",
    "criancas",
    "integracao sensorial",
  ],
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#FBF9F7",
};

/** Evita flash do conteúdo antes da intro na home (1× por sessão). Usa data-* para não conflitar com className do React. Failsafe remove o lock se o client não limpar. */
const INTRO_BOOT = `(function(){try{var r=matchMedia("(prefers-reduced-motion: reduce)").matches;if(location.pathname==="/"&&!r&&!sessionStorage.getItem("vivi-intro")){var d=document.documentElement;d.setAttribute("data-vivi-intro","pending");setTimeout(function(){if(d.getAttribute("data-vivi-intro")==="pending")d.removeAttribute("data-vivi-intro")},${INTRO_FAILSAFE_MS})}}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={cn("bg-background", "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body
        className={`${dmSans.variable} ${playfairDisplay.variable} font-sans antialiased`}
      >
        <script dangerouslySetInnerHTML={{ __html: INTRO_BOOT }} />
        <CartProvider>
          {children}
          <Toaster />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
