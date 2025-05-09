"use client";

import { useEffect, useRef } from 'react';
// @ts-ignore - Ignoring type issues with Splide library
import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import Image from 'next/image';

interface CaseStudy {
  id: number;
  clientName: string;
  clientType: string;
  title: string;
  stats: { label: string; value: string }[];
}

const caseStudies: CaseStudy[] = [
  {
    id: 1,
    clientName: 'SunBright',
    clientType: 'Residential',
    title: '2x increase in booked site visits for California-based installer',
    stats: [
      { label: 'Leads delivered in 3 months', value: '146' },
      { label: 'Close rate vs. typical marketplace', value: '3.1x' }
    ]
  },
  {
    id: 2,
    clientName: 'TerraVolt',
    clientType: 'Commercial',
    title: '45% reduction in customer acquisition costs for mid-size commercial installer',
    stats: [
      { label: 'Booked appointments in 15 months', value: '227' },
      { label: 'Avg. monthly KPIs', value: '120%' }
    ]
  },
  {
    id: 3,
    clientName: 'SolarEdge',
    clientType: 'Residential',
    title: '320+ qualified leads for nationwide residential solar provider',
    stats: [
      { label: 'Deals won in first 3 months', value: '9' },
      { label: 'ROI on marketing spend', value: '285%' }
    ]
  },
  {
    id: 4,
    clientName: 'GreenSpark',
    clientType: 'Residential',
    title: '73% higher conversion rate from lead to install for regional mid-Atlantic installer',
    stats: [
      { label: 'Qualified leads generated in 6 months', value: '284' },
      { label: 'Average cost per acquisition reduction', value: '2.4x' }
    ]
  }
];

const CaseStudiesCarousel: React.FC = () => {
  // @ts-ignore - Using any type for Splide ref to avoid type errors
  const splideRef = useRef<any>(null);

  useEffect(() => {
    const handleResize = () => {
      if (splideRef.current && typeof splideRef.current.refresh === 'function') {
        splideRef.current.refresh();
      } else if (splideRef.current && splideRef.current.splide) {
        // Alternative approach if direct refresh isn't available
        splideRef.current.splide.refresh();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className="case-studies-section py-16 md:py-24 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="header-content max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Real Leads. Real Installs. Real Growth.</h2>
            <p className="text-gray-600 max-w-3xl">
              See how solar companies across the country are scaling faster with Solar Lift.
            </p>
          </div>
          
          {/* Navigation arrows */}
          <div className="splide-nav flex items-center gap-3 mt-4 md:mt-0">
            <button 
              onClick={() => splideRef.current?.go('<')}
              className="prev-arrow w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#FFB800] hover:text-[#FFB800] transition-all duration-200"
              aria-label="Previous slide"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </button>
            <button 
              onClick={() => splideRef.current?.go('>')}
              className="next-arrow w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#FFB800] hover:text-[#FFB800] transition-all duration-200"
              aria-label="Next slide"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Carousel with right bleeding effect but left aligned with container */}
        <div className="relative overflow-visible">
          <div className="splide-container overflow-visible">
            <Splide
              ref={splideRef}
              options={{
                type: 'slide',
                perPage: 1,
                perMove: 1,
                gap: '30px',
                padding: { right: '5%' },
                arrows: false,
                pagination: false,
                drag: true,
                trimSpace: false,
                rewind: true,
                speed: 300,
                easing: 'ease',
                focus: 0,
                overflow: 'visible',
                clones: 0,
                start: 0,
                breakpoints: {
                  991: { perPage: 1, gap: '20px', padding: { right: '5%' } },
                  768: { 
                    perPage: 1, 
                    gap: 0, 
                    padding: { right: '25%' }, // Adjusted to show more of second card
                    focus: 0, 
                    trimSpace: false
                  }
                }
              }}
              hasTrack={false}
            >
              <SplideTrack>
                {caseStudies.map((study) => (
                  <SplideSlide key={study.id}>
                    <div className="carousel-slide-wrapper flex">
                      {/* Main case study card */}
                      <div className="case-study-card bg-white rounded-2xl shadow-md p-8">
                        <div className="card-header flex justify-between items-center mb-7">
                          <div className="client-logo font-bold text-lg">{study.clientName}</div>
                          <div className={`tag px-3 py-1 rounded-full text-xs font-semibold ${study.clientType.toLowerCase() === 'residential' ? 'text-blue-700 border border-blue-700' : 'text-green-700 border border-green-700'}`}>
                            {study.clientType}
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold mb-4 leading-tight">{study.title}</h3>
                        <a
                          href="#"
                          className="inline-flex items-center gap-2 font-semibold text-gray-900 hover:text-[#FFB800] group mt-auto"
                        >  
                          <div className="w-14 h-14 rounded-full border border-[#FFB800] text-[#FFB800] flex items-center justify-center group-hover:bg-[#FFB800] group-hover:text-white transition-all duration-200">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                          </div>
                          Read the case study
                        </a>
                      </div>
                      
                      {/* Metrics cards */}
                      <div className="metrics-row">
                        {study.stats.map((stat, index) => (
                          <div key={index} className="stats-card bg-white rounded-2xl shadow-md p-4">
                            <dt className="text-sm text-gray-600 font-semibold">{stat.label}</dt>
                            <dd className="text-3xl font-bold text-[#FFB800] mt-1">{stat.value}</dd>
                          </div>
                        ))}
                      </div>
                    </div>
                  </SplideSlide>
                ))}
              </SplideTrack>
            </Splide>
          </div>
        </div>

        <div className="mt-12">
          <a href="#" className="read-all-cases-btn inline-flex items-center justify-center text-gray-800 hover:text-[#FFB800] font-semibold text-xl py-4 px-8 bg-white rounded-xl shadow-sm transition-all duration-200">
            Read all cases
            <svg
              className="ml-2"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default CaseStudiesCarousel;
