'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search } from "lucide-react"
import styles from './blog.module.css'
import { getAllBlogPosts, getAllCategories } from "../../lib/blog"

// Fallback posts for when API fails
const FALLBACK_POSTS = [
  {
    id: 1,
    title: 'How to Generate High-Quality Solar Leads',
    excerpt: 'Discover the most effective strategies for generating qualified solar leads that convert into installations.',
    category: 'Lead Generation',
    date: '2023-01-15',
    readTime: '5 min read',
    imageUrl: '/assets/dummy-images/blog-post-1-dummy.png',
    featured: true
  },
  {
    id: 2,
    title: 'The Complete Guide to Solar Sales',
    excerpt: 'Learn the proven techniques to boost your solar sales and close more deals.',
    category: 'Sales',
    date: '2023-02-20',
    readTime: '7 min read',
    imageUrl: '/assets/dummy-images/blog-post-2-dummy.png',
    featured: false
  },
  {
    id: 3,
    title: 'Understanding Solar Installation Costs',
    excerpt: 'A comprehensive breakdown of solar installation costs and how to explain them to potential customers.',
    category: 'Installation',
    date: '2023-03-10',
    readTime: '6 min read',
    imageUrl: '/assets/dummy-images/blog-post-3-dummy.png',
    featured: false
  }
];

