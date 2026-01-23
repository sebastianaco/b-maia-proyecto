import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";


import Navbar from "@/components/Navbar";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});


const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "b-maia | El portal del mundo apícola",
  description: "Noticias, tecnología y productos de la colmena.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // idioma
    <html lang="es">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-gray-50`}
      >
        
        <Navbar />

       
        {children}
      </body>
    </html>
  );
}
