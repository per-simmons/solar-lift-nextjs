const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Directory containing the blog post markdown files
const articlesDirectory = path.join(process.cwd(), 'app/blog/articles');

// Read all markdown files in the articles directory
const fileNames = fs.readdirSync(articlesDirectory);
const mdFiles = fileNames.filter(fileName => fileName.endsWith('.md'));

console.log(`Found ${mdFiles.length} markdown files to update`);

// Update each file
mdFiles.forEach(fileName => {
  const filePath = path.join(articlesDirectory, fileName);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  // Parse the markdown frontmatter
  const { data, content } = matter(fileContent);
  
  // Check if author is "Solar Lift Team"
  if (data.author === 'Solar Lift Team') {
    console.log(`Updating author in ${fileName}`);
    
    // Update the author and authorRole
    data.author = 'Pat Simmons';
    data.authorRole = 'Founder';
    
    // Stringify the updated frontmatter and content
    const updatedContent = matter.stringify(content, data);
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, updatedContent);
    console.log(`✅ Updated ${fileName}`);
  } else {
    console.log(`Skipping ${fileName} (already has author: ${data.author})`);
  }
});

console.log('Author update complete!'); 