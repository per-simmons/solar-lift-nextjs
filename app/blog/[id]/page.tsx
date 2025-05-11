'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getBlogPostById, getPostContentHtml, getRelatedPosts } from '../../../lib/blog'
import { useParams, useRouter } from 'next/navigation'
// Import individual Lucide icons instead of the whole package
import { Link as LinkIcon, Linkedin, Facebook, Twitter } from "lucide-react"

// Custom styles for blog post content
const customStyles = `
  /* For numbered objections - Option B implementation */
  .numbered-objection {
    margin-top: 2rem;
    margin-bottom: 1.5rem;
  }

  .objection-number {
    font-weight: 700;
    font-size: 1.25rem;
    color: #333;
    display: inline-block;
    margin-right: 0.5rem;
    vertical-align: middle;
  }

  .objection-text {
    font-weight: 700;
    font-size: 1.25rem;
    color: #333;
    display: inline-block;
    vertical-align: middle;
  }

  .objection-meaning {
    font-style: italic;
    color: #555;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
  }

  .objection-response {
    margin-bottom: 1.5rem;
  }

  /* Fix for double bullets */
  .prose ul {
    list-style-type: none;
    padding-left: 0;
    margin-left: 0;
  }

  .prose ul li {
    position: relative;
    padding-left: 1.75rem;
    margin-bottom: 0.75rem;
  }

  .prose ul li::before {
    content: '';
    position: absolute;
    left: 0.5rem;
    top: 0.6em;
    width: 8px;
    height: 8px;
    background-color: #333;
    border-radius: 50%;
  }

  /* Remove default gray bullet */
  .prose ul li > span:first-child {
    display: none;
  }

  /* For the scoring rubric section */
  .scoring-rubric-item {
    margin-bottom: 1.5rem;
  }

  .scoring-rubric-heading {
    font-weight: 700;
    font-size: 1.125rem;
    margin-bottom: 0.5rem;
  }

  .scoring-rubric-option {
    margin-left: 1rem;
    margin-bottom: 0.25rem;
  }
`;

