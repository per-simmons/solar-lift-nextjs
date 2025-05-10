const fs = require('fs');
const path = require('path');

// Fix blog/page.tsx
const blogPagePath = path.join(__dirname, 'app', 'blog', 'page.tsx');
let blogPageContent = fs.readFileSync(blogPagePath, 'utf8');

// Remove duplicate entry
const duplicateEntryRegex = /const blogPosts = \[\s*{\s*id: 1,[\s\S]*?featured: true\s*},\s*{\s*id: 1,/;
blogPageContent = blogPageContent.replace(duplicateEntryRegex, 'const blogPosts = [\n  {\n    id: 1,');

// Update IDs to be sequential
let idCounter = 1;
blogPageContent = blogPageContent.replace(/id: \d+/g, (match) => {
  return `id: ${idCounter++}`;
});

// Write the updated content back to the file
fs.writeFileSync(blogPagePath, blogPageContent);
console.log('Fixed blog/page.tsx - removed duplicate entry and fixed IDs');

// Fix blog/[id]/page.tsx
const blogPostPagePath = path.join(__dirname, 'app', 'blog', '[id]', 'page.tsx');
let blogPostPageContent = fs.readFileSync(blogPostPagePath, 'utf8');

// Remove duplicate entry
const duplicatePostEntryRegex = /const blogPosts = \[\s*{\s*id: 1,[\s\S]*?authorImageUrl: "[\s\S]*?"\s*},\s*{\s*id: 1,/;
blogPostPageContent = blogPostPageContent.replace(duplicatePostEntryRegex, 'const blogPosts = [\n  {\n    id: 1,');

// Update IDs to be sequential
idCounter = 1;
blogPostPageContent = blogPostPageContent.replace(/id: \d+/g, (match) => {
  return `id: ${idCounter++}`;
});

// Write the updated content back to the file
fs.writeFileSync(blogPostPagePath, blogPostPageContent);
console.log('Fixed blog/[id]/page.tsx - removed duplicate entry and fixed IDs');

console.log('Blog posts fixed successfully!'); 