const fs = require('fs');
const path = require('path');

// Read the blog listing page file
const blogPagePath = path.join(__dirname, 'app', 'blog', 'page.tsx');
let blogPageContent = fs.readFileSync(blogPagePath, 'utf8');

// Delete the first blog post (id: 1) and update the array
const blogPostsStartIndex = blogPageContent.indexOf('const blogPosts = [');
const firstPostEndIndex = blogPageContent.indexOf('id: 2,');
const firstPostStartIndex = blogPageContent.indexOf('{', blogPostsStartIndex);

if (blogPostsStartIndex !== -1 && firstPostStartIndex !== -1 && firstPostEndIndex !== -1) {
  // Construct new content without the first post
  const newContent = 
    blogPageContent.substring(0, blogPostsStartIndex) + 
    'const blogPosts = [' +
    blogPageContent.substring(firstPostEndIndex - 8); // -8 to handle the spacing and commas
  
  // Fix any potential syntax issues after removal
  let fixedContent = newContent.replace(/,\s*,/g, ',');
  
  // Update IDs to be sequential
  let idCounter = 1;
  fixedContent = fixedContent.replace(/id: \d+/g, (match) => {
    return `id: ${idCounter++}`;
  });
  
  // Write back to file
  fs.writeFileSync(blogPagePath, fixedContent);
  console.log('Successfully deleted the blog post from the listing page');
} else {
  console.error('Could not find the blog post in the listing page');
}

// Now do the same for the blog post detail page
const blogPostPagePath = path.join(__dirname, 'app', 'blog', '[id]', 'page.tsx');
let blogPostPageContent = fs.readFileSync(blogPostPagePath, 'utf8');

// Delete the first blog post (id: 1) and update the array
const blogPostDetailStartIndex = blogPostPageContent.indexOf('const blogPosts = [');
const firstDetailPostEndIndex = blogPostPageContent.indexOf('id: 2,');
const firstDetailPostStartIndex = blogPostPageContent.indexOf('{', blogPostDetailStartIndex);

if (blogPostDetailStartIndex !== -1 && firstDetailPostStartIndex !== -1 && firstDetailPostEndIndex !== -1) {
  // Construct new content without the first post
  const newDetailContent = 
    blogPostPageContent.substring(0, blogPostDetailStartIndex) + 
    'const blogPosts = [' +
    blogPostPageContent.substring(firstDetailPostEndIndex - 8); // -8 to handle the spacing and commas
  
  // Fix any potential syntax issues after removal
  let fixedDetailContent = newDetailContent.replace(/,\s*,/g, ',');
  
  // Update IDs to be sequential
  let idDetailCounter = 1;
  fixedDetailContent = fixedDetailContent.replace(/id: \d+/g, (match) => {
    return `id: ${idDetailCounter++}`;
  });
  
  // Write back to file
  fs.writeFileSync(blogPostPagePath, fixedDetailContent);
  console.log('Successfully deleted the blog post from the detail page');
} else {
  console.error('Could not find the blog post in the detail page');
}

console.log('Blog post "How to Qualify Solar Leads: A Complete Guide" has been completely deleted.'); 