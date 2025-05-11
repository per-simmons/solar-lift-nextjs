'use client'

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Clock, Calendar, ChevronLeft } from "lucide-react"
import { getCaseStudyById, getCaseStudyContentHtml } from "../../lib/case-studies-client"

// Fallback case studies in case there's an issue with loading from markdown
const FALLBACK_CASE_STUDIES = [
  {
    id: 1,
    clientName: 'WBE',
    clientType: 'Residential',
    title: '2x increase in booked site visits for California-based installer',
    excerpt: 'Learn how Solar Lift helped WBE double their booked site visits and increase their close rate by 3.1x compared to typical marketplace leads.',
    category: 'Appointment Setting',
    location: 'California',
    companySize: '11-50 employees',
    readTime: '10 min',
    publishDate: 'May 19, 2024',
    content: `
      <p>WBE is a leading residential solar installer in California, helping homeowners reduce their energy bills and carbon footprint with high-quality solar installations. With rising competition in the California market, WBE needed to find a way to increase their lead flow and improve their conversion rates.</p>

      <h2>Challenges</h2>
      <p>The client needed to boost their site visits and lead-to-appointment conversions. Despite having a strong online presence and multiple marketing channels at their disposal, they struggled to generate consistent, high-quality leads. Their sales team was spending too much time qualifying leads rather than focusing on closing deals.</p>

      <h2>Solutions</h2>
      <p>Solar Lift implemented a comprehensive lead generation strategy for WBE that included:</p>
      <ul>
        <li>Targeted digital campaigns focused on high-value neighborhoods with optimal solar potential</li>
        <li>Pre-qualification system that vetted homeowners based on specific criteria including roof condition, energy usage, and financial qualification</li>
        <li>Automated scheduling system that allowed interested homeowners to book site visits directly</li>
        <li>Custom CRM integration to seamlessly transfer lead data to WBE's sales team</li>
      </ul>

      <h2>Results</h2>
      <p>Within the first three months of working with Solar Lift, WBE saw remarkable improvements:</p>
      <ul>
        <li>146 qualified leads delivered, with 93 resulting in booked site visits</li>
        <li>Site visit bookings increased by 112% compared to the previous quarter</li>
        <li>Close rate improved to 3.1x higher than leads from typical marketplace sources</li>
        <li>Average cost per acquisition decreased by 42%</li>
        <li>Sales cycle shortened by an average of 11 days</li>
      </ul>
      
      <p>By delivering pre-qualified leads that were genuinely interested in solar installation, Solar Lift helped WBE's sales team focus on what they do best - closing deals rather than chasing unqualified prospects.</p>
    `,
    stats: [
      { label: 'Leads delivered in 3 months', value: '146' },
      { label: 'Close rate vs. typical marketplace', value: '3.1x' }
    ],
    imageUrl: "/assets/case-study-1-wbe/wbe-solar-installation.jpg",
    logoUrl: "/assets/case-study-1-wbe/wbe-logo-client-case-study-1.png"
  }
];

