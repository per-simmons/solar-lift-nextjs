// Client-side utilities for fetching blog data from the API

export async function getAllBlogPosts() {
  try {
    console.log('Fetching all blog posts');
    const res = await fetch('/api/blog?action=getAllPosts', {
      cache: 'no-store' // Ensure fresh data
    });
    
    if (!res.ok) {
      console.error(`Failed to fetch blog posts: ${res.status} ${res.statusText}`);
      throw new Error(`Failed to fetch blog posts: ${res.status}`);
    }
    
    const data = await res.json();
    console.log(`Successfully fetched ${data.length} blog posts`);
    return data;
  } catch (error) {
    console.error('Error in getAllBlogPosts:', error);
    throw error;
  }
}

export async function getBlogPostById(id) {
  try {
    console.log(`Fetching blog post by ID: ${id}`);
    const res = await fetch(`/api/blog?action=getPostById&id=${id}`, {
      cache: 'no-store' // Ensure fresh data
    });
    
    if (!res.ok) {
      if (res.status === 404) {
        console.warn(`Blog post with ID ${id} not found`);
        return null;
      }
      console.error(`Error fetching blog post by ID ${id}: ${res.status} ${res.statusText}`);
      throw new Error(`Failed to fetch blog post: ${res.status}`);
    }
    
    const data = await res.json();
    console.log(`Successfully fetched blog post with ID: ${id}`);
    return data;
  } catch (error) {
    console.error(`Error in getBlogPostById(${id}):`, error);
    throw error;
  }
}

export async function getBlogPostBySlug(slug) {
  try {
    console.log(`Fetching blog post by slug: ${slug}`);
    const res = await fetch(`/api/blog?action=getPostBySlug&slug=${slug}`, {
      cache: 'no-store' // Ensure fresh data
    });
    
    if (!res.ok) {
      if (res.status === 404) {
        console.warn(`Blog post with slug ${slug} not found`);
        return null;
      }
      console.error(`Error fetching blog post by slug ${slug}: ${res.status} ${res.statusText}`);
      throw new Error(`Failed to fetch blog post: ${res.status}`);
    }
    
    const data = await res.json();
    console.log(`Successfully fetched blog post with slug: ${slug}`);
    return data;
  } catch (error) {
    console.error(`Error in getBlogPostBySlug(${slug}):`, error);
    throw error;
  }
}

export async function getAllCategories() {
  const res = await fetch('/api/blog?action=getAllCategories');
  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }
  return res.json();
}

export async function getRelatedPosts(currentPostId, category, limit = 3) {
  try {
    console.log(`Fetching related posts for post ID ${currentPostId} in category ${category}`);
    const res = await fetch(`/api/blog?action=getRelatedPosts&id=${currentPostId}&category=${encodeURIComponent(category)}&limit=${limit}`, {
      cache: 'no-store' // Ensure fresh data
    });
    
    if (!res.ok) {
      console.error(`Error fetching related posts: ${res.status} ${res.statusText}`);
      return []; // Return empty array on error
    }
    
    const data = await res.json();
    console.log(`Found ${data.length} related posts`);
    return data;
  } catch (error) {
    console.error('Error in getRelatedPosts:', error);
    return []; // Return empty array on error
  }
}

export async function getPostContentHtml(content) {
  try {
    console.log('Processing markdown content to HTML');
    
    // Process custom elements before sending to server
    const processedContent = processMarkdownCustomElements(content);
    
    // Now send to server for final processing
    const res = await fetch('/api/blog?action=getPostContentHtml', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        content: processedContent,
        processObjections: true 
      }),
    });
    
    if (!res.ok) {
      console.error(`Error converting markdown to HTML: ${res.status} ${res.statusText}`);
      throw new Error('Failed to convert markdown to HTML');
    }
    
    const data = await res.json();
    console.log('Successfully converted markdown to HTML');
    return data.html;
  } catch (error) {
    console.error('Error in getPostContentHtml:', error);
    throw error;
  }
}

// Add function to process numbered headings
function processNumberedHeadings(content) {
  try {
    if (!content || typeof content !== 'string') {
      return content || '';
    }
    
    if (typeof window !== 'undefined') {
      console.log("Processing numbered headings in content");
    }
    
    // Match patterns like: "2. SMS Nurture Sequences" at the start of a line
    // and convert them to proper h2 elements
    const numberedHeadingPattern = /^(\d+)\.\s+(.+)$/gm;
    
    let modifiedContent = content;
    let match;
    let count = 0;
    
    // Process all matches
    while ((match = numberedHeadingPattern.exec(content)) !== null) {
      count++;
      const [fullMatch, number, heading] = match;
      
      if (typeof window !== 'undefined') {
        console.log("Found numbered heading #" + count + ":", number, heading);
      }
      
      // Replace with properly formatted markdown heading
      const replacement = `## ${number}. ${heading}`;
      
      // Replace just this instance
      modifiedContent = modifiedContent.replace(fullMatch, replacement);
    }
    
    if (count > 0 && typeof window !== 'undefined') {
      console.log(`Processed ${count} numbered headings`);
    }
    
    return modifiedContent;
  } catch (error) {
    console.error("Error in processNumberedHeadings:", error);
    // Return original content if processing fails
    return content;
  }
}

