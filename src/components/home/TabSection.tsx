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
              Make your website
              <br />
              <span className="text-4xl font-bold leading-none md:text-[5rem]">
                an unforgettable experience
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-base text-neutral-600 dark:text-neutral-300">
              Create stunning landing pages, modern animations and effects that
              keep your users engaged. With our tools, its easier than ever.
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
