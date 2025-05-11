'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0">
            <Image src="/assets/logo/solar-lift-logo-white.png" alt="Solar Lift Logo" width={150} height={40} className="mb-4" />
            <p className="text-gray-400 max-w-md">
              We deliver qualified homeowners actively looking for solar so your team can focus on closing deals, not chasing interest.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/#how-it-works" className="text-gray-300 hover:text-white">How We Work</Link></li>
                <li><Link href="/#different" className="text-gray-300 hover:text-white">Why Us</Link></li>
                <li><Link href="/#case-studies-section" className="text-gray-300 hover:text-white">Results</Link></li>
                <li><Link href="/#faq" className="text-gray-300 hover:text-white">FAQs</Link></li>
                <li><Link href="/blog" className="text-gray-300 hover:text-white">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <a href="mailto:pat@solarlift.com" className="text-gray-300 hover:text-white">pat@solarlift.com</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">
            © {new Date().getFullYear()} Solar Lift. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 