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
      </div>

      {/* CALL TO ACTION */}
      <div className="bg-gray-900 text-white py-16 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to grow your solar business?</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
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

      {/* FOOTER */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="md:w-1/3">
              <Image src="/assets/logo/solar_lift_logo_v2_white.png" alt="Solar Lift Logo" width={150} height={40} className="mb-4" />
              <p className="text-gray-400 mb-4">
                Solar Lift helps solar companies qualify leads faster and close more installations with proven systems and strategies.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/#how-it-works" className="text-gray-400 hover:text-white">How We Work</Link></li>
                <li><Link href="/#different" className="text-gray-400 hover:text-white">Why Choose Us</Link></li>
                <li><Link href="/#case-studies-section" className="text-gray-400 hover:text-white">Case Studies</Link></li>
                <li><Link href="/#faq" className="text-gray-400 hover:text-white">FAQs</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@solarlift.co</li>
                <li>Phone: (555) 123-4567</li>
                <li>Austin, TX</li>
              </ul>
            </div>
            <div className="md:w-1/4">
              <h3 className="text-lg font-bold mb-4">Subscribe</h3>
              <p className="text-gray-400 mb-4">Get the latest solar marketing tips directly to your inbox.</p>
              <form className="flex gap-2">
                <input type="email" placeholder="Your email" className="px-4 py-2 rounded-l bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#F9C846] flex-1" />
                <button type="submit" className="bg-[#F9C846] text-gray-900 px-4 py-2 rounded-r font-medium hover:bg-[#f0bf3a] transition-colors">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; 2025 Solar Lift. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}

