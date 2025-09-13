import { AppleCards } from "@/components/home/AppleCards";
import HeroSection from "@/components/home/HeroSection";
import { TabSection } from "@/components/home/TabSection";

export default function Home() {
  return (
    <main className="relative">
      <HeroSection />

      <section className="relative z-10 w-full py-20">
        <div className="container px-4 mx-auto">
          <TabSection />
        </div>
      </section>

      <section className="relative z-10 w-full py-20">
        <div className="container px-4 mx-auto">
          <AppleCards />
        </div>
      </section>

      {/* <section className="relative z-10 w-full py-20">
        <div className="container px-4 mx-auto text-center">
          <h2 className="mb-8 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
            Ready to boost your website&apos;s performance?
          </h2>
          <p className="max-w-2xl mx-auto mb-12 text-xl text-gray-600 dark:text-gray-300">
            Get started with our AI-powered SEO analysis today and see immediate
            results.
          </p>
          <button className="px-8 py-4 text-lg font-semibold text-white transition-all duration-300 bg-blue-600 rounded-full hover:bg-blue-700 hover:scale-105">
            Start Free Analysis
          </button>
        </div>
      </section> */}
    </main>
  );
}
