"use client";

import { Check, Zap, Sparkles, Lock, Cpu, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    description: "Get started with SEO analysis at no cost",
    who: "Best for individuals testing SEO basics",
    features: ["Unlimited SEO result PDFs"],
    buttonText: "Get Started Free",
    featured: false,
  },
  {
    name: "Pro",
    price: "$29",
    description: "AI-powered SEO insights for professionals",
    who: "Ideal for freelancers, bloggers & agencies",
    features: [
      "Unlimited SEO result PDFs",
      "AI-powered SEO insights",
      "Competitor analysis",
      "Keyword tracking",
      "30-day report history",
      "Priority email support",
    ],
    buttonText: "Start Free Trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    description: "Blockchain-secured SEO with ultimate storage",
    who: "Perfect for enterprises & large teams",
    features: [
      "Unlimited SEO result PDFs",
      "AI-powered SEO insights",
      "Blockchain verification (Avalanche C-Chain)",
      "Permanent IPFS storage via Pinata",
      "Team collaboration tools",
      "Unlimited report history",
      "Dedicated account manager",
      "24/7 priority support",
    ],
    buttonText: "Contact Sales",
    featured: false,
  },
];

const PricingPage = () => {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 rounded-full bg-indigo-500/20 text-indigo-400 text-sm font-medium">
            No credit card required
          </div>
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            Choose the Right SEO Plan
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-xl text-gray-400">
            Start free, unlock AI insights with Pro, or secure your reports on
            the blockchain with Enterprise.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mt-12 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              className={`relative p-8 bg-white/10 backdrop-blur-2xl rounded-2xl shadow-lg border border-white/10 sm:p-10 ${
                tier.featured
                  ? "ring-2 ring-indigo-600 transform scale-105 z-10"
                  : ""
              }`}
            >
              {/* Badge */}
              {tier.featured && (
                <div className="absolute top-0 right-0 -mt-4 -mr-4 px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-full shadow-lg">
                  Most Popular
                </div>
              )}

              {/* Title */}
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">{tier.name}</h3>
                {tier.featured && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    <Zap className="w-4 h-4 mr-1" /> Best Value
                  </span>
                )}
              </div>

              {/* Who it's for */}
              <p className="mt-2 text-sm text-indigo-400 italic">{tier.who}</p>

              {/* Description */}
              <p className="mt-4 text-gray-300">{tier.description}</p>

              {/* Price */}
              <div className="mt-6">
                <div className="flex items-baseline">
                  <span className="text-5xl font-extrabold text-white">
                    {tier.price}
                  </span>
                  {tier.price !== "$0" && (
                    <span className="ml-1 text-xl font-semibold text-gray-400">
                      /month
                    </span>
                  )}
                </div>
                {tier.price === "$0" && (
                  <p className="mt-2 text-sm text-gray-500">Forever free</p>
                )}
              </div>

              {/* Features */}
              <ul className="mt-8 space-y-4">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-400" />
                    <span className="ml-3 text-gray-200">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Button */}
              <Button
                size="lg"
                className={`mt-8 w-full ${
                  tier.featured
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    : "bg-gray-800 hover:bg-gray-700 text-white"
                }`}
              >
                {tier.buttonText}
                {tier.featured && <Sparkles className="ml-2 h-4 w-4" />}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-20 bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-10 border border-white/10"
        >
          <h2 className="text-2xl font-bold text-white mb-6">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-gray-300">
            <div>
              <h3 className="text-lg font-medium text-white">
                Can I change plans later?
              </h3>
              <p className="mt-2">
                Absolutely! You can upgrade or downgrade anytime. You’ll only be
                billed for the difference in your cycle.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">
                Is there a free trial?
              </h3>
              <p className="mt-2">
                Yes! The free plan is forever. Pro comes with a 7-day free trial
                before billing starts.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">
                What payment methods do you accept?
              </h3>
              <p className="mt-2">
                We accept all major credit cards, PayPal, and bank transfers for
                annual plans.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">
                Can I cancel anytime?
              </h3>
              <p className="mt-2">
                Yes, you can cancel your subscription anytime with no hidden
                fees.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingPage;
