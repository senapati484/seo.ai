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
import {
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
} from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export function NavbarSeo({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navItems = [
    { name: "About", link: "/about" },
    { name: "Pricing", link: "/pricing" },
    { name: "Generate", link: "/generate" },
  ];

  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  return (
    <div className="relative w-full">
      <Navbar>
        {/* ✅ Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />

          <div className="flex items-center gap-4">
            <SignedIn>
              <UserButton afterSignOutUrl="/generate" />
            </SignedIn>
            <SignedOut>
              <Dialog
                open={isAuthDialogOpen}
                onOpenChange={setIsAuthDialogOpen}
              >
                <DialogTrigger asChild>
                  <NavbarButton variant="primary" className="rounded-2xl">
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
                  {/* 👇 Clerk SignIn rendered inside your dialog */}
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
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}

            <div className="flex w-full flex-col gap-4 mt-4">
              <SignedOut>
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
                    {/* 👇 Clerk SignIn inside mobile drawer dialog */}
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
              </SignedIn>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {children}
    </div>
  );
}
