'use client'

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search } from "lucide-react"

// Sample case study data matching our carousel data
const caseStudies = [
  {
    id: 1,
    clientName: 'SunBright',
    clientType: 'Residential',
    title: '2x increase in booked site visits for California-based installer',
    excerpt: 'Learn how Solar Lift helped SunBright double their booked site visits and increase their close rate by 3.1x compared to typical marketplace leads.',
    stats: [
      { label: 'Leads delivered in 3 months', value: '146' },
      { label: 'Close rate vs. typical marketplace', value: '3.1x' }
    ],
    imageUrl: "/assets/dummy-images/case-study-1-dummy.png"
  },
  {
    id: 2,
    clientName: 'TerraVolt',
    clientType: 'Commercial',
    title: '45% reduction in customer acquisition costs for mid-size commercial installer',
    excerpt: 'See how TerraVolt reduced their customer acquisition costs by leveraging Solar Lift\'s focused lead generation strategies.',
    stats: [
      { label: 'Booked appointments in 15 months', value: '227' },
      { label: 'Avg. monthly KPIs', value: '120%' }
    ],
    imageUrl: "/assets/dummy-images/case-study-2-dummy.png"
  },
  {
    id: 3,
    clientName: 'SolarEdge',
    clientType: 'Residential',
    title: '320+ qualified leads for nationwide residential solar provider',
    excerpt: 'How Solar Lift delivered high-intent leads across multiple regions for a major national solar provider.',
    stats: [
      { label: 'Deals won in first 3 months', value: '9' },
      { label: 'ROI on marketing spend', value: '285%' }
    ],
    imageUrl: "/assets/dummy-images/case-study-3-dummy.png"
  },
  {
    id: 4,
    clientName: 'GreenSpark',
    clientType: 'Residential',
    title: '73% higher conversion rate from lead to install for regional mid-Atlantic installer',
    excerpt: 'Discover how GreenSpark achieved dramatically improved conversion rates and reduced customer acquisition costs with Solar Lift.',
    stats: [
      { label: 'Qualified leads generated in 6 months', value: '284' },
      { label: 'Average cost per acquisition reduction', value: '2.4x' }
    ],
    imageUrl: "/assets/dummy-images/case-study-4-dummy.png"
  }
];

