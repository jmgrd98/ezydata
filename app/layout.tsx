import type { Metadata } from "next";
import { Inter, Comfortaa, Montserrat } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
});

const comfortaa = Comfortaa({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-comfortaa',
});

const montserrat = Montserrat({
    weight: "600",
    subsets: ['latin'],
    variable: '--font-montserrat',
})

export const metadata: Metadata = {
  title: "Ezydata",
  description: "AI-powered low code platform for data analysts.",
  icons: {
    icon: '/assets/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${comfortaa.variable} ${montserrat.variable}`}>
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}