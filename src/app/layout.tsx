import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/lib/hooks/use-auth";
import { CartProvider } from "@/lib/hooks/use-cart";
import { OrdersProvider } from "@/lib/hooks/use-orders";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "It&apos;s Your Choice - Shop with Confidence",
  description: "Discover amazing products at great prices. Fast shipping, secure payments, and excellent customer service.",
  keywords: ["ecommerce", "shopping", "online store", "products", "deals"],
  authors: [{ name: "It&apos;s Your Choice" }],
  creator: "It&apos;s Your Choice",
  publisher: "It&apos;s Your Choice",
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
    title: "It&apos;s Your Choice - Shop with Confidence",
    description: "Discover amazing products at great prices. Fast shipping, secure payments, and excellent customer service.",
    siteName: "It&apos;s Your Choice",
  },
  twitter: {
    card: "summary_large_image",
    title: "It&apos;s Your Choice - Shop with Confidence",
    description: "Discover amazing products at great prices. Fast shipping, secure payments, and excellent customer service.",
    creator: "@itsyourchoice",
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
        <AuthProvider>
          <CartProvider>
            <OrdersProvider>
              {children}
            </OrdersProvider>
          </CartProvider>
        </AuthProvider>
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
