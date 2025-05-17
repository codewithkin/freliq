"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "0",
    description: "Perfect for getting started and testing the platform.",
    features: [
      "1 project",
      "2 collaborators",
      "Basic progress tracking",
      "Upload up to 5 proofs",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "12",
    description: "Ideal for freelancers managing multiple clients.",
    features: [
      "10 projects",
      "Unlimited collaborators",
      "Advanced tracking & checklists",
      "Upload up to 100 proofs",
      "Client comment threads",
      "Priority support",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Agency",
    price: "29",
    description:
      "For agencies and power users managing teams & large projects.",
    features: [
      "Unlimited projects",
      "Unlimited collaborators",
      "Team permissions",
      "Unlimited proofs & files",
      "Real-time chat & updates",
      "Custom branding",
      "Premium support",
    ],
    cta: "Upgrade Now",
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section className="w-full py-24 md:py-32 bg-muted">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
        >
          Transparent pricing for every freelancer and team
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-muted-foreground mb-12 max-w-2xl mx-auto"
        >
          Choose the plan that fits your workflow. Upgrade any time as your
          projects grow.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const isPopular = plan.popular;
            const bgColor = isPopular
              ? "bg-white"
              : "bg-gray-50 dark:bg-zinc-900";
            const borderColor = isPopular ? "border-primary" : "border-border";
            const shadow = isPopular ? "shadow-xl" : "shadow-sm";

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
                className={`${bgColor} ${borderColor} ${shadow} rounded-2xl border p-8 flex flex-col justify-between transform transition-transform hover:scale-[1.01] duration-300`}
              >
                <div>
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground mb-6">
                    {plan.description}
                  </p>
                  <div className="text-4xl font-extrabold mb-6">
                    {plan.price === "0" ? (
                      "Free"
                    ) : (
                      <>
                        ${plan.price}
                        <span className="text-base font-medium text-muted-foreground">
                          /mo
                        </span>
                      </>
                    )}
                  </div>
                  <ul className="space-y-3 text-left mb-8">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center text-sm text-muted-foreground"
                      >
                        <Check className="w-4 h-4 text-primary mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  size="lg"
                  variant={isPopular ? "default" : "outline"}
                  className={`w-full ${isPopular ? "bg-primary text-white" : ""}`}
                >
                  {plan.cta}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
