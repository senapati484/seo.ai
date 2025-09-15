"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const AboutPage = () => {
  const router = useRouter();

  const features = [
    {
      title: "SEO Analysis",
      description:
        "Generate detailed SEO reports for any URL, capturing critical metrics with AI-driven insights.",
      icon: "📊",
    },
    {
      title: "Decentralized Storage",
      description:
        "Reports stored on IPFS via Pinata ensure immutability and security.",
      icon: "🗂️",
    },
    {
      title: "Blockchain Verification",
      description:
        "Immutable proof of SEO reports stored on the Avalanche C-Chain.",
      icon: "⛓️",
    },
    {
      title: "Web3 Authentication",
      description:
        "Seamless wallet connection via MetaMask for secure and transparent interactions.",
      icon: "🔑",
    },
  ];

  const workflowSteps = [
    "Submit URL for SEO analysis",
    "Extract critical metrics",
    "Generate PDF & compute SHA-256 hash",
    "Store on IPFS & Avalanche C-Chain",
    "Verify authenticity via blockchain",
  ];

  const benefits = [
    {
      problem: "Centralized Trust",
      solution:
        "Immutable records on Avalanche ensure tamper-proof verification.",
    },
    {
      problem: "Tamper Risk",
      solution:
        "SHA-256 hashing ensures even the smallest alteration is detected.",
    },
    {
      problem: "Complex Verification",
      solution:
        "Anyone can independently verify authenticity — no gatekeepers.",
    },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 text-center">
        <motion.h1
          className="mb-6 text-5xl font-extrabold tracking-tight text-white sm:text-7xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Decentralized{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            SEO Verification
          </span>
        </motion.h1>
        <motion.p
          className="max-w-3xl mx-auto mb-10 text-xl text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Bringing trust and transparency to SEO analytics through Web3 —
          immutable reports stored on IPFS and verified on the Avalanche
          blockchain.
        </motion.p>
        <Button
          onClick={() => router.push("/generate")}
          className="px-10 py-6 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-lg hover:scale-105 hover:shadow-purple-500/30 transition-all"
        >
          Generate My SEO Report 🚀
        </Button>
      </section>

      {/* What is seo.ai */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-10">
          <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
            What is seo.ai?
          </h2>
          <p className="text-lg text-gray-300">
            seo.ai is a decentralized application designed to revolutionize SEO
            reporting by adding a layer of irrefutable authenticity and
            permanence. Every report is analyzed, hashed, stored on IPFS, and
            immutably verified on the Avalanche C-Chain.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 max-w-7xl mx-auto">
        <h2 className="mb-10 text-center text-3xl font-bold text-white md:text-4xl">
          Key Features & Technologies
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 hover:shadow-lg hover:scale-105 transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="flex items-center justify-center w-16 h-16 mb-4 text-3xl bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-md">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Workflow */}
      <section className="py-20 max-w-5xl mx-auto text-center">
        <h2 className="mb-8 text-3xl font-bold text-white md:text-4xl">
          How It Works
        </h2>
        <div className="flex flex-col md:flex-row md:justify-center gap-6">
          {workflowSteps.map((step, index) => (
            <motion.div
              key={index}
              className="flex-1 p-6 bg-white/5 rounded-2xl border border-white/10 text-white backdrop-blur-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <span className="text-xl font-bold text-blue-400">
                Step {index + 1}
              </span>
              <p className="mt-2 text-gray-300">{step}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Blockchain Benefits */}
      <section className="py-20 max-w-6xl mx-auto">
        <h2 className="mb-10 text-center text-3xl font-bold text-white md:text-4xl">
          Why Web3 Verification?
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {benefits.map((item, index) => (
            <motion.div
              key={index}
              className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-lg hover:scale-105 transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <h3 className="text-xl font-semibold text-blue-400">
                Problem: {item.problem}
              </h3>
              <p className="mt-2 text-gray-300">{item.solution}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <div className="p-10 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Ready to Verify Your SEO Reports?
            </h2>
            <p className="max-w-2xl mx-auto mb-8 text-gray-300">
              Start generating decentralized reports today and bring
              transparency, trust, and permanence to your SEO analytics.
            </p>
            <Button
              onClick={() => router.push("/generate")}
              className="px-10 py-6 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-lg hover:scale-105 hover:shadow-purple-500/30 transition-all"
            >
              Get Started ⚡
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
