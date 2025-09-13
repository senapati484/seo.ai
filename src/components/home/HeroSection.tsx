"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const HeroSection = () => {
  const router = useRouter();

  return (
    <div className="relative flex flex-col items-center justify-center w-full min-h-screen overflow-hidden bg-transparent">
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-6xl px-4 mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="inline-block px-3 py-1 mb-4 text-sm font-medium text-blue-100 bg-blue-900/30 rounded-full backdrop-blur-sm">
            AI-Powered SEO Analysis
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300">
            Supercharge Your <br />
            <span className="text-white">Website&apos;s Performance</span>
          </h1>

          <p className="max-w-3xl mx-auto mt-6 text-lg leading-8 text-white/90">
            Get instant, comprehensive SEO insights and boost your
            website&apos;s visibility with our advanced AI-powered analysis. No
            technical skills required.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 mt-10 sm:flex-row">
            <Button
              onClick={() => router.push("/generate")}
              className="px-8 py-6 text-lg font-semibold text-white transition-all duration-300 bg-blue-600 rounded-full hover:bg-blue-700 hover:scale-105"
            >
              Analyze Your Website Now
            </Button>
            <Button
              variant="outline"
              className="px-8 py-6 text-lg font-semibold text-white transition-all duration-300 border-2 border-white/20 rounded-full hover:bg-white/10 hover:scale-105"
            >
              Watch Demo
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="grid grid-cols-2 gap-8 mt-20 sm:grid-cols-4"
        >
          {[
            { value: "10,000+", label: "Websites Analyzed" },
            { value: "95%", label: "Accuracy" },
            { value: "24/7", label: "Support" },
            { value: "1min", label: "Setup Time" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-white">{stat.value}</div>
              <div className="mt-2 text-sm font-medium text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="flex flex-col items-center text-gray-400">
          <span className="mb-2 text-sm">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full">
            <motion.div
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="w-1 h-2 mx-auto mt-2 bg-gray-400 rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
