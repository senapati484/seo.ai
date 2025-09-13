import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavbarSeo } from "@/components/common/Navbar";
import GradientBlinds from "@/components/ui/GradientBlinds";
import { ClerkProvider } from "@clerk/nextjs";
import Footer from "@/components/common/Footer";

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
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          cz-shortcut-listen="true"
        >
          {/* Background Gradient */}
          <div className="fixed inset-0 pointer-events-auto sm:pointer-events-none">
            <GradientBlinds
              gradientColors={["#FF9FFC", "#5227FF"]}
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
          <NavbarSeo>{children}</NavbarSeo>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