export default function CaseStudiesPage() {
  const [activeType, setActiveType] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  
  // Filter case studies based on active type and search query
  const filteredCaseStudies = caseStudies.filter(study => {
    // Filter by client type
    const typeMatch = activeType === "all" || study.clientType === activeType
    
    // Filter by search query
    const searchMatch = searchQuery === "" || 
      study.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      study.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      study.clientName.toLowerCase().includes(searchQuery.toLowerCase())
    
    return typeMatch && searchMatch
  })
  
  return (
    <>
      {/* FLOATING NAVIGATION BAR - Same as main site for consistency */}
      <nav className="floating-nav">
        <div className="nav-container">
          <div className="logo">
            <Image src="/assets/logo/solar_lift_logo_v2.png" alt="Solar Lift Logo" width={120} height={32} />
          </div>
          {/* Mobile-only CTA button that's always visible in the navbar */}
          <a href="https://calendly.com/pat-solarlift/30min?share_attribution=expiring_link" 
             className="mobile-navbar-cta-button" 
             target="_blank">
            Book a Free Strategy Call
          </a>
          <div className="nav-links">
            <Link href="/#how-it-works">How We Work</Link>
            <Link href="/#different">Why Us</Link>
            <Link href="/case-studies" className="active">Results</Link>
            <Link href="/#faq">FAQs</Link>
            <Link href="/blog">Blog</Link>
          </div>
          <a href="https://calendly.com/pat-solarlift/30min?share_attribution=expiring_link" 
             className="nav-cta-button" 
             target="_blank">
            Book a Strategy Call
          </a>
          <div className="hamburger-menu">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 pt-32 pb-16 max-w-7xl relative">
        {/* Decorative background element - using yellow accent color */}
        <div className="absolute top-0 right-0 -z-10 w-[400px] h-[400px] bg-gradient-to-br from-[#F9C846]/80 to-[#F9C846]/40 rounded-full blur-xl"></div>

        {/* Header */}
        <header className="mb-16 max-w-3xl">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Case Studies</h1>
          <p className="text-lg text-gray-700">
            Real results from real solar companies using Solar Lift to generate qualified leads and increase their conversion rates.
          </p>
        </header>

        {/* Filter and Search */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-16">
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setActiveType("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeType === "all" 
                  ? "bg-gray-800 text-white" 
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              View all
            </button>
            <button 
              onClick={() => setActiveType("Residential")}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeType === "Residential" 
                  ? "bg-gray-800 text-white" 
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Residential
            </button>
            <button 
              onClick={() => setActiveType("Commercial")}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeType === "Commercial" 
                  ? "bg-gray-800 text-white" 
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Commercial
            </button>
          </div>
          <div className="relative w-full md:w-auto min-w-[300px]">
            <input
              type="text"
              placeholder="Search case studies"
              className="w-full px-4 py-2 border border-gray-200 rounded-full pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F9C846]"
              onClick={() => setSearchQuery(searchQuery)}
            >
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {filteredCaseStudies.map((study) => (
            <div key={study.id} className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <div className="font-bold text-lg">{study.clientName}</div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  study.clientType === 'Residential' 
                    ? 'text-blue-700 border border-blue-700' 
                    : 'text-green-700 border border-green-700'
                }`}>
                  {study.clientType}
                </div>
              </div>
              
              <h2 className="text-2xl font-bold mb-3">{study.title}</h2>
              <p className="text-gray-600 mb-6">{study.excerpt}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                {study.stats.map((stat, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-[#FFB800]">{stat.value}</p>
                  </div>
                ))}
              </div>
              
              <Link href={`/case-studies/${study.id}`} className="inline-flex items-center gap-2 font-semibold text-gray-900 hover:text-[#FFB800] group">
                <div className="w-12 h-12 rounded-full border border-[#FFB800] text-[#FFB800] flex items-center justify-center group-hover:bg-[#FFB800] group-hover:text-white transition-all duration-200">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </div>
                Read case study
              </Link>
            </div>
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="bg-gray-900 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-8">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to get more solar installs?</h2>
            <p className="text-gray-300 max-w-xl">
              Learn how Solar Lift can help your company generate more qualified leads and 
              increase your conversion rates with our proven strategies.
            </p>
          </div>
          <a 
            href="https://calendly.com/pat-solarlift/30min?share_attribution=expiring_link"
            target="_blank"
            className="flex-shrink-0 bg-[#F9C846] hover:bg-[#e6b901] text-black font-bold py-3 px-8 rounded-full transition-colors"
          >
            Book a Free Strategy Call
          </a>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <Image src="/assets/logo/solar_lift_logo_v2.png" alt="Solar Lift Logo" width={150} height={40} className="mb-4" />
              <p className="text-gray-400 max-w-md">
                We deliver qualified homeowners actively looking for solar so your team can focus on closing deals, not chasing interest.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><Link href="/#how-it-works" className="text-gray-300 hover:text-white">How We Work</Link></li>
                  <li><Link href="/#different" className="text-gray-300 hover:text-white">Why Us</Link></li>
                  <li><Link href="/case-studies" className="text-gray-300 hover:text-white">Results</Link></li>
                  <li><Link href="/#faq" className="text-gray-300 hover:text-white">FAQs</Link></li>
                  <li><Link href="/blog" className="text-gray-300 hover:text-white">Blog</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4">Contact</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <a href="mailto:info@solarlift.com" className="text-gray-300 hover:text-white">info@solarlift.com</a>
                  </li>
                  <li className="flex items-center">
                    <a href="tel:+1234567890" className="text-gray-300 hover:text-white">(123) 456-7890</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              © {new Date().getFullYear()} Solar Lift. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-linkedin text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-facebook text-xl"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
} 