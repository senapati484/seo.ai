// import { AppleCards } from "@/components/home/AppleCards";
import HeroSection from "@/components/home/HeroSection";
// import { TabSection } from "@/components/home/TabSection";

export default function Home() {
  return (
    <main className="relative">
      <HeroSection />

      {/* <section className="relative z-10 w-full py-20">
        <div className="container px-4 mx-auto">
          <TabSection />
        </div>
      </section> */}

      {/* <section className="relative z-10 w-full py-20">
        <div className="container px-4 mx-auto">
          <AppleCards />
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="relative z-10 w-full py-24">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-pink-600/30 blur-3xl" />
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center bg-white/10 backdrop-blur-xl rounded-3xl border border-white/10 p-10">
            <h2 className="mb-5 text-4xl md:text-5xl font-extrabold text-white">
              Bring Trust & Transparency to SEO with Web3
            </h2>
            <p className="max-w-2xl mx-auto mb-8 text-lg text-gray-200">
              Generate unlimited SEO reports, get AI-powered insights, and
              secure verification on Avalanche blockchain.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/generate"
                className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-lg hover:scale-105 hover:shadow-purple-500/30 transition-all"
              >
                Start Free Analysis 🚀
              </a>
              <a
                target="_blank"
                href="https://github.com/senapati484/seo.ai"
                className="px-8 py-4 text-lg font-semibold text-white/90 bg-white/10 border border-white/20 rounded-full hover:bg-white/20 transition-all"
              >
                View on GitHub 💻
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
