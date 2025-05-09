'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import CaseStudiesCarousel from '../components/CaseStudiesCarousel'

export default function Home() {
  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // State for active section
  const [activeSection, setActiveSection] = useState('')
  
  // State for carousel
  const [currentSlide, setCurrentSlide] = useState(0)
  
  // State and ref for video player
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  // Toggle video play/pause
  const togglePlay = () => {
    if (!videoRef.current) return
    
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }
  const totalSlides = 3 // Total number of case study slides
  
  // Refs for sections
  const sectionsRef = useRef<HTMLElement[]>([])
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const mobileMenu = document.querySelector('.hamburger-menu')
      const navLinks = document.querySelector('.nav-links')
      
      if (mobileMenuOpen && 
          navLinks && 
          mobileMenu && 
          !navLinks.contains(target) && 
          !mobileMenu.contains(target)) {
        setMobileMenuOpen(false)
      }
    }
    
    if (mobileMenuOpen) {
      document.addEventListener('click', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [mobileMenuOpen])
  
  // Handle scroll to update active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      
      // Find the current section based on scroll position
      let current = ''
      sectionsRef.current.forEach(section => {
        if (section) {
          const sectionTop = section.offsetTop
          const sectionHeight = section.clientHeight
          
          if (scrollPosition >= (sectionTop - sectionHeight / 3)) {
            current = section.id
          }
        }
      })
      
      setActiveSection(current)
    }
    
    // Collect all section refs
    sectionsRef.current = Array.from(document.querySelectorAll('section, header'))
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // FAQ accordion functionality
  const toggleFAQ = (index: number) => {
    const faqItems = document.querySelectorAll('.faq-item')
    
    faqItems.forEach((item, i) => {
      if (i === index) {
        item.classList.toggle('active')
      } else {
        item.classList.remove('active')
      }
    })
  }
  
  // Handle smooth scrolling for anchor links
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    
    if (targetId === '#') return
    
    const targetElement = document.querySelector(targetId)
    
    if (targetElement) {
      // Close mobile menu if open
      if (mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
      
      // Calculate offset to account for fixed navbar
      const navHeight = document.querySelector('.floating-nav')?.clientHeight || 0
      const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight - 20
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      })
    }
  }
  
  // Handle carousel navigation
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1))
  }
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1))
  }
  
  return (
    <main>
      {/* FLOATING NAVIGATION BAR */}
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
          <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
            <Link href="#how-it-works" 
                  onClick={(e) => scrollToSection(e, '#how-it-works')}
                  className={activeSection === 'how-it-works' ? 'active' : ''}>
              How We Work
            </Link>
            <Link href="#different" 
                  onClick={(e) => scrollToSection(e, '#different')}
                  className={activeSection === 'different' ? 'active' : ''}>
              Why Us
            </Link>
            <Link href="#case-studies-section" 
                  onClick={(e) => scrollToSection(e, '#case-studies-section')}
                  className={activeSection === 'case-studies-section' ? 'active' : ''}>
              Results
            </Link>
            <Link href="#faq" 
                  onClick={(e) => scrollToSection(e, '#faq')}
                  className={activeSection === 'faq' ? 'active' : ''}>
              FAQs
            </Link>
          </div>
          <a href="https://calendly.com/pat-solarlift/30min?share_attribution=expiring_link" 
             className="nav-cta-button" 
             target="_blank">
            Book a Strategy Call
          </a>
          <div className={`hamburger-menu ${mobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      {/* HEADER / HERO SECTION */}
      <header className="hero">
        <div className="container">
          <div className="dot-grid">
            {Array(26).fill(0).map((_, i) => (
              <div key={i} className={`dot ${i === 7 ? 'accent-dot' : ''}`}></div>
            ))}
          </div>
          <div className="hero-content">
            <div className="hero-text">
              <div className="pill">Solar Marketing Agency</div>
              <h1>More Solar Installs. Less Chasing Leads.</h1>
              <p>We deliver qualified homeowners actively looking for solar so your team can focus on closing deals, not chasing interest.</p>
              <a href="https://calendly.com/pat-solarlift/30min?share_attribution=expiring_link" className="cta-button" target="_blank">Book a Free Strategy Call</a>
              <div className="testimonial-container">
                <Image src="/assets/client_photos/client_photos_for_stars.png" alt="Happy Solar Clients" className="client-photos" width={160} height={40} />
                <div className="stars">★★★★★</div>
                <p className="testimonial-text">Trusted by 30+ solar companies nationwide</p>
              </div>
            </div>
            <div className="hero-image">
              <div className="image-container">
                <Image src="/assets/header_image/man_smiling_phone.png" alt="Solar Lift Background" className="background-image" fill />
                {/* Tags that should appear BEHIND the subject */}
                <div className="ui-tags-behind">
                  <Image src="/assets/header_image/ui-tag-1.png" alt="UI Tag 1" className="ui-tag ui-tag-1" width={160} height={65} />
                  <Image src="/assets/header_image/ui-tag-5.png" alt="UI Tag 5" className="ui-tag ui-tag-5" width={150} height={60} />
                </div>
                {/* UI Tag 2 positioned directly behind the subject - smaller size */}
                <Image src="/assets/header_image/ui-tag-2.png" alt="UI Tag 2" className="ui-tag ui-tag-2" width={140} height={55} />
                <Image src="/assets/header_image/man_smiling_single_subject.png" alt="Solar Lift Subject" className="subject-image" fill />
                {/* Tags that should appear IN FRONT of the subject */}
                <div className="ui-tags-front">
                  <Image src="/assets/header_image/ui-tag-3.png" alt="UI Tag 3" className="ui-tag ui-tag-3" width={250} height={100} />
                  <Image src="/assets/header_image/ui-tag-4.png" alt="UI Tag 4" className="ui-tag ui-tag-4" width={200} height={80} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* CLIENT LOGOS CAROUSEL */}
      <section className="client-logos">
        <div className="container">
          <div className="logo-carousel-container">
            <div className="gradient-mask left-mask"></div>
            <div className="logo-carousel">
              <div className="logo-slide">
                <Image src="/assets/client_logos/brooklyn-solarworks-logo.png" alt="Brooklyn Solarworks" width={180} height={90} style={{objectFit: 'contain', width: 'auto'}} />
                <Image src="/assets/client_logos/cei-logo.png" alt="CEI" width={180} height={90} style={{objectFit: 'contain', width: 'auto'}} />
                <Image src="/assets/client_logos/core-logo.png" alt="Core" width={180} height={90} style={{objectFit: 'contain', width: 'auto'}} />
                <Image src="/assets/client_logos/decker-electric-logo.png" alt="Decker Electric" width={180} height={90} style={{objectFit: 'contain', width: 'auto'}} />
                <Image src="/assets/client_logos/future-communities-logo.png" alt="Future Communities" width={180} height={90} style={{objectFit: 'contain', width: 'auto'}} />
                <Image src="/assets/client_logos/gardner-energy-logo.png" alt="Gardner Energy" width={180} height={90} style={{objectFit: 'contain', width: 'auto'}} />
                <Image src="/assets/client_logos/momentum-logo.png" alt="Momentum" width={180} height={90} style={{objectFit: 'contain', width: 'auto'}} />
                <Image src="/assets/client_logos/rosendin-logo.png" alt="Rosendin" width={180} height={90} style={{objectFit: 'contain', width: 'auto'}} />
                <Image src="/assets/client_logos/smart-wave-solar-logo.png" alt="Smart Wave Solar" width={180} height={90} style={{objectFit: 'contain', width: 'auto'}} />
                <Image src="/assets/client_logos/wbe-logo.png" alt="WBE" width={180} height={90} style={{objectFit: 'contain', width: 'auto'}} />
                {/* Duplicate logos for seamless looping */}
                <Image src="/assets/client_logos/brooklyn-solarworks-logo.png" alt="Brooklyn Solarworks" width={180} height={90} style={{objectFit: 'contain', width: 'auto'}} />
                <Image src="/assets/client_logos/cei-logo.png" alt="CEI" width={180} height={90} style={{objectFit: 'contain', width: 'auto'}} />
                <Image src="/assets/client_logos/core-logo.png" alt="Core" width={180} height={90} style={{objectFit: 'contain', width: 'auto'}} />
                <Image src="/assets/client_logos/decker-electric-logo.png" alt="Decker Electric" width={180} height={90} style={{objectFit: 'contain', width: 'auto'}} />
              </div>
            </div>
            <div className="gradient-mask right-mask"></div>
          </div>
        </div>
      </section>

      {/* FEATURE CARDS SECTION */}
      <section className="feature-cards">
        <div className="container">
          <div className="section-header">
            <h2>The Solar Lift Advantage</h2>
            <p className="section-intro">We've reimagined lead generation specifically for solar installers, focusing on quality, consistency, and profitability—the three pillars to grow your solar business.</p>
          </div>
          
          <div className="feature-cards-container">
            <div className="feature-card">
              <div className="feature-icon">
                <Image src="/assets/iconography/icon-1.png" alt="Vetted Prospects Icon" width={60} height={60} />
              </div>
              <h3 className="feature-headline">Vetted, High-Intent Prospects</h3>
              <p className="feature-text">We deliver homeowners with verified solar potential and buying timeline—so your team closes more deals in less time.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Image src="/assets/iconography/icon-2.png" alt="Predictable Lead Volume Icon" width={60} height={60} />
              </div>
              <h3 className="feature-headline">Predictable Lead Volume</h3>
              <p className="feature-text">Scale your business with a consistent flow of qualified leads each month, no more feast-or-famine sales cycles.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Image src="/assets/iconography/icon-3.png" alt="Conversion Rates Icon" width={60} height={60} />
              </div>
              <h3 className="feature-headline">Industry-Leading Conversion Rates</h3>
              <p className="feature-text">Our leads convert to installs at 2-3x higher rates than typical solar marketplaces, cutting your acquisition costs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <h2>How We Deliver Solar-Ready Leads</h2>
          <div className="steps">
            <div className="step-card">
              <div className="step-content">
                <div className="step-number">Step 1 — Target</div>
                <h3>Pinpoint Targeting</h3>
                <p>Reach ready-to-go solar leads in your area</p>
                <ul className="step-benefits">
                  <li>AI-powered ad targeting based on solar potential</li>
                  <li>Omnichannel approach across Meta, Google, and emerging platforms</li>
                  <li>Proprietary algorithms identify high-intent homeowners</li>
                </ul>
              </div>
              <div className="step-image">
                <Image 
                  src="/assets/how_it_works/1_pinpoint_targeting.jpg" 
                  alt="Pinpoint Targeting" 
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{objectFit: 'cover', objectPosition: 'center'}} 
                  className="step-image-content"
                />
              </div>
            </div>
            
            <div className="step-card">
              <div className="step-content">
                <div className="step-number">Step 2 — Qualify</div>
                <h3>Built-In Qualification</h3>
                <p>We filter leads through multiple verification checks</p>
                <ul className="step-benefits">
                  <li>Verified homeownership and roof compatibility data</li>
                  <li>Financial pre-qualification based on utility cost analysis</li>
                  <li>Multi-step intent verification system eliminates browsers</li>
                </ul>
              </div>
              <div className="step-image">
                <Image 
                  src="/assets/how_it_works/2_built_in_qualification.jpg" 
                  alt="Built-In Qualification" 
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{objectFit: 'cover', objectPosition: 'center'}} 
                  className="step-image-content"
                />
              </div>
            </div>
            
            <div className="step-card">
              <div className="step-content">
                <div className="step-number">Step 3 — Deliver</div>
                <h3>Warm Handoff</h3>
                <p>Get sales-ready leads delivered directly to your team</p>
                <ul className="step-benefits">
                  <li>Seamlessly integrates with your existing CRM systems</li>
                  <li>Custom lead routing based on your team structure</li>
                  <li>Detailed lead profiles with conversion insights included</li>
                </ul>
              </div>
              <div className="step-image">
                <Image 
                  src="/assets/how_it_works/3_warm_handoff.jpg" 
                  alt="Warm Handoff" 
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{objectFit: 'cover', objectPosition: 'center'}} 
                  className="step-image-content"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY PARTNER SECTION */}
      <section className="why-partner" id="different">
        <div className="container">
          <div className="section-header">
            <h2>Why Partner with a Lead Gen Agency That Actually Delivers?</h2>
            <div className="section-intro">
              <p>Most solar companies are great at sales—but stuck waiting on referrals or buying overpriced leads. The truth? The best solar teams don't just wait. They partner with performance-driven lead gen agencies who actually bring in high-intent homeowners, not tire kickers. If you're serious about scaling, this isn't optional—it's the playbook.</p>
            </div>
          </div>

          <div className="video-container">
            <div className="custom-video-player">
              <video
                ref={videoRef}
                src="/assets/intro_video/solar-lift-intro-final.mp4"
                poster="/assets/intro_video/solar-lift-intro-video-thumbnail.jpg"
                playsInline
                onClick={togglePlay}
              />
              <div className={`play-button ${isPlaying ? 'hidden' : ''}`} onClick={togglePlay}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5.14v13.72c0 .23 0 .34.06.42a.5.5 0 0 0 .29.23c.1.03.21.01.44-.04l10.42-6.5c.22-.14.33-.2.37-.3a.5.5 0 0 0 0-.34c-.04-.1-.15-.16-.37-.3L8.79 5.53c-.23-.05-.34-.07-.44-.04a.5.5 0 0 0-.29.23c-.06.08-.06.2-.06.42z" fill="white"/>
                </svg>
              </div>
              {isPlaying && (
                <div className="video-overlay" onClick={togglePlay}>
                  <div className="pause-button">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="7" y="5" width="3" height="14" rx="1" fill="white"/>
                      <rect x="14" y="5" width="3" height="14" rx="1" fill="white"/>
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-number">62%</div>
              <div className="stat-label">
                <span>More Conversions</span>
                <span className="info-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8" r="7.5" stroke="#D1D5DB"/>
                    <path d="M8 6.5V11.5" stroke="#D1D5DB" strokeLinecap="round"/>
                    <circle cx="8" cy="4.5" r="0.5" fill="#D1D5DB"/>
                  </svg>
                  <div className="tooltip">
                    Businesses that use lead gen agencies see up to 62% higher conversion rates versus those generating leads entirely in-house. (Source: MarketingSherpa)
                  </div>
                </span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-number">46%</div>
              <div className="stat-label">
                <span>Faster Scaling</span>
                <span className="info-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8" r="7.5" stroke="#D1D5DB"/>
                    <path d="M8 6.5V11.5" stroke="#D1D5DB" strokeLinecap="round"/>
                    <circle cx="8" cy="4.5" r="0.5" fill="#D1D5DB"/>
                  </svg>
                  <div className="tooltip">
                    Companies using outsourced lead gen scale their sales pipeline 46% faster on average, according to research from DemandScience.
                  </div>
                </span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-number">53%</div>
              <div className="stat-label">
                <span>Lower CAC</span>
                <span className="info-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8" r="7.5" stroke="#D1D5DB"/>
                    <path d="M8 6.5V11.5" stroke="#D1D5DB" strokeLinecap="round"/>
                    <circle cx="8" cy="4.5" r="0.5" fill="#D1D5DB"/>
                  </svg>
                  <div className="tooltip">
                    Partnering with a lead gen agency can reduce customer acquisition cost by over 50%, especially when paired with solid sales follow-up. (Source: HubSpot, 2023)
                  </div>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CASE STUDIES SECTION */}
      <CaseStudiesCarousel />

      {/* FAQ SECTION */}
      <section className="faq" id="faq">
        <div className="container">
          <h2 className="text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="faq-items">
            <div className="faq-item">
              <div className="faq-question" onClick={() => toggleFAQ(0)}>
                <h3>How do you find these leads?</h3>
                <span className="toggle-icon">+</span>
              </div>
              <div className="faq-answer">
                <p>We run paid ads targeting homeowners searching for solar. These ads are tailored to your region and send people to a custom landing page where they opt in for a quote.</p>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-question" onClick={() => toggleFAQ(1)}>
                <h3>Are the leads exclusive to me?</h3>
                <span className="toggle-icon">+</span>
              </div>
              <div className="faq-answer">
                <p>Yes. Every lead is 100% exclusive. We never share or resell leads—we believe that defeats the point.</p>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-question" onClick={() => toggleFAQ(2)}>
                <h3>What if the leads don't convert?</h3>
                <span className="toggle-icon">+</span>
              </div>
              <div className="faq-answer">
                <p>While no lead source is perfect, we focus on quality over quantity. Our leads are screened for intent, and we're always optimizing based on performance. We also offer a lead replacement guarantee for bad contacts.</p>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-question" onClick={() => toggleFAQ(3)}>
                <h3>Do I need to manage the ads?</h3>
                <span className="toggle-icon">+</span>
              </div>
              <div className="faq-answer">
                <p>Nope. We handle the targeting, setup, copy, and creative. You don't lift a finger unless you want to.</p>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-question" onClick={() => toggleFAQ(4)}>
                <h3>Is there a long-term contract?</h3>
                <span className="toggle-icon">+</span>
              </div>
              <div className="faq-answer">
                <p>No. We work on a month-to-month basis because we'd rather earn your business than trap you in.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="final-cta" id="cta">
        <div className="container">
          <h2>Book a call to get 10+ qualified solar leads in your area this month.</h2>
          <a href="https://calendly.com/pat-solarlift/30min?share_attribution=expiring_link" className="cta-button" target="_blank">Book a Free Strategy Call</a>
        </div>
      </section>

      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <Image src="/assets/logo/solar_lift_logo_v2.png" alt="Solar Lift Logo" width={150} height={40} />
            </div>
            <p>&copy; 2025 Solar Lift. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
