import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavbarSeo } from "@/components/common/Navbar";
import GradientBlinds from "@/components/ui/GradientBlinds";
import { ClerkProvider } from "@clerk/nextjs";
import Footer from "@/components/common/Footer";
import { Web3Provider } from "@/context/web3Context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Seo.ai",
  description:
    "This is an seo generator for the website and gives ishight of the data they have on the website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900`}
        cz-shortcut-listen="true"
      >
        <Web3Provider>
          {/* Background Gradient */}
          <div className="fixed inset-0 pointer-events-auto sm:pointer-events-none">
            <GradientBlinds
              gradientColors={["#FFFFFF", "#E6E6FF"]}
              angle={45}
              noise={0.3}
              blindCount={12}
              blindMinWidth={50}
              spotlightRadius={0.5}
              spotlightSoftness={1}
              spotlightOpacity={0.8}
              mouseDampening={0.15}
              distortAmount={0.2}
              shineDirection="left"
              mixBlendMode="lighten"
            />
          </div>
          <div className="flex-1 flex flex-col">
            <NavbarSeo>
              <main className="flex-1">{children}</main>
            </NavbarSeo>
            <Footer />
          </div>
        </Web3Provider>
      </body>
    </html>
  );
}
