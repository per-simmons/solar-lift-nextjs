const fs = require('fs');
const path = require('path');

// Read the markdown file
const markdownFilePath = path.join(__dirname, 'app', 'blog', 'articles', 'qualify-solar-leads-article.md');
const markdownContent = fs.readFileSync(markdownFilePath, 'utf8');

// Parse the frontmatter
const frontmatterRegex = /---\n([\s\S]*?)\n---\n/;
const match = markdownContent.match(frontmatterRegex);
const frontmatterText = match ? match[1] : '';
const contentText = markdownContent.replace(frontmatterRegex, '');

// Parse the frontmatter into an object
const frontmatter = {};
frontmatterText.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split(':');
  if (key && valueParts.length) {
    const value = valueParts.join(':').trim();
    frontmatter[key.trim()] = value.replace(/^"(.*)"$/, '$1'); // Remove quotes if present
  }
});

console.log('Parsed frontmatter:', frontmatter);

// Update the blog/page.tsx file
const blogPagePath = path.join(__dirname, 'app', 'blog', 'page.tsx');
let blogPageContent = fs.readFileSync(blogPagePath, 'utf8');

// Create the blog post entry for the listing page
const blogPostListingEntry = `
  {
    id: 1,
    title: "${frontmatter.title}",
    excerpt: "${frontmatter.excerpt}",
    category: "${frontmatter.category}",
    date: "${frontmatter.date}",
    readTime: "${frontmatter.readTime}",
    imageUrl: "${frontmatter.imageUrl}",
    featured: ${frontmatter.featured || 'true'}
  },`;

// Replace the first blog post or add it at the beginning of the array
const blogPostsArrayRegex = /const blogPosts = \[\s*{/;
blogPageContent = blogPageContent.replace(blogPostsArrayRegex, 'const blogPosts = [\n' + blogPostListingEntry.trim() + '\n  {');

// Write the updated content back to the file
fs.writeFileSync(blogPagePath, blogPageContent);
console.log('Updated blog/page.tsx with new blog post entry');

// Update the blog/[id]/page.tsx file
const blogPostPagePath = path.join(__dirname, 'app', 'blog', '[id]', 'page.tsx');
let blogPostPageContent = fs.readFileSync(blogPostPagePath, 'utf8');

// Convert markdown content to HTML (basic conversion)
function markdownToHtml(markdown) {
  // Convert headers
  let html = markdown.replace(/## (.*)/g, '<h2>$1</h2>');
  
  // Convert paragraphs
  html = html.replace(/(?:^|\n)(?!\s*[-*+]|\s*\d+\.)([^\n]+)(?:\n|$)/g, '<p>$1</p>');
  
  // Convert bullet lists
  const listItemRegex = /- (.*)/g;
  let listMatch;
  let listItems = [];
  
  while ((listMatch = listItemRegex.exec(html)) !== null) {
    listItems.push('<li>' + listMatch[1] + '</li>');
  }
  
  if (listItems.length > 0) {
    const listItemsStr = listItems.join('\n    ');
    html = html.replace(/- .*(\n- .*)*/g, '<ul>\n    ' + listItemsStr + '\n  </ul>');
  }
  
  // Convert bold text
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  return html;
}

// Create HTML content from markdown
const htmlContent = markdownToHtml(contentText);

// Create the blog post entry for the individual post page
const blogPostDetailEntry = `
  {
    id: 1,
    title: "${frontmatter.title}",
    excerpt: "${frontmatter.excerpt}",
    content: \`
      ${htmlContent}
    \`,
    category: "${frontmatter.category}",
    date: "${frontmatter.date}",
    readTime: "${frontmatter.readTime}",
    imageUrl: "${frontmatter.imageUrl}",
    author: "${frontmatter.author}",
    authorRole: "${frontmatter.authorRole}",
    authorImageUrl: "${frontmatter.authorImageUrl}"
  },`;

// Replace the first blog post or add it at the beginning of the array
const blogPostsDetailArrayRegex = /const blogPosts = \[\s*{/;
blogPostPageContent = blogPostPageContent.replace(blogPostsDetailArrayRegex, 'const blogPosts = [\n' + blogPostDetailEntry.trim() + '\n  {');

// Write the updated content back to the file
fs.writeFileSync(blogPostPagePath, blogPostPageContent);
console.log('Updated blog/[id]/page.tsx with new blog post entry');

console.log('Blog post added successfully!'); 