export default function CaseStudyClientPage({ params }: { params: { id: string } }) {
  const [caseStudy, setCaseStudy] = useState<any>(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Hide the default footer
  useEffect(() => {
    const footerElement = document.querySelector('body > footer');
    if (footerElement) {
      (footerElement as HTMLElement).style.display = 'none';
    }
    
    // Restore footer on unmount
    return () => {
      const footerElement = document.querySelector('body > footer');
      if (footerElement) {
        (footerElement as HTMLElement).style.display = '';
      }
    };
  }, []);
  
  useEffect(() => {
    async function loadCaseStudy() {
      try {
        setLoading(true);
        setError(null);
        
        // Validate ID parameter
        const numericId = parseInt(params.id);
        if (isNaN(numericId)) {
          setError(`Invalid case study ID: ${params.id}`);
          setLoading(false);
          return;
        }
        
        // Attempt to get the case study by ID from API
        const study = await getCaseStudyById(numericId);
        
        if (study) {
          setCaseStudy(study);
          
          // Convert the markdown content to HTML
          try {
            const htmlContent = await getCaseStudyContentHtml(study.content);
            setContent(htmlContent);
          } catch (contentError) {
            console.error('Error converting content to HTML:', contentError);
            // Still use the case study, but with plain content
            setContent(study.content);
          }
        } else {
          // Fallback to hardcoded case study if not found
          const fallbackStudy = FALLBACK_CASE_STUDIES.find(s => s.id === numericId);
          if (fallbackStudy) {
            setCaseStudy(fallbackStudy);
            setContent(fallbackStudy.content);
          } else {
            setError(`Case study with ID ${numericId} not found`);
          }
        }
      } catch (error) {
        console.error('Error loading case study:', error);
        setError(`Error loading case study: ${error instanceof Error ? error.message : 'Unknown error'}`);
        
        // Try fallback if there's an error
        try {
          const fallbackStudy = FALLBACK_CASE_STUDIES.find(s => s.id === parseInt(params.id));
          if (fallbackStudy) {
            setCaseStudy(fallbackStudy);
            setContent(fallbackStudy.content);
            // Clear the error if we successfully loaded the fallback
            setError(null);
          }
        } catch (fallbackError) {
          console.error('Error loading fallback case study:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    }
    
    loadCaseStudy();
  }, [params.id]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-[#FFB800] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading case study...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-lg">
          <h1 className="text-2xl font-bold text-red-700 mb-4">Error Loading Case Study</h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <Link 
            href="/case-studies" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to all case studies
          </Link>
        </div>
      </div>
    );
  }
  
  if (!caseStudy) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-lg">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">Case Study Not Found</h1>
          <p className="text-gray-600 mb-6">The case study you are looking for does not exist or has been removed.</p>
          <Link 
            href="/case-studies" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to all case studies
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* FLOATING NAVIGATION BAR */}
      <nav className="floating-nav">
        <div className="nav-container">
          <div className="logo">
            <Link href="/">
              <Image src="/assets/logo/solar-lift-logo-v3.png" alt="Solar Lift Logo" width={120} height={32} />
            </Link>
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
            <Link href="/#case-studies-section" className="active">Results</Link>
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

      {/* White header section */}
      <div className="bg-white w-full pb-16 pt-24">
        <div className="container mx-auto px-4 md:px-8 pt-6">
          {/* Back button */}
          <div className="flex justify-end items-center mb-8">
            <Link 
              href="/case-studies" 
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="mr-1" />
              Back to case studies
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
            <div>
              {/* Client logo */}
              {caseStudy.logoUrl && (
                <div className="mb-4">
                  <Image
                    src={caseStudy.logoUrl}
                    alt={`${caseStudy.clientName} logo`}
                    width={200}
                    height={80}
                    style={{ objectFit: 'contain', objectPosition: 'left' }}
                  />
                </div>
              )}
              
              {/* Lead text in accent color */}
              <p className="text-[#ffce01] font-medium mb-2 uppercase tracking-wide">
                {caseStudy.category} FOR {caseStudy.clientType} SOLAR PROVIDER
              </p>

              {/* Main headline */}
              <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-8">
                {caseStudy.title}
              </h1>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                {caseStudy.stats.map((stat, index) => (
                  <div key={index}>
                    <p className="text-4xl md:text-5xl font-bold text-[#ffce01]">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Header image */}
            <div className="relative h-[300px] md:h-[400px]">
              <Image
                src={caseStudy.imageUrl || "/assets/dummy-images/case-study-1-dummy.png"}
                alt={`${caseStudy.clientName} case study`}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-8"></div>

          {/* Company details in 4 columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <p className="font-semibold text-sm">Category</p>
              <p className="text-sm">{caseStudy.category || caseStudy.clientType}</p>
            </div>
            <div>
              <p className="font-semibold text-sm">Industry</p>
              <p className="text-sm">Solar Energy</p>
            </div>
            <div>
              <p className="font-semibold text-sm">Location</p>
              <p className="text-sm">{caseStudy.location || 'United States'}</p>
            </div>
            <div>
              <p className="font-semibold text-sm">Company size</p>
              <p className="text-sm">{caseStudy.companySize || '1-500 employees'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gray content section */}
      <div className="bg-gray-100 flex-grow pt-16 pb-12">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main content - 2/3 width */}
            <div className="md:col-span-2">
              {/* Render the markdown content as HTML with proper styling */}
              <div 
                className="prose prose-lg max-w-none 
                  prose-headings:font-bold prose-headings:text-gray-800 
                  prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                  prose-p:text-gray-700 prose-p:mb-4
                  prose-ul:ml-6 prose-ul:mb-4
                  prose-ol:ml-6 prose-ol:mb-4
                  prose-li:mb-2
                  [&_ul]:list-disc [&_ul]:text-black
                  [&_ol]:list-decimal
                  [&_ol>li]:pl-0 [&_ol>li]:marker:text-black [&_ol]:marker:font-bold
                  [&_ul>li]:marker:text-black"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>

            {/* Sidebar - 1/3 width */}
            <div className="md:col-span-1">
              {/* Reading time and publish date */}
              <div className="mb-8">
                <div className="flex items-center mb-2">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm font-medium">Reading duration</span>
                  <span className="ml-auto text-sm">{caseStudy.readTime || '10 min'}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm font-medium">Published</span>
                  <span className="ml-auto text-sm">{caseStudy.publishDate || 'May 19, 2024'}</span>
                </div>
              </div>

              {/* CTA Card */}
              <div className="bg-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-lg mb-2">Want similar results for your solar business?</h3>
                <p className="text-sm mb-4">Let's create your custom lead generation strategy.</p>
                <a 
                  href="https://calendly.com/pat-solarlift/30min?share_attribution=expiring_link"
                  target="_blank"
                  className="bg-[#ffce01] hover:bg-[#e6b900] text-black font-medium py-2 px-4 rounded inline-block"
                >
                  Book a free strategy call
                </a>
              </div>
              
              {/* Back to case studies button */}
              <div className="mt-6">
                <Link 
                  href="/case-studies" 
                  className="inline-flex items-center text-gray-600 hover:text-gray-900"
                >
                  <ChevronLeft className="mr-1" />
                  Back to all case studies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer - custom implementation for this page */}
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
    </div>
  );
} 