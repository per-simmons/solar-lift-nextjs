import { getCaseStudyById, getCaseStudyContentHtml } from '../../lib/case-studies';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Calendar, ChevronLeft } from 'lucide-react';
import Footer from '../../../components/Footer';

export default async function CaseStudyServerPage({ params }: { params: { id: string } }) {
  // Attempt to get the case study by ID directly from server-side
  const caseStudy = await getCaseStudyById(parseInt(params.id));
  
  // If no case study is found, show 404
  if (!caseStudy) {
    notFound();
  }
  
  // Convert markdown content to HTML
  const htmlContent = await getCaseStudyContentHtml(caseStudy.content);
  
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
          <button className="mobile-navbar-cta-button">
            Book a Free Strategy Call
          </button>
          <div className="nav-links">
            <Link href="/#how-it-works">How We Work</Link>
            <Link href="/#different">Why Us</Link>
            <Link href="/#case-studies-section" className="active">Results</Link>
            <Link href="/#faq">FAQs</Link>
            <Link href="/blog">Blog</Link>
          </div>
          <button className="nav-cta-button">
            Book a Strategy Call
          </button>
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
          {/* Back button (separate from the logo) */}
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
                dangerouslySetInnerHTML={{ __html: htmlContent }}
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
                <button className="bg-[#ffce01] hover:bg-[#e6b900] text-black font-medium py-2 px-4 rounded inline-block">
                  Book a free strategy call
                </button>
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
      
      {/* Footer */}
      <Footer />
    </div>
  );
} 