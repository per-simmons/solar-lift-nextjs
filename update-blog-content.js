const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// Read the markdown file
console.log('Reading markdown file...');
const markdownFilePath = path.join(__dirname, 'app', 'blog', 'articles', 'qualify-solar-leads-article-new.md');
const markdownContent = fs.readFileSync(markdownFilePath, 'utf8');

// Extract frontmatter and content
console.log('Processing markdown content...');
const frontmatterMatch = markdownContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
const frontmatterText = frontmatterMatch[1];
const markdownBody = frontmatterMatch[2];

// Convert markdown to HTML
const htmlContent = marked(markdownBody);

// Read blog post page
console.log('Reading blog post page...');
const blogPostPagePath = path.join(__dirname, 'app', 'blog', '[id]', 'page.tsx');
let blogPostPageContent = fs.readFileSync(blogPostPagePath, 'utf8');

// Find the blog post with ID 1 and update its content
console.log('Updating blog post content...');
const blogPostRegex = /({\s*id:\s*1,\s*title:.*?content:\s*`)([\s\S]*?)(`\s*,\s*category)/g;
const updatedBlogPostContent = blogPostPageContent.replace(blogPostRegex, (match, before, oldContent, after) => {
  return `${before}\n      ${htmlContent}\n    ${after}`;
});

// Write the updated content back to the file
console.log('Writing updated content to file...');
fs.writeFileSync(blogPostPagePath, updatedBlogPostContent);

console.log('Blog post content updated successfully!');
console.log('Please restart the server to see the changes.'); 