"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const AboutPage = () => {
  const router = useRouter();

  const features = [
    {
      title: "AI-Powered Analysis",
      description:
        "Advanced algorithms analyze your website with precision, giving you actionable insights in seconds.",
      icon: "🤖",
    },
    {
      title: "Real-time Reports",
      description:
        "Instant, beautiful reports to help you improve your site performance right away.",
      icon: "📊",
    },
    {
      title: "User-Friendly Interface",
      description:
        "Built for everyone — from SEO beginners to marketing experts.",
      icon: "✨",
    },
    {
      title: "Continuous Monitoring",
      description: "Stay on top of changes with automatic updates and alerts.",
      icon: "🔍",
    },
  ];

  const team = [
    {
      name: "Alex Johnson",
      role: "CEO & Founder",
      bio: "10+ years in digital marketing and AI technology.",
    },
    {
      name: "Sarah Chen",
      role: "Lead Developer",
      bio: "Expert in machine learning and web technologies.",
    },
    {
      name: "Michael Brown",
      role: "SEO Specialist",
      bio: "Helping businesses rank higher for over 8 years.",
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
          Supercharge Your{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            SEO
          </span>{" "}
          with AI
        </motion.h1>
        <motion.p
          className="max-w-2xl mx-auto mb-10 text-xl text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          seo.ai helps you generate SEO reports, get AI-driven insights, and
          understand exactly what changes improve your score.
        </motion.p>
        <Button
          onClick={() => router.push("/generate")}
          className="px-10 py-6 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-lg hover:scale-105 hover:shadow-purple-500/30 transition-all"
        >
          Run Free SEO Analysis 🚀
        </Button>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-10">
          <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
            Our Mission
          </h2>
          <p className="text-lg text-gray-300">
            At seo.ai, we believe every business deserves to be found online.
            Our mission is to simplify SEO and make website analysis accessible
            to everyone, regardless of their technical expertise.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 container mx-auto px-6">
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

      {/* Team Section */}
      <section className="py-20 container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Meet Our Team
          </h2>
          <p className="text-gray-400">
            Passionate experts dedicated to revolutionizing SEO analysis.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {team.map((member, index) => (
            <motion.div
              key={index}
              className="p-6 text-center bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:shadow-lg hover:scale-105 transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-2xl text-white font-bold shadow-md">
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <h3 className="text-xl font-semibold text-white">
                {member.name}
              </h3>
              <p className="mb-2 text-blue-400">{member.role}</p>
              <p className="text-gray-400">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-30 blur-2xl"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <div className="p-10 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/10">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Ready to improve your SEO score?
            </h2>
            <p className="max-w-2xl mx-auto mb-8 text-gray-300">
              Generate unlimited reports, get AI-powered recommendations, and
              boost your search rankings with{" "}
              <span className="text-blue-400 font-semibold">seo.ai</span>.
            </p>
            <Button
              onClick={() => router.push("/generate")}
              className="px-10 py-6 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-lg hover:scale-105 hover:shadow-purple-500/30 transition-all"
            >
              Get My SEO Report ⚡
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
