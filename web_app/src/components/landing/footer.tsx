"use client";

import { motion } from "framer-motion";
import { Github, Twitter, Mail } from "lucide-react";
import Link from "next/link";

export function FooterSection() {
  return (
    <footer className="bg-background border-t">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-4 gap-8 text-sm"
        >
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold mb-3">Freliq</h3>
            <p className="text-muted-foreground">
              Transparent project collaboration for freelancers & agencies.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-3">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#features" className="hover:underline">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:underline">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#testimonials" className="hover:underline">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:underline">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="hover:underline">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:underline">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-3">Follow Us</h4>
            <div className="flex space-x-4">
              <Link
                href="https://twitter.com"
                target="_blank"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 hover:text-primary transition" />
              </Link>
              <Link
                href="https://github.com"
                target="_blank"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5 hover:text-primary transition" />
              </Link>
              <Link href="mailto:hello@freliq.io" aria-label="Email">
                <Mail className="w-5 h-5 hover:text-primary transition" />
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="mt-12 border-t pt-6 text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} Freliq. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
