// Client-side utilities for fetching blog data from the API

export async function getAllBlogPosts() {
  const res = await fetch('/api/blog?action=getAllPosts');
  if (!res.ok) {
    throw new Error('Failed to fetch blog posts');
  }
  return res.json();
}

export async function getBlogPostById(id) {
  const res = await fetch(`/api/blog?action=getPostById&id=${id}`);
  if (!res.ok) {
    return null;
  }
  return res.json();
}

export async function getBlogPostBySlug(slug) {
  const res = await fetch(`/api/blog?action=getPostBySlug&slug=${slug}`);
  if (!res.ok) {
    return null;
  }
  return res.json();
}

export async function getAllCategories() {
  const res = await fetch('/api/blog?action=getAllCategories');
  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }
  return res.json();
}

export async function getRelatedPosts(currentPostId, category, limit = 3) {
  const res = await fetch(`/api/blog?action=getRelatedPosts&id=${currentPostId}&category=${encodeURIComponent(category)}&limit=${limit}`);
  if (!res.ok) {
    return [];
  }
  return res.json();
}

export async function getPostContentHtml(content) {
  // For this one, we'll need to send the content in the request body
  // Process client-side to avoid unnecessary server trips
  let processedContent = content;
  
  // Process custom elements before sending to server
  processedContent = processMarkdownCustomElements(processedContent);
  
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
    throw new Error('Failed to convert markdown to HTML');
  }
  
  const data = await res.json();
  return data.html;
}

// Process custom markdown elements before standard markdown processing
function processMarkdownCustomElements(content) {
  console.log("Starting custom processing of content");
  
  // Process objections first
  content = processObjections(content);
  
  // Then process scoring rubric
  content = processRubric(content);
  
  return content;
}

// Transform numbered objections into custom HTML
function processObjections(content) {
  // More flexible pattern that can handle various whitespace and formatting
  // Debug: Log a sample of the content to verify format
  if (typeof window !== 'undefined') {
    console.log("Content sample for debugging:", content.substring(0, 500));
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
}

// Transform scoring rubric into custom HTML
function processRubric(content) {
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
} 