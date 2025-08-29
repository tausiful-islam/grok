import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "E-Commerce Platform - Shop with Confidence",
  description: "Discover amazing products at great prices. Fast shipping, secure payments, and excellent customer service.",
  keywords: ["ecommerce", "shopping", "online store", "products", "deals"],
  authors: [{ name: "E-Commerce Platform" }],
  creator: "E-Commerce Platform",
  publisher: "E-Commerce Platform",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "E-Commerce Platform - Shop with Confidence",
    description: "Discover amazing products at great prices. Fast shipping, secure payments, and excellent customer service.",
    siteName: "E-Commerce Platform",
  },
  twitter: {
    card: "summary_large_image",
    title: "E-Commerce Platform - Shop with Confidence",
    description: "Discover amazing products at great prices. Fast shipping, secure payments, and excellent customer service.",
    creator: "@ecommerceplatform",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  );
}
