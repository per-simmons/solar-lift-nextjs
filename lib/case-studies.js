// Client-side adapter for accessing case studies data
// This file is imported by client components and doesn't use Node.js modules

/**
 * Fetch all case studies from the API
 */
export async function getAllCaseStudies() {
  console.log('Fetching all case studies from API');
  try {
    const response = await fetch('/api/case-studies?action=getAllCaseStudies');
    
    if (!response.ok) {
      console.error('Error fetching case studies:', response.status, response.statusText);
      const errorData = await response.text();
      console.error('Error response:', errorData);
      return [];
    }
    
    const data = await response.json();
    console.log(`Fetched ${data.length} case studies from API`);
    return data;
  } catch (error) {
    console.error('Error fetching case studies:', error);
    return [];
  }
}

/**
 * Fetch a specific case study by ID
 */
export async function getCaseStudyById(id) {
  console.log(`Fetching case study ID ${id} from API`);
  try {
    const response = await fetch(`/api/case-studies?action=getCaseStudyById&id=${id}`);
    
    if (!response.ok) {
      console.error(`Error fetching case study ${id}:`, response.status, response.statusText);
      const errorData = await response.text();
      console.error('Error response:', errorData);
      return null;
    }
    
    const data = await response.json();
    console.log(`Successfully fetched case study ID ${id} from API`);
    return data;
  } catch (error) {
    console.error(`Error fetching case study ${id}:`, error);
    return null;
  }
}

/**
 * Convert markdown content to HTML
 */
export async function getCaseStudyContentHtml(content) {
  console.log('Converting markdown content to HTML via API');
  try {
    // We encode the content for safe transmission via URL
    const encodedContent = encodeURIComponent(content);
    
    // For small content, we can use GET with query parameters
    if (encodedContent.length < 1500) {
      const response = await fetch(`/api/case-studies?action=getContentHtml&content=${encodedContent}`);
      
      if (!response.ok) {
        console.error('Error converting markdown to HTML (GET):', response.status, response.statusText);
        return content; // Return the original content as fallback
      }
      
      const result = await response.json();
      return result.html;
    }
    
    // For larger content, we need to use POST
    const response = await fetch('/api/case-studies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'getContentHtml',
        content,
      }),
    });
    
    if (!response.ok) {
      console.error('Error converting markdown to HTML (POST):', response.status, response.statusText);
      return content; // Return the original content as fallback
    }
    
    const result = await response.json();
    return result.html;
  } catch (error) {
    console.error('Error converting markdown to HTML:', error);
    return content; // Return the original content as fallback
  }
} 