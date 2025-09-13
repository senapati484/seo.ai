"use client";

import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IconX } from "@tabler/icons-react";
import { SignedIn, SignedOut, SignIn, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useWeb3 } from "@/context/web3Context";
import { ConnectWalletButton } from "./ConnectWalletButton";

export function NavbarSeo({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navItems = [
    { name: "About", link: "/about" },
    { name: "Pricing", link: "/pricing" },
    { name: "Generate", link: "/generate" },
    { name: "Verify", link: "/verify" },
  ];

  const { wallet } = useWeb3();

  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  return (
    <div className="relative w-full">
      <Navbar>
        {/* ✅ Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} className="text-blue-600" />

          {/* Login functionality temporarily disabled */}
          <div className="flex items-center justify-center gap-4">
            {/* <SignedIn>
              <UserButton afterSignOutUrl="/generate" />
            </SignedIn>
            <SignedOut>
              <Dialog
                open={isAuthDialogOpen}
                onOpenChange={setIsAuthDialogOpen}
              >
                <NavbarButton variant="primary" className="rounded-2xl">
                  Login
                </NavbarButton>
                <DialogTrigger asChild>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                      Login
                    </DialogTitle>
                    <DialogClose asChild>
                      <button className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                        <IconX className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                      </button>
                    </DialogClose>
                  </DialogHeader>
                  <div className="mt-4">
                    <SignIn
                      appearance={{
                        elements: {
                          formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
                        },
                      }}
                      redirectUrl="/generate"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </SignedOut> */}

            {/* {wallet?.isConnected ? (
              <p className="mt-2 text-sm text-black bg-gray-200 p-2 rounded-2xl cursor-pointer">
                {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)} •{" "}
                {wallet.balance} ETH
              </p>
            ) : (
              <NavbarButton className="rounded-2xl bg-gray-800">
                <ConnectWalletButton />
              </NavbarButton>
            )} */}
            <NavbarButton className="rounded-2xl">
              <ConnectWalletButton />
            </NavbarButton>
          </div>
        </NavBody>

        {/* ✅ Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-blue-600 "
              >
                <span className="block">{item.name}</span>
              </a>
            ))}

            <div className="flex w-full flex-col gap-4 mt-4">
              {/* Mobile login functionality temporarily disabled */}
              {/* <SignedOut>
                <Dialog
                  open={isAuthDialogOpen}
                  onOpenChange={setIsAuthDialogOpen}
                >
                  <DialogTrigger asChild>
                    <NavbarButton
                      onClick={() => setIsMobileMenuOpen(false)}
                      variant="primary"
                      className="w-full rounded-2xl"
                    >
                      Login
                    </NavbarButton>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">
                        Login
                      </DialogTitle>
                      <DialogClose asChild>
                        <button className="absolute right-2 top-2">
                          <IconX className="w-6 h-6" />
                        </button>
                      </DialogClose>
                    </DialogHeader>
                    <div className="mt-4">
                      <SignIn
                        appearance={{
                          elements: {
                            formButtonPrimary:
                              "bg-indigo-600 hover:bg-indigo-700 text-white",
                          },
                        }}
                        redirectUrl="/generate"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </SignedOut>

              <SignedIn>
                <div className="flex justify-center">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn> */}
              <NavbarButton variant="primary" className="rounded-2xl">
                <ConnectWalletButton />
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {children}
    </div>
  );
}
