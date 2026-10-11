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
    "Doorstep collection of large scrap in Dehradun - fridges, washing machines, air conditioners, televisions, computers, batteries, generators and end-of-life vehicles. A verified local partner values it in front of you and pays on the spot.",
  keywords: [
    "old fridge sell Dehradun",
    "sell old washing machine Dehradun",
    "old AC sale Dehradun",
    "scrap car Dehradun",
    "old TV sell Dehradun",
    "e-waste pickup Dehradun",
    "scrap dealer near me Dehradun",
    "kabadiwala Dehradun",
  ],
  metadataBase: new URL("https://recyclerclub.com"),
  alternates: {
    canonical: "https://recyclerclub.com/dehradun",
  },
  openGraph: {
    title: "RecyclerClub Dehradun — Scrap Pickup at Your Doorstep, Fair Prices",
    description:
      "Selling an old fridge, AC, TV or car in Dehradun? Book a doorstep pickup at a published rate and get paid on the spot by a verified local partner.",
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
