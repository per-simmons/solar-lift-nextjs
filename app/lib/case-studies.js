'use server';

import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

// Get all case studies
export async function getAllCaseStudies() {
  // The base directory containing all case study folders
  const baseDir = path.join(process.cwd(), 'app/case-studies/assets');
  
  // Get all case study directories (they follow the pattern case-study-X-name)
  const caseFolders = fs.readdirSync(baseDir)
    .filter(folder => folder.startsWith('case-study-'));
  
  const allCaseStudies = caseFolders.map(folder => {
    // Get the case study ID from the folder name (e.g., "1" from "case-study-1-wbe")
    const id = folder.split('-')[2];
    
    // Find the markdown file in this folder
    const folderPath = path.join(baseDir, folder);
    const files = fs.readdirSync(folderPath);
    const mdFile = files.find(file => file.endsWith('.md'));
    
    if (!mdFile) {
      console.error(`No markdown file found in ${folder}`);
      return null;
    }
    
    // Read markdown file content
    const fullPath = path.join(folderPath, mdFile);
    const fileContent = fs.readFileSync(fullPath, 'utf8');
    
    // Extract metadata from the markdown file
    const { metrics, category, market, headquarters, companySize, content } = parseMarkdownMetadata(fileContent);
    
    // Extract title from the first h1 heading
    const titleMatch = content.match(/# (.+)$/m);
    const title = titleMatch ? titleMatch[1] : folder;
    
    // Extract excerpt from the first paragraph after the title
    const excerptMatch = content.match(/# .+\n\n(.+?)(?=\n\n|$)/s);
    const excerpt = excerptMatch ? excerptMatch[1] : '';
    
    // Determine client name from folder name
    const folderNameParts = folder.split('-');
    folderNameParts.shift(); // Remove "case"
    folderNameParts.shift(); // Remove "study"
    folderNameParts.shift(); // Remove the number
    const clientName = folderNameParts.join(' ').toUpperCase();
    
    // Find the logo and header image files
    const logoFile = files.find(file => file.includes('logo'));
    const headerImageFile = files.find(file => file.includes('installation') || file.includes('header'));
    
    // FIXED: Construct image paths to point to the public/assets directory
    const logoUrl = logoFile ? `/assets/case-study-${id}-${folderNameParts.join('-')}/${logoFile}` : null;
    const imageUrl = headerImageFile ? `/assets/case-study-${id}-${folderNameParts.join('-')}/${headerImageFile}` : null;
    
    // Determine client type from metadata
    const clientType = market === 'Residential' ? 'Residential' : 
                      market === 'Commercial' ? 'Commercial' : 
                      market.includes('&') ? 'Residential & Commercial' : 'Commercial';
    
    // Format metrics into the expected stats array format
    const metricLines = metrics.split('\n').filter(line => line.trim());
    const stats = metricLines.map(line => {
      const match = line.match(/\*\*Metric \d+:\*\* (.+)/);
      if (!match) return null;
      
      const fullText = match[1].trim();
      const valueMatch = fullText.match(/(\d+%|\d+\.\d+x|\d+x)/);
      
      if (valueMatch) {
        const value = valueMatch[1]; // e.g. "243%" -> "243%"
        const label = fullText.replace(value, '').trim(); // e.g. "243% increase in qualified leads" -> "increase in qualified leads"
        return { label, value };
      }
      
      // If no percentage/multiplier found, look for other number formats
      const altValueMatch = fullText.match(/^(\d+)\s+/);
      if (altValueMatch) {
        const value = altValueMatch[1]; // e.g. "68 reduction" -> "68"
        const label = fullText.replace(value, '').trim(); // e.g. "68 reduction in cost per lead" -> "reduction in cost per lead"
        return { label, value };
      }
      
      // Fallback if no clear number format found
      return { label: fullText, value: "N/A" };
    }).filter(stat => stat !== null);
    
    // Return the full case study object
    return {
      id: parseInt(id),
      clientName,
      clientType,
      title,
      excerpt,
      category,
      location: headquarters ? headquarters.split(',')[0] : '', // Extract city from headquarters
      companySize,
      readTime: '5 min',
      publishDate: 'May 1, 2024',
      content,
      stats,
      imageUrl,
      logoUrl,
    };
  }).filter(caseStudy => caseStudy !== null);
  
  // Sort by ID
  return allCaseStudies.sort((a, b) => a.id - b.id);
}

// Get a specific case study by ID
export async function getCaseStudyById(id) {
  const caseStudies = await getAllCaseStudies();
  return caseStudies.find(caseStudy => caseStudy.id === parseInt(id)) || null;
}

// IMPROVED: Parse the custom metadata format using a more robust regex approach
function parseMarkdownMetadata(fileContent) {
  // More robust regex approach
  const metadataSection = fileContent.match(/^\*\*Metric 1:\*\*[\s\S]*?\*\*Company Size:\*\*.*?(?=\n\n#)/m)?.[0] || '';
  
  const metrics = metadataSection.match(/\*\*Metric \d+:\*\*.*?(?=\*\*Category:\*\*)/s)?.[0]?.trim() || '';
  const category = metadataSection.match(/\*\*Category:\*\*\s*(.*?)(?=\n\*\*)/)?.[1]?.trim() || '';
  const market = metadataSection.match(/\*\*Market:\*\*\s*(.*?)(?=\n\*\*)/)?.[1]?.trim() || '';
  const headquarters = metadataSection.match(/\*\*Headquarters:\*\*\s*(.*?)(?=\n\*\*)/)?.[1]?.trim() || '';
  const companySize = metadataSection.match(/\*\*Company Size:\*\*\s*(.*?)(?=\n|$)/)?.[1]?.trim() || '';
  
  // Extract content after the metadata
  const contentWithoutMetadata = fileContent.replace(/^\*\*Metric 1:\*\*[\s\S]*?\*\*Company Size:\*\*.*?\n\n/m, '');
  
  return {
    metrics,
    category,
    market,
    headquarters,
    companySize,
    content: contentWithoutMetadata
  };
}

// Convert markdown content to HTML
export async function getCaseStudyContentHtml(content) {
  const result = await remark()
    .use(html, { sanitize: false })
    .use(remarkGfm)
    .process(content);
  
  return result.toString();
} 