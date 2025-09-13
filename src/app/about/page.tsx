"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const AboutPage = () => {
  const router = useRouter();

  const features = [
    {
      title: "AI-Powered Analysis",
      description: "Our advanced algorithms analyze your website with precision, providing actionable insights in seconds.",
      icon: "🤖"
    },
    {
      title: "Real-time Reports",
      description: "Get instant, comprehensive reports that help you understand and improve your website's performance.",
      icon: "📊"
    },
    {
      title: "User-Friendly Interface",
      description: "Designed for everyone, from SEO beginners to digital marketing experts.",
      icon: "✨"
    },
    {
      title: "Continuous Monitoring",
      description: "Track your website's performance over time and get notified about important changes.",
      icon: "🔍"
    }
  ];

  const team = [
    {
      name: "Alex Johnson",
      role: "CEO & Founder",
      bio: "10+ years in digital marketing and AI technology.",
      image: "/team/alex.jpg"
    },
    {
      name: "Sarah Chen",
      role: "Lead Developer",
      bio: "Expert in machine learning and web technologies.",
      image: "/team/sarah.jpg"
    },
    {
      name: "Michael Brown",
      role: "SEO Specialist",
      bio: "Helping businesses rank higher for over 8 years.",
      image: "/team/michael.jpg"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              About <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">seo.ai</span>
            </motion.h1>
            <motion.p 
              className="max-w-2xl mx-auto mb-10 text-xl text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Empowering businesses with cutting-edge AI technology to dominate search engine rankings and drive meaningful traffic.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Button 
                onClick={() => router.push('/generate')}
                className="px-8 py-6 text-lg font-semibold text-white transition-all duration-300 bg-blue-600 rounded-full hover:bg-blue-700 hover:scale-105"
              >
                Try SEO Analysis Now
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
              Our Mission
            </h2>
            <p className="text-lg text-gray-300">
              At seo.ai, we believe that every business deserves to be found online. 
              Our mission is to simplify the complex world of SEO and make powerful 
              website analysis accessible to everyone, regardless of their technical expertise.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Why Choose seo.ai?
            </h2>
            <p className="text-gray-400">
              We combine artificial intelligence with industry expertise to deliver 
              the most comprehensive SEO analysis available.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-xl bg-white/5 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="flex items-center justify-center w-16 h-16 mb-4 text-3xl bg-blue-500/20 rounded-full">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white/5">
        <div className="container px-4 mx-auto">
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
                className="p-6 text-center bg-white/5 rounded-xl backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full bg-gray-700">
                  <div className="flex items-center justify-center w-full h-full text-4xl">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white">{member.name}</h3>
                <p className="mb-2 text-blue-400">{member.role}</p>
                <p className="text-gray-400">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl p-8 mx-auto text-center bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-2xl">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Ready to improve your website&apos;s SEO?
            </h2>
            <p className="max-w-2xl mx-auto mb-8 text-gray-300">
              Join thousands of businesses that trust seo.ai for their website analysis needs.
            </p>
            <Button 
              onClick={() => router.push('/generate')}
              className="px-8 py-6 text-lg font-semibold text-white transition-all duration-300 bg-blue-600 rounded-full hover:bg-blue-700 hover:scale-105"
            >
              Get Started for Free
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
