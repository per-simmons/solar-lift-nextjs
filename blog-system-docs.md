# Blog System Documentation for Markdown Processing

## Overview
This document provides comprehensive guidance for the dynamic blog system that converts markdown files to properly styled HTML content. It addresses key components, styling requirements, and common issues to ensure consistent formatting across all blog posts.

## File Structure
```
app/
├── blog/
│   ├── articles/          # Markdown files for blog content
│   ├── [id]/              # Dynamic route for individual posts
│   │   └── page.tsx       # Individual blog post display
│   └── page.tsx           # Blog listing page
├── lib/
│   └── blog.js            # Core utility functions for blog processing
```

## Core Components

### 1. Markdown Processing (lib/blog.js)

```javascript
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

// Get blog post by ID (slug)
export async function getBlogPostById(id) {
  try {
    const posts = getAllBlogPosts();
    return posts.find(post => post.id === id) || null;
  } catch (error) {
    console.error('Error getting blog post by ID:', error);
    return null;
  }
}

// Convert markdown to HTML with custom processing
export async function getPostContentHtml(content) {
  // First perform custom transformations
  let processedContent = processMarkdownCustomElements(content);
  
  // Then convert to HTML with remark
  const result = await remark()
    .use(html, { sanitize: false })
    .use(remarkGfm)
    .process(processedContent);
  
  return result.toString();
}

// Process custom markdown elements before standard markdown processing
function processMarkdownCustomElements(content) {
  // Process objections first (numbered items with custom formatting)
  content = processObjections(content);
  
  // Process scoring rubric items
  content = processRubric(content);
  
  return content;
}

// Transform numbered objections into custom HTML
function processObjections(content) {
  // Match patterns like:
  // 1. "I'm just looking."
  // What it really means: They're curious, not committed.
  // How to flip it: "That's exactly why a quick chat makes sense..."
  const objectionPattern = /(\d+)\.\s*\n*\s*[""]([^""]+)[""]\s*\n*\s*What it really means:\s*([^\n]+)\s*\n*\s*How to flip it:\s*[""]([^""]+)[""]/g;
  
  return content.replace(objectionPattern, function(match, number, objection, meaning, response) {
    return `<div class="numbered-objection">
      <h3>
        <span class="objection-number">${number}.</span>
        <span class="objection-text">"${objection}"</span>
      </h3>
      <div class="objection-meaning">What it really means: ${meaning}</div>
      <div class="objection-response">How to flip it: "${response}"</div>
    </div>`;
  });
}

// Transform scoring rubric into custom HTML
function processRubric(content) {
  // Match patterns like:
  // - **Homeownership**
  //   0 = Renter
  //   1 = Owns less than 2 years
  //   2 = Confirmed owner (2+ years)
  const rubricPattern = /-\s+\*\*([^*]+)\*\*\s*\n\s*0\s*=\s*([^\n]+)\s*\n\s*1\s*=\s*([^\n]+)\s*\n\s*2\s*=\s*([^\n]+)/g;
  
  return content.replace(rubricPattern, function(match, heading, option0, option1, option2) {
    return `<div class="scoring-rubric-item">
      <div class="scoring-rubric-heading">${heading}</div>
      <div class="scoring-rubric-option">0 = ${option0}</div>
      <div class="scoring-rubric-option">1 = ${option1}</div>
      <div class="scoring-rubric-option">2 = ${option2}</div>
    </div>`;
  });
}

// Get all blog posts from filesystem
export function getAllBlogPosts() {
  const articlesDirectory = path.join(process.cwd(), 'app/blog/articles');
  const fileNames = fs.readdirSync(articlesDirectory);
  
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      // Remove ".md" from file name to get id
      const id = fileName.replace(/\.md$/, '');
      
      // Read markdown file as string
      const fullPath = path.join(articlesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);
      
      // Combine the data with the id
      return {
        id,
        content: matterResult.content,
        ...matterResult.data
      };
    });
  
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

// Get related posts based on category
export function getRelatedPosts(currentId, category) {
  const allPosts = getAllBlogPosts();
  
  return allPosts
    .filter(post => post.id !== currentId && post.category === category)
    .slice(0, 3); // Get up to 3 related posts
}

// Get all categories from blog posts
export function getAllCategories() {
  const posts = getAllBlogPosts();
  const categories = new Set();
  
  posts.forEach(post => {
    if (post.category) {
      categories.add(post.category);
    }
  });
  
  return Array.from(categories);
}
```

### 2. Blog Post Display Styling (app/blog/[id]/page.tsx)

Add these custom styles at the top of your page.tsx file:

```javascript
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
```

Apply these styles to the component:
```jsx
// In your component
<>
  {/* Custom styles for blog content */}
  <style jsx global>{customStyles}</style>
  
  {/* Rest of your component */}
</>
```

For the article element, use these Tailwind classes to ensure proper styling:
```jsx
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
```

## Markdown Format Guidelines

### 1. Numbered Objections
For proper styling of numbered objections, format them like this:

```markdown
1. "I'm just looking."
   What it really means: They're curious, not committed.
   How to flip it: "That's exactly why a quick chat makes sense. We can give you the basic numbers so you know what's realistic without any pressure. What's prompted you to start looking now?"
```

### 2. Bullet Points
For regular bullet points, use standard markdown:

```markdown
- This is a bullet point
- This is another bullet point
```

### 3. Scoring Rubric Items
For scoring rubric items, use this format:

```markdown
- **Homeownership**  
  0 = Renter  
  1 = Owns less than 2 years  
  2 = Confirmed owner (2+ years)
```

### 4. Headings
Use standard markdown headings:

```markdown
## Heading Level 2
### Heading Level 3
```

### 5. Blockquotes
Use standard markdown blockquotes:

```markdown
> **Pro Tip:** This is a blockquote that will be styled with a yellow background and left border.
```

## Common Issues and Solutions

### Double Bullets
If you see double bullets (gray + black), make sure the CSS is correctly removing the default bullets:
```css
.prose ul {
  list-style-type: none;
  padding-left: 0;
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
```

### Numbered Items Not Transforming
If numbered items aren't correctly transforming to the custom format:
1. Check that the regex pattern in `processObjections()` matches your markdown format
2. Ensure that `processMarkdownCustomElements()` is being called before remark processing
3. Verify that your markdown follows the exact format shown above

### Markdown Not Converting Correctly
If markdown isn't converting properly:
1. Make sure all required dependencies are installed: `gray-matter`, `remark`, `remark-html`, `remark-gfm`
2. Check for syntax errors in your markdown files
3. Verify that the file paths in `getAllBlogPosts()` are correct

## Adding a New Blog Post

1. Create a new markdown file in `app/blog/articles/` with a filename that will become the post's slug/ID
2. Include front matter at the top of the file:

```markdown
---
title: Your Blog Post Title
excerpt: A brief summary of your post
category: Post Category
date: "YYYY-MM-DD"
readTime: "X min"
author: Author Name
authorRole: Author Role
imageUrl: /path/to/image.jpg
featured: true/false
---

Your content starts here...
```

3. Follow the markdown formatting guidelines above for consistent styling
4. The post will automatically appear in the blog listing and be accessible at `/blog/your-file-name`

## Dependencies

```
npm install gray-matter remark remark-html remark-gfm
```