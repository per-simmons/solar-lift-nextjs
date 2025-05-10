const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const yaml = require('js-yaml');

// Configure marked options
marked.setOptions({
  headerIds: true,
  mangle: false,
  breaks: true
});

// Read the markdown file
console.log('Reading markdown file...');
const markdownFilePath = path.join(__dirname, 'app', 'blog', 'articles', 'qualify-solar-leads-article-new.md');
const markdownContent = fs.readFileSync(markdownFilePath, 'utf8');

// Extract frontmatter and content
console.log('Processing markdown content...');
const frontmatterMatch = markdownContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
const frontmatterText = frontmatterMatch[1];
const markdownBody = frontmatterMatch[2];

// Parse frontmatter
const frontmatter = yaml.load(frontmatterText);

// Convert markdown to HTML
const htmlContent = marked(markdownBody);
console.log('Markdown converted to HTML');

// Update the blog post detail page
console.log('Updating blog post detail page...');
const blogPostPagePath = path.join(__dirname, 'app', 'blog', '[id]', 'page.tsx');
let blogPostPageContent = fs.readFileSync(blogPostPagePath, 'utf8');

// Find the first blog post and prepare its replacement
console.log('Finding first blog post in detail page...');
const postRegex = /({\s*id:\s*1,\s*title:.*?content:\s*`)([\s\S]*?)(`\s*,\s*category:\s*"[^"]*"\s*,\s*date:\s*"[^"]*"\s*,\s*readTime:\s*"[^"]*"\s*,\s*imageUrl:\s*"[^"]*"\s*,\s*author:\s*"[^"]*"\s*,\s*authorRole:\s*"[^"]*"\s*,\s*authorImageUrl:\s*"[^"]*")/g;

// Create the replacement blog post
const newBlogPost = `{
    id: 1,
    title: "${frontmatter.title}",
    excerpt: "${frontmatter.excerpt}",
    content: \`
      ${htmlContent}
    \`,
    category: "${frontmatter.category}",
    date: "${frontmatter.date}",
    readTime: "${frontmatter.readTime}",
    imageUrl: "/assets/blog/how-to-qualify-solar-leads.jpg",
    author: "${frontmatter.author}",
    authorRole: "${frontmatter.authorRole}",
    authorImageUrl: "/assets/blog/authors/solar-lift-headshot-pat-simmons.png"
  }`;

// Replace the first blog post in the array
let updatedDetailPageContent = blogPostPageContent.replace(
  /{\s*id:\s*1,[\s\S]*?authorImageUrl:\s*"[^"]*"\s*}/,
  newBlogPost
);

// Write the updated content to the file
fs.writeFileSync(blogPostPagePath, updatedDetailPageContent);
console.log('Blog post detail page updated');

// Update the blog listing page
console.log('Updating blog listing page...');
const blogListingPagePath = path.join(__dirname, 'app', 'blog', 'page.tsx');
let blogListingPageContent = fs.readFileSync(blogListingPagePath, 'utf8');

// Create the replacement blog post listing entry
const listingEntry = `{
    id: 1,
    title: "${frontmatter.title}",
    excerpt: "${frontmatter.excerpt}",
    category: "${frontmatter.category}",
    date: "${frontmatter.date}",
    readTime: "${frontmatter.readTime}",
    imageUrl: "/assets/blog/how-to-qualify-solar-leads.jpg",
    featured: true,
    author: "${frontmatter.author}",
    authorRole: "${frontmatter.authorRole}",
    authorImageUrl: "/assets/blog/authors/solar-lift-headshot-pat-simmons.png"
  }`;

// Replace the first blog post in the listing
let updatedListingPageContent = blogListingPageContent.replace(
  /{\s*id:\s*1,[\s\S]*?featured:\s*true(?:,[\s\S]*?authorImageUrl:\s*"[^"]*")?[^}]*}/,
  listingEntry
);

// Write the updated content to the file
fs.writeFileSync(blogListingPagePath, updatedListingPageContent);
console.log('Blog listing page updated');

console.log('Blog post updated successfully!');
console.log('Please restart the server to see the changes.'); 