// Fallback post for 404 case
const FALLBACK_POST = {
  id: 1,
  title: 'Blog Post Not Found',
  excerpt: 'Sorry, the blog post you are looking for could not be found.',
  content: '# Blog Post Not Found\n\nThe blog post you are looking for could not be found. Please check the URL or go back to the blog page.',
  slug: 'not-found',
  category: 'Error',
  date: new Date().toISOString().split('T')[0],
  author: 'Pat Simmons',
  authorRole: 'Founder',
  readTime: '1 min read',
  authorImageUrl: "/assets/blog/authors/solar-lift-headshot-pat-simmons.png",
  imageUrl: "/assets/dummy-images/blog-post-1-dummy.png"
};

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [content, setContent] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [activeSection, setActiveSection] = useState('');
  const [tocItems, setTocItems] = useState([]);
  const [tocLoading, setTocLoading] = useState(true);
  const contentRef = useRef(null);
  const headingRefs = useRef({});
  const isMountedRef = useRef(true);

  // Extract and convert postId to string to fix type errors
  const postId = params?.id ? String(params.id) : undefined;
  
  // Set up isMountedRef for cleanup
  useEffect(() => {
    // Component mounted
    isMountedRef.current = true;
    
    // Cleanup on unmount
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  useEffect(() => {
    // Increase timeout to 15 seconds to avoid premature fallback to error state
    const loadingTimeout = setTimeout(() => {
      if (isMountedRef.current && !isLoaded) {
        console.log('Force exiting loading state after extended timeout (15s)');
        setIsLoaded(true);
        
        if (!post) {
          console.error('Blog post data not loaded within timeout period. Displaying fallback.');
          setPost(FALLBACK_POST);
          setIsError(true);
        }
      }
    }, 15000);
    
    const fetchData = async () => {
      try {
        // If no ID provided, redirect to blog listing
        if (!postId) {
          console.error('No post ID provided');
          router.push('/blog');
          return;
        }
        
        console.log(`Starting to fetch blog post with ID: ${postId}`);
        
        // Get post by ID from params
        const blogPost = await getBlogPostById(postId);
        
        if (!isMountedRef.current) {
          console.log('Component unmounted, cancelling update');
          return;
        }
        
        console.log(`Blog post data received:`, blogPost ? 'Success' : 'Not found');
        
        if (blogPost) {
          try {
            // Convert markdown content to HTML
            console.log('Converting markdown to HTML...');
            const htmlContent = await getPostContentHtml(blogPost.content);
            
            if (!isMountedRef.current) {
              console.log('Component unmounted, cancelling update');
              return;
            }
            
            console.log('HTML conversion complete');
            
            // Get related posts
            console.log('Fetching related posts...');
            const related = await getRelatedPosts(postId, blogPost.category);
            
            if (!isMountedRef.current) {
              console.log('Component unmounted, cancelling update');
              return;
            }
            
            console.log(`Found ${related.length} related posts`);
            
            // Clear the timeout first to prevent it from firing after data is loaded
            clearTimeout(loadingTimeout);
            
            // Set all data and mark as loaded - only after everything is ready
            setPost(blogPost);
            setContent(htmlContent);
            setRelatedPosts(related);
            setIsLoaded(true);
            console.log('Blog post and related data fully loaded');
          } catch (conversionError) {
            // Clear timeout before showing error state
            clearTimeout(loadingTimeout);
            
            if (!isMountedRef.current) {
              console.log('Component unmounted, cancelling update');
              return;
            }
            
            console.error('Error processing blog content:', conversionError);
            setIsError(true);
            setPost({
              ...blogPost,
              content: 'Error processing blog content. Please try again later.'
            });
            setContent('<p>Error processing blog content. Please try again later.</p>');
            setIsLoaded(true);
          }
        } else {
          // Clear timeout before showing error state
          clearTimeout(loadingTimeout);
          
          if (!isMountedRef.current) {
            console.log('Component unmounted, cancelling update');
            return;
          }
          
          // Handle post not found
          console.error(`Post with ID ${postId} not found`);
          setIsError(true);
          setPost(FALLBACK_POST);
          setContent('<p>The blog post you are looking for could not be found.</p>');
          setIsLoaded(true);
        }
      } catch (error) {
        // Clear timeout before showing error state
        clearTimeout(loadingTimeout);
        
        if (!isMountedRef.current) {
          console.log('Component unmounted, cancelling update');
          return;
        }
        
        console.error('Error loading blog post:', error);
        setIsError(true);
        setPost(FALLBACK_POST);
        setContent('<p>Error loading blog post. Please try again later.</p>');
        setIsLoaded(true);
      }
    };
    
    // Start the fetch process immediately
    console.log('Initiating blog post data fetch');
    fetchData();
    
    // Clean up timeout
    return () => {
      console.log('Cleaning up blog post page - clearing timeout');
      clearTimeout(loadingTimeout);
    };
  }, [postId, router]);

  // Handle direct DOM manipulation for content insertion and heading processing
  useEffect(() => {
    if (!contentRef.current || !content) return;
    
    // Insert the HTML content
    contentRef.current.innerHTML = content;
    
    // Now process all headings to add IDs and build TOC
    const processHeadings = () => {
      const headings = contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
      console.log(`Found ${headings.length} headings in content`);
      
      if (headings.length === 0) {
        setTocLoading(false);
        setTocItems([]);
        return;
      }
      
      const items = [];
      
      headings.forEach((heading, index) => {
        // Create a unique ID for each heading
        const uniqueId = `heading-${index}-${Math.random().toString(36).substr(2, 9)}`;
        heading.setAttribute('id', uniqueId);
        
        // Add a class to make headings more visible for debugging
        heading.classList.add('blog-heading');
        
        console.log(`Added ID ${uniqueId} to heading: "${heading.textContent}"`);
        
        // Only include h2 and h3 in the TOC
        if (heading.tagName.toLowerCase() === 'h2' || heading.tagName.toLowerCase() === 'h3') {
          items.push({
            id: uniqueId,
            text: heading.textContent,
            level: heading.tagName.toLowerCase()
          });
        }
      });
      
      setTocItems(items);
      setTocLoading(false);
      
      // Set up the intersection observer for active section tracking
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          });
        },
        { rootMargin: '-100px 0px -80% 0px' }
      );
      
      // Observe all headings
      headings.forEach(heading => {
        if (heading.id) {
          observer.observe(heading);
        }
      });
      
      // Clean up observer on effect cleanup
      return () => {
        observer.disconnect();
      };
    };
    
    // Process headings after a short delay to ensure content is fully rendered
    const timer = setTimeout(processHeadings, 500);
    
    // Cleanup function
    return () => {
      clearTimeout(timer);
    };
  }, [content]);

  const scrollToSection = (id) => {
    console.log(`Attempting to scroll to ID: ${id}`);
    
    const element = document.getElementById(id);
    
    if (!element) {
      console.error(`Element with ID ${id} not found`);
      return;
    }
    
    console.log(`Found element with ID ${id}:`, element);
    
    // Add visible indication this element was targeted (helpful for debugging)
    element.style.scrollMarginTop = '120px';
    
    // Smoothly scroll to the element
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 pt-32 pb-16 flex justify-center items-center min-h-[500px]">
        <p className="text-xl text-gray-500">Loading post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 pt-32 pb-16 flex flex-col justify-center items-center min-h-[500px]">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Blog Post Not Found</h1>
        <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
        <Link href="/blog" className="px-6 py-3 bg-[#F9C846] text-gray-900 rounded-full font-medium">
          Return to Blog
        </Link>
      </div>
    );
  }
  
  return (
    <>
      {/* Custom styles for blog content */}
      <style jsx global>{customStyles}</style>
      
      {/* Main content wrapper with key to prevent state loss during Fast Refresh */}
      <div key={`blog-post-${postId}`}>
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

        {/* Header with gray background - similar to original design */}
        <div className="bg-gray-50 pt-32 pb-16">
          <div className="container mx-auto px-4 max-w-7xl">
            {/* Breadcrumbs */}
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <Link href="/blog" className="hover:text-gray-700">
                Blog
              </Link>
              <span className="mx-2">›</span>
              <Link href={`/blog?category=${post.category}`} className="hover:text-gray-700">
                {post.category}
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Title and author section */}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">{post.title}</h1>
                
                <div className="flex items-center mb-4">
                  <Image 
                    src={post.authorImageUrl} 
                    width={48}
                    height={48}
                    alt={post.author} 
                    className="rounded-full mr-4"
                  />
                  <div>
                    <div className="text-sm text-gray-500">Author</div>
                    <div className="font-medium">{post.author}</div>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                  <span className="px-3 py-1 bg-gray-100 rounded-full font-medium">{post.category}</span>
                  <span>•</span>
                  <span>{post.date}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    {post.readTime}
                  </span>
                </div>
              </div>
              
              {/* Featured image */}
              <div className="relative h-[300px] rounded-lg overflow-hidden">
                <Image
                  src={post.imageUrl}
                  fill
                  alt={post.title}
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="container mx-auto px-4 py-12 pt-16 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Contents sidebar - Always visible */}
            <div className="lg:col-span-3">
              <div className="sticky top-28">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Contents</h2>
                  {tocLoading ? (
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded mb-3 w-5/6"></div>
                      <div className="h-4 bg-gray-200 rounded mb-3 w-4/6"></div>
                    </div>
                  ) : tocItems.length > 0 ? (
                    <nav className="space-y-3">
                      {tocItems.map((item) => (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            scrollToSection(item.id);
                          }}
                          className={`block text-left w-full cursor-pointer ${
                            item.level === 'h3' ? 'pl-4 text-sm' : ''
                          } ${
                            activeSection === item.id
                              ? 'text-[#F9C846] font-medium'
                              : 'text-gray-600 hover:text-[#F9C846]'
                          }`}
                        >
                          {item.text}
                        </a>
                      ))}
                    </nav>
                  ) : (
                    <p className="text-gray-600">This article doesn't have section headings.</p>
                  )}
                </div>

                <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
                  <h3 className="font-bold text-gray-800 text-lg mb-3">Want to drive more leads for your solar business?</h3>
                  <p className="text-gray-600 mb-4">We can help.</p>
                  
                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Image 
                        src={post.authorImageUrl} 
                        width={48}
                        height={48}
                        alt={post.author} 
                        className="rounded-full"
                      />
                      <div>
                        <h3 className="font-bold text-gray-800">{post.author}</h3>
                        <p className="text-sm text-gray-600">{post.authorRole}</p>
                      </div>
                    </div>
                    
                    <a
                      href="https://calendly.com/pat-solarlift/30min"
                      className="block w-full py-2 bg-[#F9C846] text-center text-gray-900 rounded font-medium hover:bg-[#e0b53c] transition-colors"
                      target="_blank"
                    >
                      Book a Strategy Call
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main content */}
            <div className="lg:col-span-7">
              <article className="prose prose-lg max-w-none 
                prose-headings:font-bold prose-headings:text-gray-800 
                prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                prose-p:text-gray-700 prose-p:mb-6 prose-p:leading-relaxed
                prose-ul:ml-6 prose-ul:list-disc prose-ul:mb-6
                prose-ol:list-none prose-ol:pl-0 prose-ol:mb-6
                prose-ol:counter-reset-[list-counter]
                prose-li:mb-4 prose-li:leading-relaxed
                prose-ol>prose-li:relative prose-ol>prose-li:pl-0 
                prose-ol>prose-li:counter-increment-[list-counter]
                prose-ol>prose-li:before:content-[counter(list-counter)'.'] 
                prose-ol>prose-li:before:font-bold prose-ol>prose-li:before:text-gray-800
                prose-ol>prose-li:before:mr-3 prose-ol>prose-li:before:inline-block
                prose-blockquote:border-l-4 prose-blockquote:border-[#F9C846] 
                prose-blockquote:bg-yellow-50 prose-blockquote:pl-6 prose-blockquote:py-3 
                prose-blockquote:italic prose-blockquote:text-gray-700
                prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-gray-800 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg
                prose-a:text-[#F9C846] prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-800 prose-strong:font-bold
                prose-img:rounded-lg prose-img:shadow-md">
                <div 
                  ref={contentRef}
                ></div>
              </article>
              
              {/* Author profile for all screen sizes */}
              <div className="mt-16 p-6 bg-gray-50 rounded-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6">About the Author</h3>
                <div className="flex items-start gap-5">
                  <Image
                    src={post.authorImageUrl}
                    width={80}
                    height={80}
                    alt={post.author}
                    className="rounded-full"
                  />
                  <div>
                    <h4 className="font-bold text-lg text-gray-800">{post.author}</h4>
                    <p className="text-gray-600 mb-3">{post.authorRole}</p>
                    <p className="text-gray-700 mb-4">
                      Pat helps solar installation companies generate qualified solar leads through data-driven marketing strategies that increase sales and lower customer acquisition costs.
                    </p>
                  </div>
                </div>
              </div>
          
              {/* Related articles */}
              {relatedPosts.length > 0 && (
                <div className="mt-16">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Articles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {relatedPosts.map((relatedPost) => (
                      <div key={relatedPost.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <Link href={`/blog/${relatedPost.id}`} className="block">
                          <Image
                            src={relatedPost.imageUrl}
                            width={300}
                            height={180}
                            alt={relatedPost.title}
                            className="w-full h-[180px] object-cover"
                          />
                        </Link>
                        <div className="p-6">
                          <span className="text-xs font-medium text-[#F9C846] uppercase tracking-wider">{relatedPost.category}</span>
                          <Link href={`/blog/${relatedPost.id}`}>
                            <h3 className="font-bold mt-1 hover:text-[#F9C846] transition-colors">{relatedPost.title}</h3>
                          </Link>
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{relatedPost.excerpt}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Share buttons column */}
            <div className="lg:col-span-2 hidden lg:block">
              <div className="sticky top-32 flex justify-end">
                <div>
                  <div className="text-gray-500 mb-4 text-sm font-medium">SHARE</div>
                  <div className="flex flex-col space-y-6">
                    <a 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
                        window.open(url, 'linkedin-share', 'width=600,height=600');
                      }}
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300"
                    >
                      <i className="fab fa-linkedin text-gray-600 text-xl"></i>
                    </a>
                    <a 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
                        window.open(url, 'facebook-share', 'width=600,height=700');
                      }}
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300"
                    >
                      <i className="fab fa-facebook-f text-gray-600 text-xl"></i>
                    </a>
                    <a 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`;
                        window.open(url, 'twitter-share', 'width=550,height=500');
                      }}
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300"
                    >
                      <i className="fab fa-twitter text-gray-600 text-xl"></i>
                    </a>
                    <button 
                      onClick={() => {
                        if (typeof navigator !== 'undefined') {
                          navigator.clipboard.writeText(window.location.href);
                          alert('Link copied to clipboard!');
                        }
                      }}
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300"
                    >
                      <i className="fas fa-link text-gray-600 text-xl"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* CALL TO ACTION */}
        <div className="bg-gray-900 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to grow your solar business?</h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Book a free strategy call to discuss how we can help you generate more qualified solar leads and increase your installation volume.
            </p>
            <a 
              href="https://calendly.com/pat-solarlift/30min" 
              className="inline-block bg-[#F9C846] text-gray-900 font-bold px-8 py-3 rounded-full hover:bg-[#e0b53c] transition-colors"
              target="_blank"
            >
              Book Your Strategy Call
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
