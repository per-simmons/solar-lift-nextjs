const fs = require('fs');
const path = require('path');

// Read the markdown file directly 
const markdownPath = path.join(__dirname, 'app', 'blog', 'articles', 'qualify-solar-leads-article.md');
const markdownContent = fs.readFileSync(markdownPath, 'utf8');

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

console.log('Using exact frontmatter from markdown file:');
console.log(frontmatter);

// Convert markdown content to HTML
function markdownToHtml(markdown) {
  // Convert headings (## Heading)
  let html = markdown.replace(/## (.*?)\n/g, '<h2>$1</h2>\n');
  
  // Handle regular paragraphs
  const paragraphs = html.split('\n\n');
  let processedHtml = '';
  
  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i].trim();
    
    // Skip empty paragraphs
    if (paragraph === '') continue;
    
    // Skip headings (already processed)
    if (paragraph.startsWith('<h2>')) {
      processedHtml += paragraph + '\n\n';
      continue;
    }
    
    // Handle lists
    if (paragraph.includes('\n- ')) {
      // List paragraph
      const listLines = paragraph.split('\n');
      const introText = listLines[0].endsWith(':') ? 
        '<p>' + listLines[0] + '</p>\n<ul>' : 
        '<ul>';
      
      let listHtml = introText;
      
      for (let j = 0; j < listLines.length; j++) {
        const line = listLines[j].trim();
        if (line.startsWith('- ')) {
          // Process bold text within list items
          let itemContent = line.substring(2);
          itemContent = itemContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          listHtml += '\n  <li>' + itemContent + '</li>';
        }
      }
      
      listHtml += '\n</ul>';
      processedHtml += listHtml + '\n\n';
    } else {
      // Regular paragraph with bold formatting
      const processedParagraph = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      processedHtml += '<p>' + processedParagraph + '</p>\n\n';
    }
  }
  
  return processedHtml.trim();
}

const htmlContent = markdownToHtml(contentText);
console.log('Converted markdown to HTML.');

// ============= UPDATE BLOG PAGE ============= 
const blogPagePath = path.join(__dirname, 'app', 'blog', 'page.tsx');
let blogPageContent = fs.readFileSync(blogPagePath, 'utf8');

// Define the new blog post
const newBlogPost = `  {
    id: 1,
    title: ${JSON.stringify(frontmatter.title)},
    excerpt: ${JSON.stringify(frontmatter.excerpt)},
    category: ${JSON.stringify(frontmatter.category)},
    date: ${JSON.stringify(frontmatter.date)},
    readTime: ${JSON.stringify(frontmatter.readTime)},
    imageUrl: ${JSON.stringify(frontmatter.imageUrl)},
    featured: true
  },`;

// Insert the new blog post
const blogPostsStartIndex = blogPageContent.indexOf('const blogPosts = [');
const insertionIndex = blogPostsStartIndex + 'const blogPosts = ['.length;

if (blogPostsStartIndex !== -1) {
  // Insert new blog post at the beginning of the array
  blogPageContent = 
    blogPageContent.substring(0, insertionIndex) + 
    '\n' + newBlogPost + 
    blogPageContent.substring(insertionIndex);
  
  fs.writeFileSync(blogPagePath, blogPageContent);
  console.log('Successfully added the blog post to the listing page');
} else {
  console.error('Could not find blogPosts array in the blog page');
}

// ============= UPDATE BLOG POST DETAIL PAGE =============
const blogPostPagePath = path.join(__dirname, 'app', 'blog', '[id]', 'page.tsx');
let blogPostPageContent = fs.readFileSync(blogPostPagePath, 'utf8');

// Define the new blog post detail
const newBlogPostDetail = `  {
    id: 1,
    title: ${JSON.stringify(frontmatter.title)},
    excerpt: ${JSON.stringify(frontmatter.excerpt)},
    content: \`
      ${htmlContent}
    \`,
    category: ${JSON.stringify(frontmatter.category)},
    date: ${JSON.stringify(frontmatter.date)},
    readTime: ${JSON.stringify(frontmatter.readTime)},
    imageUrl: ${JSON.stringify(frontmatter.imageUrl)},
    author: ${JSON.stringify(frontmatter.author)},
    authorRole: ${JSON.stringify(frontmatter.authorRole)},
    authorImageUrl: ${JSON.stringify(frontmatter.authorImageUrl)}
  },`;

// Insert the new blog post detail
const blogPostDetailStartIndex = blogPostPageContent.indexOf('const blogPosts = [');
const detailInsertionIndex = blogPostDetailStartIndex + 'const blogPosts = ['.length;

if (blogPostDetailStartIndex !== -1) {
  // Insert new blog post at the beginning of the array
  blogPostPageContent = 
    blogPostPageContent.substring(0, detailInsertionIndex) + 
    '\n' + newBlogPostDetail + 
    blogPostPageContent.substring(detailInsertionIndex);
  
  fs.writeFileSync(blogPostPagePath, blogPostPageContent);
  console.log('Successfully added the blog post to the detail page');
} else {
  console.error('Could not find blogPosts array in the blog post page');
}

// Fix IDs to be sequential in both files
function fixSequentialIds(fileContent) {
  const blogPostsStart = fileContent.indexOf('const blogPosts = [');
  const blogPostsEnd = fileContent.indexOf(']', blogPostsStart);
  const blogPostsSection = fileContent.substring(blogPostsStart, blogPostsEnd);
  
  // Extract all IDs
  const idRegex = /id: (\d+)/g;
  let match;
  const ids = [];
  while ((match = idRegex.exec(blogPostsSection)) !== null) {
    ids.push(parseInt(match[1]));
  }
  
  // Sort IDs
  ids.sort((a, b) => a - b);
  
  // Replace with sequential IDs
  let idCounter = 1;
  let updatedContent = fileContent;
  for (const id of ids) {
    updatedContent = updatedContent.replace(
      new RegExp(`id: ${id},`, 'g'), 
      `id: ${idCounter++},`
    );
  }
  
  return updatedContent;
}

// Fix IDs in both files
const fixedBlogPageContent = fixSequentialIds(blogPageContent);
fs.writeFileSync(blogPagePath, fixedBlogPageContent);

const fixedBlogPostPageContent = fixSequentialIds(blogPostPageContent);
fs.writeFileSync(blogPostPagePath, fixedBlogPostPageContent);

console.log('Successfully added the article "How to Qualify Solar Leads: A Complete Guide" to the blog.'); 