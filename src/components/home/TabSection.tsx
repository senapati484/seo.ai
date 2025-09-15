"use client";
import React from "react";
import { ContainerScroll } from "../ui/container-scroll-animation";
import Image from "next/image";

export function TabSection() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-bold text-black md:text-[5rem]">
              How seo.ai Works
            </h1>
            <p className="mt-4 max-w-2xl text-base text-neutral-600 dark:text-neutral-300">
              From analysis to verification: submit a URL, extract SEO metrics,
              generate a verifiable PDF, and store the hash immutably on IPFS
              and Avalanche C-Chain. Anyone can verify your report with
              cryptographic certainty.
            </p>
          </>
        }
      >
        <Image
          src="/next.svg"
          alt="hero"
          width={1200}
          height={720}
          className="h-auto w-full object-contain"
          priority
        />
      </ContainerScroll>
    </div>
  );
}
