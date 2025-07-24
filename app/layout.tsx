import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "Chicago ICE Analysis | Racial & Economic Segregation Visualization",
  description: "Interactive visualization of racial and economic segregation patterns in Chicago using the Index of Concentration at the Extremes (ICE)",
  keywords: ["Chicago", "segregation", "ICE", "racial equity", "economic inequality", "census data", "visualization"],
  authors: [{ name: "Urban Health Equity Lab" }],
  openGraph: {
    title: "Chicago ICE Analysis",
    description: "Visualizing racial and economic segregation patterns in Chicago neighborhoods",
    type: "website",
    locale: "en_US",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}