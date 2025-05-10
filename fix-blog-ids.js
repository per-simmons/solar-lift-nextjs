const fs = require('fs');
const path = require('path');

// Fix blog list page
console.log('Fixing blog post IDs...');

// Update the blog listing page
const blogPagePath = path.join(__dirname, 'app', 'blog', 'page.tsx');
let blogPageContent = fs.readFileSync(blogPagePath, 'utf8');

// Fix the IDs in the blog posts array
let updatedBlogPageContent = blogPageContent;
const blogPostsMatch = updatedBlogPageContent.match(/const blogPosts = \[\s*{[\s\S]*?\}\s*\]/);

if (blogPostsMatch) {
  const blogPostsArray = blogPostsMatch[0];
  let idCounter = 1;
  
  // Replace all IDs with sequential numbers
  const updatedBlogPostsArray = blogPostsArray.replace(/id: \d+/g, (match) => {
    return `id: ${idCounter++}`;
  });
  
  updatedBlogPageContent = updatedBlogPageContent.replace(blogPostsArray, updatedBlogPostsArray);
  fs.writeFileSync(blogPagePath, updatedBlogPageContent);
  console.log('Fixed blog listing page IDs');
} else {
  console.error('Could not find blog posts array in listing page');
}

// Update the blog post detail page
const blogPostPagePath = path.join(__dirname, 'app', 'blog', '[id]', 'page.tsx');
let blogPostPageContent = fs.readFileSync(blogPostPagePath, 'utf8');

// Fix the IDs in the blog posts array
let updatedBlogPostPageContent = blogPostPageContent;
const blogPostDetailMatch = updatedBlogPostPageContent.match(/const blogPosts = \[\s*{[\s\S]*?\}\s*\]/);

if (blogPostDetailMatch) {
  const blogPostDetailArray = blogPostDetailMatch[0];
  let idCounter = 1;
  
  // Replace all IDs with sequential numbers
  const updatedBlogPostDetailArray = blogPostDetailArray.replace(/id: \d+/g, (match) => {
    return `id: ${idCounter++}`;
  });
  
  updatedBlogPostPageContent = updatedBlogPostPageContent.replace(blogPostDetailArray, updatedBlogPostDetailArray);
  fs.writeFileSync(blogPostPagePath, updatedBlogPostPageContent);
  console.log('Fixed blog post detail page IDs');
} else {
  console.error('Could not find blog posts array in detail page');
}

console.log('Blog post IDs have been fixed. Please restart the server.'); 