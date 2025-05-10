// Helper functions for the blog

// Function to get all blog posts
export async function getAllBlogPosts() {
  try {
    const response = await fetch('/api/blog?action=getAllPosts', {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }
    
    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error('Error fetching all blog posts:', error);
    return [];
  }
}

// Function to get a blog post by ID
export async function getBlogPostById(id: string) {
  try {
    const response = await fetch(`/api/blog?action=getPostById&id=${id}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.status}`);
    }
    
    const post = await response.json();
    return post;
  } catch (error) {
    console.error(`Error fetching blog post with ID ${id}:`, error);
    return null;
  }
}

// Function to convert markdown content to HTML
export async function getPostContentHtml(content: string) {
  try {
    const response = await fetch('/api/blog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to process markdown: ${response.status}`);
    }
    
    const result = await response.json();
    return result.html || '<p>Error processing content</p>';
  } catch (error) {
    console.error('Error processing markdown to HTML:', error);
    return '<p>Error processing content</p>';
  }
}

// Function to get all categories
export async function getAllCategories() {
  try {
    const response = await fetch('/api/blog?action=getAllCategories', {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }
    
    const categories = await response.json();
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Function to get related posts
export async function getRelatedPosts(postId: string, category: string, limit: number = 3) {
  try {
    // Since our API doesn't have a getRelatedPosts action yet, we can emulate it by:
    // 1. Getting all posts
    // 2. Filtering for posts with the same category (but not the same ID)
    // 3. Limiting the number of results
    
    const allPosts = await getAllBlogPosts();
    
    // Filter for posts with the same category but different ID
    const relatedPosts = allPosts
      .filter(post => post.category === category && post.id.toString() !== postId)
      .slice(0, limit);
    
    return relatedPosts;
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
} 