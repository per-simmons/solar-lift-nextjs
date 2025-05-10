// Helper functions for the blog

// Function to get all blog posts
export async function getAllBlogPosts() {
  try {
    console.log('getAllBlogPosts: Fetching blogs from API...');
    const response = await fetch('/api/blog?action=getAllPosts', {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.error(`getAllBlogPosts: Failed to fetch posts: ${response.status}`);
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }
    
    const posts = await response.json();
    console.log(`getAllBlogPosts: Successfully fetched ${posts.length} posts`);
    return posts;
  } catch (error) {
    console.error('getAllBlogPosts: Error fetching all blog posts:', error);
    return [];
  }
}

// Function to get a blog post by ID
export async function getBlogPostById(id: string) {
  try {
    console.log(`getBlogPostById: Fetching blog post with ID ${id}...`);
    const response = await fetch(`/api/blog?action=getPostById&id=${id}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.error(`getBlogPostById: Failed to fetch post: ${response.status}`);
      throw new Error(`Failed to fetch post: ${response.status}`);
    }
    
    const post = await response.json();
    console.log(`getBlogPostById: Successfully fetched post with ID ${id}`);
    return post;
  } catch (error) {
    console.error(`getBlogPostById: Error fetching blog post with ID ${id}:`, error);
    return null;
  }
}

// Function to convert markdown content to HTML
export async function getPostContentHtml(content: string) {
  try {
    console.log('getPostContentHtml: Converting markdown to HTML...');
    const response = await fetch('/api/blog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    
    if (!response.ok) {
      console.error(`getPostContentHtml: Failed to process markdown: ${response.status}`);
      throw new Error(`Failed to process markdown: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('getPostContentHtml: Successfully converted markdown to HTML');
    return result.html || '<p>Error processing content</p>';
  } catch (error) {
    console.error('getPostContentHtml: Error processing markdown to HTML:', error);
    return '<p>Error processing content</p>';
  }
}

// Function to get all categories
export async function getAllCategories() {
  try {
    console.log('getAllCategories: Fetching categories from API...');
    const response = await fetch('/api/blog?action=getAllCategories', {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.error(`getAllCategories: Failed to fetch categories: ${response.status}`);
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }
    
    const categories = await response.json();
    console.log(`getAllCategories: Successfully fetched ${categories.length} categories`);
    return categories;
  } catch (error) {
    console.error('getAllCategories: Error fetching categories:', error);
    return [];
  }
}

// Function to get related posts
export async function getRelatedPosts(postId: string, category: string, limit: number = 3) {
  try {
    console.log(`getRelatedPosts: Finding related posts for post ID ${postId} in category "${category}"...`);
    // Since our API doesn't have a getRelatedPosts action yet, we can emulate it by:
    // 1. Getting all posts
    // 2. Filtering for posts with the same category (but not the same ID)
    // 3. Limiting the number of results
    
    const allPosts = await getAllBlogPosts();
    
    // Filter for posts with the same category but different ID
    const relatedPosts = allPosts
      .filter(post => post.category === category && post.id.toString() !== postId)
      .slice(0, limit);
    
    console.log(`getRelatedPosts: Found ${relatedPosts.length} related posts`);
    return relatedPosts;
  } catch (error) {
    console.error('getRelatedPosts: Error fetching related posts:', error);
    return [];
  }
} 