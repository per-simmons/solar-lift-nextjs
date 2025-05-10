import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';
import { NextResponse } from 'next/server';

const articlesDirectory = path.join(process.cwd(), 'app/blog/articles');

// Helper function for processing markdown to HTML
async function processMarkdownToHtml(content, options = {}) {
  // Pre-process content if needed
  let processedContent = content;
  
  // Process objections if requested
  if (options.processObjections) {
    processedContent = processObjections(processedContent);
    // Also process rubric items
    processedContent = processRubric(processedContent);
  } else {
    // Use the previous enhancing approach as fallback
    processedContent = enhanceOrderedListItems(processedContent);
  }
  
  const remarkResult = await remark()
    .use(remarkGfm, {
      singleTilde: false,
      tableCellPadding: true,
      tablePipeAlign: true,
      stringLength: () => 1
    })
    .use(html, { 
      sanitize: false,
      fragment: true
    })
    .process(processedContent);
  
  // Post-process the HTML if we're not using custom objection formatting
  let htmlString = remarkResult.toString();
  if (!options.processObjections) {
    htmlString = postProcessOrderedListHtml(htmlString);
  }
  
  // Enhance bullet points
  htmlString = enhanceBulletPoints(htmlString);
  
  return htmlString;
}

// Helper function to enhance ordered list items with custom formatting
function enhanceOrderedListItems(content) {
  // Regular expression to match list items like "1. **\"I'm just looking.\"**"
  // This matches: number, period, space, followed by bold text with quotation marks
  const regex = /^(\d+\.\s+)(\*\*\".*?\"\*\*)/gm;
  
  // Replace with a stronger emphasis/styling while preserving the numbering
  return content.replace(regex, (match, number, boldQuote) => {
    // Keep the structure but enhance it with a class or extra markup if needed
    return `${number}${boldQuote}`;
  });
}

// Post-process HTML to add custom classes to ordered list items
function postProcessOrderedListHtml(html) {
  // Find ordered list items and enhance them
  const olItemRegex = /<li>(.*?<strong>\".*?\"<\/strong>.*?)<\/li>/g;
  
  return html.replace(olItemRegex, (match, content) => {
    // Create a more prominent list item with custom styling
    return `<li class="objection-item">${content}</li>`;
  });
}

// Function to transform markdown for objections
function processObjections(content) {
  // Regular expression to match patterns like "4. \"My credit's not great.\""
  const objectionRegex = /(\d+)\.\s+[""]([^""]+)[""]\s*\n\s*What it really means: ([^\n]+)\s*\n\s*How to flip it: [""]([^""]+)[""]/g;
  
  return content.replace(objectionRegex, (match, number, objection, meaning, response) => {
    return `<div class="numbered-objection">
      <div>
        <span class="objection-number">${number}.</span>
        <span class="objection-text">${objection}</span>
      </div>
      <div class="objection-meaning">What it really means: ${meaning}</div>
      <div class="objection-response">How to flip it: "${response}"</div>
    </div>`;
  });
}

// Process the scoring rubric section
function processRubric(content) {
  // Find patterns like "- **Homeownership**"
  const rubricItemRegex = /-\s+\*\*([^*]+)\*\*\s*\n\s*0 = ([^\n]+)\s*\n\s*1 = ([^\n]+)\s*\n\s*2 = ([^\n]+)/g;
  
  return content.replace(rubricItemRegex, (match, heading, option0, option1, option2) => {
    return `<div class="scoring-rubric-item">
      <div class="scoring-rubric-heading">${heading}</div>
      <div class="scoring-rubric-option">0 = ${option0}</div>
      <div class="scoring-rubric-option">1 = ${option1}</div>
      <div class="scoring-rubric-option">2 = ${option2}</div>
    </div>`;
  });
}

// Function to enhance bullet points in HTML
function enhanceBulletPoints(html) {
  // This doesn't need to do anything since we're using CSS to style the bullet points
  return html;
}

// Simple function to get all blog posts
function getAllBlogPosts() {
  try {
    // Check if directory exists
    if (!fs.existsSync(articlesDirectory)) {
      console.error('Blog directory does not exist:', articlesDirectory);
      return [];
    }
    
    // Get file names under /blog/articles
    const fileNames = fs.readdirSync(articlesDirectory);
    
    // Keep only markdown files
    const mdFiles = fileNames.filter(fileName => fileName.endsWith('.md'));
    console.log('Markdown files found:', mdFiles);
    
    if (mdFiles.length === 0) {
      return [];
    }
    
    // Process each file into a blog post object
    const allPosts = mdFiles.map((fileName, index) => {
      try {
        // Read markdown file as string
        const fullPath = path.join(articlesDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        
        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents);
        
        // Create the post object with default values
        return {
          id: index + 1, // Sequential ID
          slug: fileName.replace(/\.md$/, ''),
          title: matterResult.data.title || 'Untitled Post',
          excerpt: matterResult.data.excerpt || 'No excerpt available',
          category: matterResult.data.category || 'Uncategorized',
          date: matterResult.data.date || new Date().toISOString().split('T')[0],
          readTime: matterResult.data.readTime || '5 min read',
          author: matterResult.data.author || 'Solar Lift Team',
          authorRole: matterResult.data.authorRole || '',
          authorImageUrl: matterResult.data.authorImageUrl || "/assets/blog/authors/solar-lift-headshot-pat-simmons.png",
          imageUrl: matterResult.data.imageUrl || "/assets/dummy-images/blog-post-1-dummy.png",
          featured: matterResult.data.featured || false,
          content: matterResult.content,
          fileName: fileName
        };
      } catch (error) {
        console.error('Error processing file:', fileName, error);
        return null;
      }
    }).filter(post => post !== null);
    
    // Sort by date (newest first)
    return allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error('Error getting blog posts:', error);
    return [];
  }
}

// Handler for GET requests
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');
    const category = searchParams.get('category');
    
    console.log('API Request:', action, id, slug, category);
    
    // Get all blog posts
    if (action === 'getAllPosts') {
      const posts = getAllBlogPosts();
      console.log('Returning posts count:', posts.length);
      return NextResponse.json(posts);
    }
    
    // Get all categories
    if (action === 'getAllCategories') {
      const posts = getAllBlogPosts();
      const categories = Array.from(new Set(posts.map(post => post.category).filter(Boolean)));
      return NextResponse.json(categories);
    }
    
    // Get post by ID
    if (action === 'getPostById' && id) {
      const posts = getAllBlogPosts();
      const post = posts.find(post => post.id === parseInt(id));
      
      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }
      
      return NextResponse.json(post);
    }
    
    // Get post by slug
    if (action === 'getPostBySlug' && slug) {
      const posts = getAllBlogPosts();
      const post = posts.find(post => post.slug === slug);
      
      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }
      
      return NextResponse.json(post);
    }
    
    // Get related posts
    if (action === 'getRelatedPosts' && id && category) {
      const posts = getAllBlogPosts();
      const limit = parseInt(searchParams.get('limit') || 3);
      
      const relatedPosts = posts
        .filter(post => post.id !== parseInt(id) && post.category === category)
        .slice(0, limit);
      
      return NextResponse.json(relatedPosts);
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Server error', message: error.message }, { status: 500 });
  }
}

// Handle POST request for markdown processing
export async function POST(request) {
  try {
    const body = await request.json();
    
    if (!body.content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }
    
    // For now, we'll just return the content directly as HTML
    // In production, you would use a markdown processor here
    return NextResponse.json({ 
      success: true, 
      html: body.content || '<p>No content provided</p>' 
    });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 