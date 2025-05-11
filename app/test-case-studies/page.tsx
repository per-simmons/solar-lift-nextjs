'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllCaseStudies, getCaseStudyById } from '../lib/case-studies-client';

export default function TestCaseStudiesPage() {
  const [allCaseStudies, setAllCaseStudies] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all case studies on page load
  useEffect(() => {
    async function fetchAllCaseStudies() {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching all case studies...');
        const studies = await getAllCaseStudies();
        console.log('Fetched case studies:', studies);
        setAllCaseStudies(studies);
      } catch (err) {
        console.error('Error fetching case studies:', err);
        setError('Failed to fetch case studies. See console for details.');
      } finally {
        setLoading(false);
      }
    }

    fetchAllCaseStudies();
  }, []);

  // Fetch a specific case study when selectedId changes
  useEffect(() => {
    async function fetchCaseStudy() {
      if (selectedId === null) return;
      
      try {
        setLoading(true);
        setError(null);
        console.log(`Fetching case study with ID ${selectedId}...`);
        const study = await getCaseStudyById(selectedId);
        console.log('Fetched case study:', study);
        setSelectedCaseStudy(study);
      } catch (err) {
        console.error(`Error fetching case study ${selectedId}:`, err);
        setError(`Failed to fetch case study ${selectedId}. See console for details.`);
      } finally {
        setLoading(false);
      }
    }

    fetchCaseStudy();
  }, [selectedId]);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Case Studies Test Page</h1>
      
      {/* API Test Controls */}
      <div className="mb-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">API Tests</h2>
        
        <div className="flex gap-4 mb-4">
          <Link 
            href="/api/case-studies?action=getAllCaseStudies" 
            target="_blank"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Test API: Get All Case Studies
          </Link>
          
          <Link 
            href="/api/case-studies/debug" 
            target="_blank"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Test API: Debug Info
          </Link>
        </div>
        
        <div className="flex gap-4">
          {[1, 2, 3, 4].map(id => (
            <Link 
              key={id}
              href={`/api/case-studies?action=getCaseStudyById&id=${id}`}
              target="_blank"
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            >
              Test API: Get Case Study #{id}
            </Link>
          ))}
        </div>
      </div>
      
      {/* Error display */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}
      
      {/* Loading indicator */}
      {loading && (
        <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          <p>Loading...</p>
        </div>
      )}
      
      {/* Case Studies List */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">All Case Studies</h2>
        
        {allCaseStudies.length === 0 && !loading ? (
          <p>No case studies found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allCaseStudies.map(study => (
              <div 
                key={study.id} 
                className="p-4 border rounded cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedId(study.id)}
              >
                <h3 className="font-bold">{study.title}</h3>
                <p className="text-sm text-gray-600">ID: {study.id} | Type: {study.clientType}</p>
                <p className="mt-2">{study.excerpt}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Selected Case Study Details */}
      {selectedCaseStudy && (
        <div className="border rounded p-6">
          <h2 className="text-2xl font-bold mb-4">{selectedCaseStudy.title}</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p><strong>Client:</strong> {selectedCaseStudy.clientName}</p>
              <p><strong>Type:</strong> {selectedCaseStudy.clientType}</p>
              <p><strong>Location:</strong> {selectedCaseStudy.location}</p>
            </div>
            <div>
              <p><strong>Category:</strong> {selectedCaseStudy.category}</p>
              <p><strong>Company Size:</strong> {selectedCaseStudy.companySize}</p>
              <p><strong>Published:</strong> {selectedCaseStudy.publishDate}</p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mb-2">Stats</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {selectedCaseStudy.stats.map((stat, index) => (
              <div key={index}>
                <p><strong>{stat.value}</strong> {stat.label}</p>
              </div>
            ))}
          </div>
          
          <h3 className="text-lg font-semibold mb-2">Image URLs</h3>
          <div className="mb-4">
            <p><strong>Logo:</strong> {selectedCaseStudy.logoUrl || 'None'}</p>
            <p><strong>Header Image:</strong> {selectedCaseStudy.imageUrl || 'None'}</p>
          </div>
          
          <h3 className="text-lg font-semibold mb-2">Content Preview</h3>
          <div className="p-4 bg-gray-50 rounded max-h-60 overflow-y-auto">
            <pre className="whitespace-pre-wrap">{selectedCaseStudy.content.substring(0, 500)}...</pre>
          </div>
          
          <div className="mt-4">
            <Link 
              href={`/case-studies/${selectedCaseStudy.id}`}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              View Full Case Study Page
            </Link>
          </div>
        </div>
      )}
    </div>
  );
} 