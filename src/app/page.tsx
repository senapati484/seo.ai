import { HeroSection } from "@/components/home/HeroSection";

export default function Home() {
  return (
    <div className="m-0 p-0 top-0">
      {/* <HeroSectionOne /> */}
      <div className="flex justify-center items-center h-[200vh]">
        <HeroSection />
      </div>
    </div>
  );
}