// Fallback categories if API fails
const FALLBACK_CATEGORIES = ['Lead Qualification', 'Lead Generation', 'Appointment Setting'];

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState(FALLBACK_POSTS)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    // Load posts and categories on component mount
    async function fetchData() {
      try {
        console.log('Fetching blog posts and categories...')
        setIsLoading(true)
        
        // Fetch blog posts
        const posts = await getAllBlogPosts()
        
        if (posts && posts.length > 0) {
          console.log('Blog posts fetched successfully:', posts.length)
          setBlogPosts(posts)
        } else {
          console.log('No blog posts found, using fallback')
          setBlogPosts(FALLBACK_POSTS)
        }
        
        // Fetch categories
        const allCategories = await getAllCategories()
        
        if (allCategories && allCategories.length > 0) {
          console.log('Categories fetched successfully:', allCategories)
          setCategories(allCategories)
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching blog data:', error)
        setIsError(true)
        setIsLoading(false)
        setBlogPosts(FALLBACK_POSTS)
      }
    }
    
    // Call the fetch function
    fetchData()
    
    // Provide a fallback timeout to ensure loading state doesn't get stuck
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.log('Loading timeout triggered, using fallback data')
        setIsLoading(false)
      }
    }, 5000)
    
    // Clean up timeout
    return () => clearTimeout(timeout)
  }, []) // Empty dependency array to only run on mount
  
  // Filter posts based on category and search query
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory ? post.category === selectedCategory : true
    const matchesSearch = searchQuery.trim() === '' ? true : 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesCategory && matchesSearch
  });
  
  // Featured post is the first one marked as featured
  const featuredPost = filteredPosts.find(post => post.featured);
  
  // Other posts are all non-featured posts
  const otherPosts = filteredPosts.filter(post => !post.featured);
  
  return (
    <>
      {/* FLOATING NAVIGATION BAR - Same as main site for consistency */}
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
            <Link href="/#case-studies-section">Results</Link>
            <Link href="/#faq">FAQs</Link>
            <Link href="/blog" className="active">Blog</Link>
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

      <div className="container mx-auto px-4 pt-32 pb-8 max-w-7xl relative">
        {/* Decorative background element - using yellow accent color */}
        <div className="absolute top-0 right-0 -z-10 w-[400px] h-[400px] bg-gradient-to-br from-[#F9C846]/80 to-[#F9C846]/40 rounded-full blur-xl"></div>

        {/* Header */}
        <header className="mb-16 max-w-3xl">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Solar Lift Blog</h1>
          <p className="text-lg text-gray-700">
            Expert insights, industry trends, and practical advice to help solar companies generate more qualified leads and grow their business.
          </p>
        </header>

        {/* Filter and Search */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-16">
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedCategory === '' 
                  ? "bg-gray-800 text-white" 
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              View all
            </button>
            
            {/* Dynamically render category buttons */}
            {categories.map(category => (
              <button 
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedCategory === category 
                    ? "bg-gray-800 text-white" 
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-auto min-w-[300px]">
            <input
              type="text"
              placeholder="Search blog posts"
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

        {/* Blog post content */}
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <p className="text-xl text-gray-500">Loading blog posts...</p>
          </div>
        ) : isError ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <p className="text-xl text-gray-500">Error loading blog posts. Please try again later.</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <p className="text-xl text-gray-500">No blog posts found matching your criteria.</p>
          </div>
        ) : (
          <>
            {/* Featured Posts Section */}
            <section>
              <h2 className="text-4xl font-bold text-gray-800 mb-8">Featured Solar Insights</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Featured Post */}
                {featuredPost ? (
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
                    <Link href={`/blog/${featuredPost.id}`} className="relative block">
                      <Image
                        src={featuredPost.imageUrl}
                        width={600}
                        height={400}
                        alt={featuredPost.title}
                        className="w-full h-[300px] object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-gray-900/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        {featuredPost.readTime}
                      </div>
                    </Link>
                    <div className="p-6">
                      <Link href={`/blog/${featuredPost.id}`}>
                        <h3 className="text-xl font-bold mb-3 hover:text-[#F9C846] transition-colors">{featuredPost.title}</h3>
                      </Link>
                      <p className="text-gray-600 mb-4">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="font-medium">{featuredPost.category}</span>
                        <span>•</span>
                        <span>{featuredPost.date}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded-lg p-6 flex items-center justify-center">
                    <p className="text-gray-500">No featured posts available</p>
                  </div>
                )}

                {/* Right column posts */}
                <div className="space-y-6">
                  {otherPosts.slice(0, 3).map((post) => (
                    <div key={post.id} className="flex gap-4 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <Link href={`/blog/${post.id}`} className="w-[140px] h-[140px] flex-shrink-0">
                        <Image
                          src={post.imageUrl}
                          width={140}
                          height={140}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </Link>
                      <div className="py-4 pr-4 flex-1">
                        <div className="mb-2">
                          <span className="text-xs font-medium text-[#F9C846] uppercase tracking-wider">{post.category}</span>
                        </div>
                        <Link href={`/blog/${post.id}`}>
                          <h3 className="font-bold hover:text-[#F9C846] transition-colors">{post.title}</h3>
                        </Link>
                        <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
                          <span>{post.date}</span>
                          <span>•</span>
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* All Blog Posts */}
            <section className="mt-20">
              <h2 className="text-4xl font-bold text-gray-800 mb-8">All Articles</h2>
              
              {filteredPosts.length === 0 ? (
                <div className="bg-white rounded-lg p-8 text-center border border-gray-100">
                  <p className="text-gray-600 mb-2">No articles found matching your criteria.</p>
                  <button 
                    onClick={() => {setSelectedCategory(''); setSearchQuery('')}}
                    className="text-[#F9C846] font-medium hover:underline"
                  >
                    View all articles
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.map((post) => (
                    <div key={post.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <Link href={`/blog/${post.id}`} className="block">
                        <Image
                          src={post.imageUrl}
                          width={400}
                          height={250}
                          alt={post.title}
                          className="w-full h-[200px] object-cover"
                        />
                      </Link>
                      <div className="p-6">
                        <div className="mb-2">
                          <span className="text-xs font-medium text-[#F9C846] uppercase tracking-wider">{post.category}</span>
                        </div>
                        <Link href={`/blog/${post.id}`}>
                          <h3 className="text-lg font-bold mb-3 hover:text-[#F9C846] transition-colors">{post.title}</h3>
                        </Link>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <div className="text-gray-500">
                            {post.date} • {post.readTime}
                          </div>
                          <Link href={`/blog/${post.id}`} className="font-medium text-[#F9C846] hover:underline">
                            Read more
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
        
        {/* CALL TO ACTION - Now in white background */}
        <div className="bg-white text-center py-16 mt-16 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Ready to grow your solar business?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Book a free strategy call to discuss how we can help you generate more qualified solar leads and increase your installation volume.
          </p>
          <a 
            href="https://calendly.com/pat-solarlift/30min" 
            className="inline-block bg-[#F9C846] text-gray-900 font-bold px-8 py-3 rounded-full hover:bg-[#f0bf3a] transition-colors"
            target="_blank"
          >
            Book Your Strategy Call
          </a>
        </div>
      </div>
    </>
  )
}

