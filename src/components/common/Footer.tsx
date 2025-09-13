import React from "react";
import Link from "next/link";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const navigation = {
    main: [
      { name: "About", href: "/about" },
      { name: "Pricing", href: "/pricing" },
      { name: "Generate", href: "/generate" },
      { name: "Blog", href: "#" },
      { name: "Documentation", href: "#" },
    ],
    social: [
      {
        name: "GitHub",
        href: "https://github.com/senapati484",
        icon: Github,
      },
      {
        name: "Twitter",
        href: "https://twitter.com/yourusername",
        icon: Twitter,
      },
      {
        name: "LinkedIn",
        href: "https://linkedin.com/in/yourusername",
        icon: Linkedin,
      },
      {
        name: "Email",
        href: "mailto:hello@example.com",
        icon: Mail,
      },
    ],
  };

  return (
    <div className="w-full">
      <footer className="relative max-w-7xl mx-auto overflow-hidden p-2.5 rounded-t-xl bg-white/80 backdrop-blur-xl">
        <div className="absolute inset-0 -z-10 bg-grid-white/5" />
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            {navigation.social.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 hover:text-white transition-colors duration-200"
              >
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </a>
            ))}
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-sm leading-5 text-gray-800">
              &copy; {currentYear} SEO Analyzer. All rights reserved.
            </p>
            <nav className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              {navigation.main.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-800 hover:text-gray-700 transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        <div className="my-8 border-t border-white/10 pt-8 md:flex md:items-center md:justify-center">
          <p className="text-center text-xs leading-5 text-gray-400">
            Made with ❤️ by{" "}
            <a
              href="https://github.com/senapati484"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-white hover:text-indigo-400 transition-colors duration-200"
            >
              Sayan Senapati
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
