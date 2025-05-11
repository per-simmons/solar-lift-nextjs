'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function DebugPage() {
  const [status, setStatus] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    async function checkResources() {
      const resources = [
        '/assets/logo/solar_lift_logo_v2.png',
        '/assets/fonts/TestFoundersGrotesk-Regular-BF66175e972ac1c.otf',
        '/assets/case-study-1-wbe/wbe-logo-client-case-study-1.png',
        '/assets/case-study-1-wbe/wbe-solar-installation.jpg',
      ];
      
      const results: Record<string, boolean> = {};
      
      for (const resource of resources) {
        try {
          const response = await fetch(resource);
          results[resource] = response.ok;
        } catch (error) {
          results[resource] = false;
        }
      }
      
      setStatus(results);
    }
    
    checkResources();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Debug Page - Resource Status</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Resource Status:</h2>
        <ul className="space-y-2">
          {Object.entries(status).map(([resource, ok]) => (
            <li key={resource} className={`p-2 rounded ${ok ? 'bg-green-100' : 'bg-red-100'}`}>
              {resource}: {ok ? '✅ OK' : '❌ Failed'}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Test Images:</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="border p-4 rounded">
            <h3 className="font-medium mb-2">Logo Image:</h3>
            <div className="relative h-20 w-full">
              <Image 
                src="/assets/logo/solar_lift_logo_v2.png" 
                alt="Solar Lift Logo"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
          
          <div className="border p-4 rounded">
            <h3 className="font-medium mb-2">Case Study Logo:</h3>
            <div className="relative h-20 w-full">
              <Image 
                src="/assets/case-study-1-wbe/wbe-logo-client-case-study-1.png" 
                alt="WBE Logo"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
          
          <div className="border p-4 rounded">
            <h3 className="font-medium mb-2">Case Study Image:</h3>
            <div className="relative h-40 w-full">
              <Image 
                src="/assets/case-study-1-wbe/wbe-solar-installation.jpg" 
                alt="WBE Installation"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Navigation Links:</h2>
        <div className="flex flex-col space-y-2">
          <Link href="/test-case-studies" className="text-blue-500 hover:underline">Go to Test Case Studies Page</Link>
          <Link href="/case-studies" className="text-blue-500 hover:underline">Go to Case Studies List</Link>
          <Link href="/case-studies/1" className="text-blue-500 hover:underline">Go to Case Study #1</Link>
          <Link href="/api/case-studies?action=getAllCaseStudies" className="text-blue-500 hover:underline">API: Get All Case Studies</Link>
          <Link href="/api/case-studies?action=getCaseStudyById&id=1" className="text-blue-500 hover:underline">API: Get Case Study #1</Link>
          <Link href="/api/case-studies/debug" className="text-blue-500 hover:underline">API: Debug Info</Link>
        </div>
      </div>
    </div>
  );
} 