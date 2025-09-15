"use client";

import { useState } from "react";
import Link from "next/link";
import { ConnectWalletButton } from "./ConnectWalletButton";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function NavbarSeo({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const navItems = [
    { name: "About", link: "/about" },
    { name: "Pricing", link: "/pricing" },
    { name: "Generate", link: "/generate" },
    { name: "Verify", link: "/verify" },
  ];

  return (
    <div className="relative w-full">
      <header className="sticky top-4 z-50 w-full px-4 md:px-8">
        <div className="mx-auto max-w-7xl flex rounded-2xl bg-white/10 backdrop-blur-md shadow-lg items-center justify-between px-4 py-3">
          {/* Logo + Branding */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <Image
              src="/logo.png"
              alt="logo"
              width={50}
              height={50}
              className="rounded-xl"
            />
            <h1 className="text-2xl font-bold tracking-wide text-white">
              seo.ai
            </h1>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6 text-lg cursor-pointer">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.link}
                className="text-white hover:text-yellow-300 transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Wallet + Mobile Toggle */}
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="hidden md:block">
              <ConnectWalletButton />
            </div>
            <button
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full px-4 md:hidden">
            <div className="mt-2 rounded-2xl bg-white/10 backdrop-blur-md shadow-md flex flex-col items-center gap-4 py-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.link}
                  className="text-white hover:text-yellow-300 text-lg transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <ConnectWalletButton />
            </div>
          </div>
        )}
      </header>

      {children}
    </div>
  );
}
