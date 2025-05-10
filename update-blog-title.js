const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Read the markdown file
console.log('Reading markdown file...');
const markdownFilePath = path.join(__dirname, 'app', 'blog', 'articles', 'qualify-solar-leads-article-new.md');
const markdownContent = fs.readFileSync(markdownFilePath, 'utf8');

// Extract frontmatter
console.log('Extracting frontmatter...');
const frontmatterMatch = markdownContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
const frontmatterText = frontmatterMatch[1];

// Parse frontmatter
const frontmatter = yaml.load(frontmatterText);

// Update the blog post detail page
console.log('Updating blog post detail page...');
const blogPostPagePath = path.join(__dirname, 'app', 'blog', '[id]', 'page.tsx');
let blogPostPageContent = fs.readFileSync(blogPostPagePath, 'utf8');

// Update the metadata for blog post with ID 1
let updatedBlogPostPageContent = blogPostPageContent.replace(
  /({\s*id:\s*1,\s*title:\s*")([^"]+)("(?:,|\s)*excerpt:\s*")([^"]+)("(?:,|\s)*content)/g,
  (match, before, oldTitle, middle, oldExcerpt, after) => {
    return `${before}${frontmatter.title}${middle}${frontmatter.excerpt}${after}`;
  }
);

// Update the category, date, readTime, author, and authorRole
updatedBlogPostPageContent = updatedBlogPostPageContent.replace(
  /(category:\s*")([^"]+)("(?:,|\s)*date:\s*")([^"]+)("(?:,|\s)*readTime:\s*")([^"]+)("(?:,|\s)*imageUrl[^,]+,[^"]+author:\s*")([^"]+)("(?:,|\s)*authorRole:\s*")([^"]+)(")/g,
  (match, catBefore, oldCategory, dateBefore, oldDate, rtBefore, oldReadTime, authorBefore, oldAuthor, roleBefore, oldRole, after) => {
    return `${catBefore}${frontmatter.category}${dateBefore}${frontmatter.date}${rtBefore}${frontmatter.readTime}${authorBefore}${frontmatter.author}${roleBefore}${frontmatter.authorRole}${after}`;
  }
);

// Write the updated content back to the file
fs.writeFileSync(blogPostPagePath, updatedBlogPostPageContent);

// Update the blog listing page
console.log('Updating blog listing page...');
const blogListingPagePath = path.join(__dirname, 'app', 'blog', 'page.tsx');
let blogListingPageContent = fs.readFileSync(blogListingPagePath, 'utf8');

// Update the metadata for blog post with ID 1
let updatedBlogListingPageContent = blogListingPageContent.replace(
  /({\s*id:\s*1,\s*title:\s*")([^"]+)("(?:,|\s)*excerpt:\s*")([^"]+)("(?:,|\s)*category:\s*")([^"]+)("(?:,|\s)*date:\s*")([^"]+)("(?:,|\s)*readTime:\s*")([^"]+)("(?:,|\s)*imageUrl[^,]+,[^"]+author:\s*")([^"]+)("(?:,|\s)*authorRole:\s*")([^"]+)(")/g,
  (match, idTitle, oldTitle, excerptBefore, oldExcerpt, catBefore, oldCategory, dateBefore, oldDate, rtBefore, oldReadTime, authorBefore, oldAuthor, roleBefore, oldRole, after) => {
    return `${idTitle}${frontmatter.title}${excerptBefore}${frontmatter.excerpt}${catBefore}${frontmatter.category}${dateBefore}${frontmatter.date}${rtBefore}${frontmatter.readTime}${authorBefore}${frontmatter.author}${roleBefore}${frontmatter.authorRole}${after}`;
  }
);

// Write the updated content back to the file
fs.writeFileSync(blogListingPagePath, updatedBlogListingPageContent);

console.log('Blog post metadata updated successfully!');
console.log('Please restart the server to see the changes.'); 