// Process custom markdown elements before standard markdown processing
function processMarkdownCustomElements(content) {
  try {
    console.log("Starting custom processing of content");
    
    if (!content || typeof content !== 'string') {
      console.error("Invalid content provided to processMarkdownCustomElements", { type: typeof content });
      return content || ''; // Return as-is or empty string if null/undefined
    }
    
    // Process numbered headings first
    let processedContent = processNumberedHeadings(content);
    
    // Process objections next
    processedContent = processObjections(processedContent);
    
    // Then process scoring rubric
    processedContent = processRubric(processedContent);
    
    console.log("Completed custom processing of content");
    return processedContent;
  } catch (error) {
    console.error("Error in processMarkdownCustomElements:", error);
    // Return original content if processing fails
    return content;
  }
}

// Transform numbered objections into custom HTML
function processObjections(content) {
  try {
    if (!content || typeof content !== 'string') {
      return content || '';
    }
    
    // More flexible pattern that can handle various whitespace and formatting
    // Debug: Log a sample of the content to verify format
    if (typeof window !== 'undefined') {
      console.log("Processing objections in content");
    }
    
    // Look for patterns like:
    // 1. "I'm just looking."
    //    What it really means: They're curious, not committed.
    //    How to flip it: "That's exactly why a quick chat makes sense..."
    
    const objectionPattern = /(\d+)\.\s+\*\*[""]([^""]+)[""]\*\*\s*\n\s*What it really means:\s*([^\n]+)\s*\n\s*How to flip it:\s*[""]([^""]+)[""]/gm;
    
    let modifiedContent = content;
    let match;
    let count = 0;
    
    // Use a loop to process all matches and log them
    while ((match = objectionPattern.exec(content)) !== null) {
      count++;
      const [fullMatch, number, objection, meaning, response] = match;
      
      if (typeof window !== 'undefined') {
        console.log("Found objection #" + count + ":", number, objection);
      }
      
      const replacement = `<div class="numbered-objection">
        <h3>
          <span class="objection-number">${number}.</span>
          <span class="objection-text">"${objection}"</span>
        </h3>
        <div class="objection-meaning">What it really means: ${meaning}</div>
        <div class="objection-response">How to flip it: "${response}"</div>
      </div>`;
      
      // Replace just this instance
      modifiedContent = modifiedContent.replace(fullMatch, replacement);
    }
    
    if (count > 0 && typeof window !== 'undefined') {
      console.log(`Processed ${count} objections`);
    } else if (typeof window !== 'undefined') {
      console.log("No objections found with pattern, trying alternative pattern");
      
      // Try a more lenient alternative pattern
      const altPattern = /(\d+)\.\s+[""*]([^""*]+)[""*][\s\n]+What it really means:([^\n]+)[\s\n]+How to flip it:[""*]([^""*]+)[""*]/gm;
      
      while ((match = altPattern.exec(content)) !== null) {
        count++;
        const [fullMatch, number, objection, meaning, response] = match;
        
        console.log("Found objection (alt pattern) #" + count + ":", number, objection);
        
        const replacement = `<div class="numbered-objection">
          <h3>
            <span class="objection-number">${number}.</span>
            <span class="objection-text">"${objection}"</span>
          </h3>
          <div class="objection-meaning">What it really means: ${meaning}</div>
          <div class="objection-response">How to flip it: "${response}"</div>
        </div>`;
        
        // Replace just this instance
        modifiedContent = modifiedContent.replace(fullMatch, replacement);
      }
      
      console.log(`Processed ${count} objections with alternative pattern`);
    }
    
    return modifiedContent;
  } catch (error) {
    console.error("Error in processObjections:", error);
    // Return original content if processing fails
    return content;
  }
}

// Transform scoring rubric into custom HTML
function processRubric(content) {
  try {
    if (!content || typeof content !== 'string') {
      return content || '';
    }
    
    if (typeof window !== 'undefined') {
      console.log("Processing rubric items in content");
    }
    
    // Match patterns like:
    // - **Homeownership**
    //   0 = Renter
    //   1 = Owns less than 2 years
    //   2 = Confirmed owner (2+ years)
    const rubricPattern = /-\s+\*\*([^*]+)\*\*\s*\n\s*0\s*=\s*([^\n]+)\s*\n\s*1\s*=\s*([^\n]+)\s*\n\s*2\s*=\s*([^\n]+)/g;
    
    let count = 0;
    let modifiedContent = content;
    let match;
    
    // Process all matches
    while ((match = rubricPattern.exec(content)) !== null) {
      count++;
      const [fullMatch, heading, option0, option1, option2] = match;
      
      if (typeof window !== 'undefined') {
        console.log("Found rubric item #" + count + ":", heading);
      }
      
      const replacement = `<div class="scoring-rubric-item">
        <div class="scoring-rubric-heading">${heading}</div>
        <div class="scoring-rubric-option">0 = ${option0}</div>
        <div class="scoring-rubric-option">1 = ${option1}</div>
        <div class="scoring-rubric-option">2 = ${option2}</div>
      </div>`;
      
      // Replace just this instance
      modifiedContent = modifiedContent.replace(fullMatch, replacement);
    }
    
    if (count > 0 && typeof window !== 'undefined') {
      console.log(`Processed ${count} rubric items`);
    }
    
    return modifiedContent;
  } catch (error) {
    console.error("Error in processRubric:", error);
    // Return original content if processing fails
    return content;
  }
} 