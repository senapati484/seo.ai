"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export function AppleCards() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full py-20">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-200 font-sans">
        Get to know your iSad.
      </h2>
      <Carousel items={cards} />
    </div>
  );
}

const data = [
  {
    category: "SEO Analysis",
    title: "AI-driven SEO Insights",
    src: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80",
    content: (
      <p>Generate detailed SEO reports instantly with AI-powered algorithms.</p>
    ),
  },
  {
    category: "Decentralized Storage",
    title: "Immutable IPFS Reports",
    src: "https://images.unsplash.com/photo-1531554694128-c4c6665f59c2?q=80",
    content: (
      <p>Store reports on IPFS via Pinata, ensuring tamper-proof records.</p>
    ),
  },
  {
    category: "Blockchain Verification",
    title: "Avalanche C-Chain Proof",
    src: "https://images.unsplash.com/photo-1713869791518-a770879e60dc?q=80",
    content: (
      <p>Verify report authenticity immutably on Avalanche blockchain.</p>
    ),
  },
  {
    category: "PDF Generation",
    title: "Download Verifiable Reports",
    src: "https://images.unsplash.com/photo-1599202860130-f600f4948364?q=80",
    content: <p>Export SEO data as tamper-proof, verifiable PDF reports.</p>,
  },
  {
    category: "Web3 Authentication",
    title: "MetaMask Integration",
    src: "https://images.unsplash.com/photo-1602081957921-9137a5d6eaee?q=80",
    content: <p>Secure wallet connection ensures transparency and privacy.</p>,
  },
  {
    category: "Report Management",
    title: "Dashboard for Reports",
    src: "https://images.unsplash.com/photo-1511984804822-e16ba72f5848?q=80",
    content: <p>Manage, verify, and access all reports from one place.</p>,
  },
];
