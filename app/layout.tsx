import type { Metadata } from "next";

import "./globals.css";

import Footer from "@/components/Footer";

import { AuthHydrator } from "./providers";
import Navbar from "@/components/NavBar";
import { AnimatePresence } from "motion/react";



export const metadata: Metadata = {
  title: {
    default: "RecyclerClub Dehradun — Scrap Pickup at Your Doorstep, Fair Prices",
    template: "%s | RecyclerClub Dehradun",
  },
  description:
    "Doorstep scrap pickup in Dehradun with instant AI-based price estimates. A verified local kabadiwala partner weighs your paper, plastic, metal, e-waste, and old appliances, and pays you on the spot.",
  keywords: [
    "scrap pickup Dehradun",
    "kabadiwala Dehradun",
    "sell scrap online Dehradun",
    "e-waste pickup Dehradun",
    "old newspaper price Dehradun",
    "scrap dealer near me Dehradun",
    "raddi wala Dehradun",
    "old furniture pickup Dehradun",
  ],
  metadataBase: new URL("https://recyclerclub.com"),
  alternates: {
    canonical: "https://recyclerclub.com/dehradun",
  },
  openGraph: {
    title: "RecyclerClub Dehradun — Scrap Pickup at Your Doorstep, Fair Prices",
    description:
      "Book a doorstep pickup in Dehradun, get a fair AI-estimated price, and get paid on the spot by a verified local partner.",
    url: "https://recyclerclub.com/dehradun",
    siteName: "RecyclerClub",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-image-dehradun.jpg",
        width: 1200,
        height: 630,
        alt: "RecyclerClub Dehradun — doorstep scrap pickup",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RecyclerClub Dehradun — Scrap Pickup at Your Doorstep",
    description:
      "Doorstep scrap pickup in Dehradun with instant AI pricing and verified local partners.",
    images: ["/og-image-dehradun.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>
) {
  return (
    <html
      lang="en"
     
    >
      <body className="min-h-full flex flex-col">
        <AuthHydrator>
        
        <Navbar/>
        <AnimatePresence mode="wait">
        
          {children}
        
        </AnimatePresence>
        </AuthHydrator>
        <Footer/>

        </body>
    </html>
  );
}
