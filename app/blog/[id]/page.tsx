'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getBlogPostById, getPostContentHtml, getRelatedPosts } from '../../../lib/blog'
import { useParams, useRouter } from 'next/navigation'

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
  author: 'Solar Lift Team',
  authorRole: 'Support',
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
  const contentRef = useRef(null);
  const headingRefs = useRef({});

  const postId = params?.id;
  
  useEffect(() => {
    // Force loading state to exit after 5 seconds to avoid infinite loading
    const loadingTimeout = setTimeout(() => {
      if (!isLoaded) {
        console.log('Force exiting loading state after timeout');
        setIsLoaded(true);
        
        if (!post) {
          setPost(FALLBACK_POST);
        }
      }
    }, 5000);
    
    const fetchData = async () => {
      try {
        // If no ID provided, redirect to blog listing
        if (!postId) {
          console.error('No post ID provided');
          router.push('/blog');
          return;
        }
        
        // Get post by ID from params
        const blogPost = await getBlogPostById(postId);
        
        if (blogPost) {
          // Convert markdown content to HTML
          const htmlContent = await getPostContentHtml(blogPost.content);
          
          // Get related posts
          const related = await getRelatedPosts(postId, blogPost.category);
          
          setPost(blogPost);
          setContent(htmlContent);
          setRelatedPosts(related);
          setIsLoaded(true);
        } else {
          // Handle post not found
          console.error('Post not found');
          setPost(FALLBACK_POST);
          setContent('<p>The blog post you are looking for could not be found.</p>');
          setIsLoaded(true);
        }
      } catch (error) {
        console.error('Error loading blog post:', error);
        setIsError(true);
        setPost(FALLBACK_POST);
        setContent('<p>Error loading blog post. Please try again later.</p>');
        setIsLoaded(true);
      }
    };
    
    fetchData();
    
    // Clean up timeout
    return () => clearTimeout(loadingTimeout);
  }, [postId, router]);

  useEffect(() => {
    // Set up intersection observer for section headings after content is loaded
    if (content && contentRef.current) {
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
      
      // Find all headings in the content
      const headings = contentRef.current.querySelectorAll('h2, h3');
      headings.forEach((heading) => {
        headingRefs.current[heading.id] = heading;
        observer.observe(heading);
      });
      
      return () => {
        headings.forEach((heading) => {
          observer.unobserve(heading);
        });
      };
    }
  }, [content]);

  const generateTableOfContents = (content) => {
    if (!contentRef.current) return [];
    
    const headings = contentRef.current.querySelectorAll('h2, h3');
    const toc = [];
    
    headings.forEach(heading => {
      const id = heading.id || heading.textContent.toLowerCase().replace(/[^\w]+/g, '-');
      
      if (!heading.id) {
        heading.id = id;
      }
      
      toc.push({
        id,
        text: heading.textContent,
        level: heading.tagName.toLowerCase(),
      });
    });
    
    return toc;
  };

  const scrollToSection = (id) => {
    if (headingRefs.current[id]) {
      headingRefs.current[id].scrollIntoView({ behavior: 'smooth' });
    }
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
  
  const tableOfContents = generateTableOfContents(content);

  return (
    <>
      {/* Custom styles for blog content */}
      <style jsx global>{customStyles}</style>
      
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

      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto mb-12">
          <Link href="/blog" className="text-[#F9C846] flex items-center mb-4 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back to Blog
                </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">{post.title}</h1>
          
          <div className="flex flex-wrap items-center gap-3 mb-8 text-sm text-gray-600">
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

          <div className="w-full h-[400px] mb-12 relative rounded-xl overflow-hidden">
              <Image
                src={post.imageUrl}
              fill
                alt={post.title}
              className="object-cover"
              />
        </div>
      </div>

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar with table of contents */}
            {tableOfContents.length > 0 && (
              <div className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-32">
                  <div className="p-6 bg-gray-50 rounded-lg border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4">Table of Contents</h3>
                    <nav className="space-y-2">
                      {tableOfContents.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => scrollToSection(item.id)}
                          className={`block text-left w-full ${
                            item.level === 'h3' ? 'pl-4 text-sm' : ''
                          } ${
                            activeSection === item.id
                              ? 'text-[#F9C846] font-medium'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          {item.text}
                        </button>
                ))}
              </nav>
          </div>

                  <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-100">
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
                    <div className="border-t border-gray-200 pt-4">
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
            )}
            
            {/* Main content */}
            <div className="flex-1 min-w-0">
              <article className="prose prose-lg max-w-none lg:max-w-3xl 
                prose-headings:font-bold prose-headings:text-gray-800 
                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                prose-p:text-gray-700 prose-p:mb-4
                prose-ul:ml-6 prose-ul:list-disc prose-ul:mb-4
                prose-ol:list-none prose-ol:pl-0 prose-ol:mb-4
                prose-ol:counter-reset-[list-counter]
                prose-li:mb-4
                prose-ol>prose-li:relative prose-ol>prose-li:pl-0 
                prose-ol>prose-li:counter-increment-[list-counter]
                prose-ol>prose-li:before:content-[counter(list-counter)'.'] 
                prose-ol>prose-li:before:font-bold prose-ol>prose-li:before:text-gray-800
                prose-ol>prose-li:before:mr-2 prose-ol>prose-li:before:inline-block
                prose-blockquote:border-l-4 prose-blockquote:border-[#F9C846] 
                prose-blockquote:bg-yellow-50 prose-blockquote:pl-4 prose-blockquote:py-2 
                prose-blockquote:italic
                prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-gray-800 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded
                prose-a:text-[#F9C846] prose-a:no-underline hover:prose-a:underline">
                <div 
                  ref={contentRef}
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </article>
              
              {/* Author card for mobile */}
              <div className="mt-16 p-6 bg-gray-50 rounded-lg border border-gray-100 lg:hidden">
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
                <div className="border-t border-gray-200 pt-4">
                  <a
                    href="https://calendly.com/pat-solarlift/30min"
                    className="block w-full py-3 bg-[#F9C846] text-center text-gray-900 rounded font-medium hover:bg-[#e0b53c] transition-colors"
                    target="_blank"
                  >
                    Book a Free Strategy Call
                  </a>
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
    </>
  );
}
