import { getCaseStudyById, getCaseStudyContentHtml } from '../../lib/case-studies';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Calendar, ChevronLeft } from 'lucide-react';

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
      {/* White header section */}
      <div className="bg-white w-full pb-16">
        <div className="container mx-auto px-4 md:px-8 pt-6">
          {/* Logo and back button */}
          <div className="flex justify-between items-center mb-8">
            <div className="logo">
              <Link href="/#case-studies-section">
                <Image src="/assets/logo/solar_lift_logo_v2.png" alt="Solar Lift Logo" width={120} height={32} />
              </Link>
            </div>
            <Link 
              href="/#case-studies-section" 
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
                  prose-ul:ml-6 prose-ul:list-disc prose-ul:mb-4
                  prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4 
                  prose-li:mb-2 prose-li:pl-2"
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
                  href="/#case-studies-section" 
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