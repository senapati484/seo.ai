"use client";

import { Check, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying out our basic features",
    features: [
      "5 free reports per month",
      "Basic SEO analysis",
      "Limited AI insights",
      "PDF report generation",
      "Email support",
    ],
    buttonText: "Get Started",
    featured: false,
  },
  {
    name: "Pro",
    price: "$29",
    description: "For professionals and small businesses",
    features: [
      "Unlimited reports",
      "Advanced SEO analysis",
      "AI-powered insights",
      "Priority support",
      "API access",
      "Team collaboration",
      "Scheduled reports",
    ],
    buttonText: "Go Pro",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations with custom needs",
    features: [
      "Everything in Pro",
      "Custom integrations",
      "Dedicated account manager",
      "SLA & priority support",
      "Custom reporting",
      "On-premise deployment",
      "Training & onboarding",
    ],
    buttonText: "Contact Sales",
    featured: false,
  },
];

const PricingPage = () => {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-100 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-200">
            Choose the perfect plan for your needs. No hidden fees, cancel
            anytime.
          </p>
        </div>

        <div className="mt-12 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm ring-1 ring-gray-900/5 sm:p-10 ${
                tier.featured
                  ? "ring-2 ring-indigo-600 transform scale-105 z-10"
                  : ""
              }`}
            >
              {tier.featured && (
                <div className="absolute top-0 right-0 -mt-4 -mr-4 px-3 py-1 bg-indigo-600 text-white text-sm font-semibold rounded-full">
                  Most Popular
                </div>
              )}
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">
                  {tier.name}
                </h3>
                {tier.featured && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    <Zap className="w-4 h-4 mr-1" /> Best Value
                  </span>
                )}
              </div>
              <p className="mt-4 text-gray-600">{tier.description}</p>
              <div className="mt-6 flex items-baseline">
                <span className="text-5xl font-extrabold text-gray-900">
                  {tier.price}
                </span>
                {tier.price !== "Custom" && (
                  <span className="ml-1 text-xl font-semibold text-gray-500">
                    /month
                  </span>
                )}
              </div>
              <ul className="mt-8 space-y-4">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                size="lg"
                className={`mt-8 w-full ${
                  tier.featured
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    : ""
                }`}
              >
                {tier.buttonText}
                {tier.featured && <Sparkles className="ml-2 h-4 w-4" />}
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently asked questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Can I change plans later?
              </h3>
              <p className="mt-2 text-gray-600">
                Absolutely! You can upgrade or downgrade your plan at any time.
                You&apos;ll only be charged the difference for the remaining
                days in your billing cycle.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Is there a free trial?
              </h3>
              <p className="mt-2 text-gray-600">
                Yes! Our free plan gives you access to basic features. You can
                upgrade to a paid plan anytime to unlock more features.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                What payment methods do you accept?
              </h3>
              <p className="mt-2 text-gray-600">
                We accept all major credit cards, PayPal, and bank transfers for
                annual plans.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Can I cancel anytime?
              </h3>
              <p className="mt-2 text-gray-600">
                Yes, you can cancel your subscription at any time. There are no
                cancellation fees.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
