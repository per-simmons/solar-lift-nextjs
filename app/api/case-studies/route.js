import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';
import { NextResponse } from 'next/server';

// Get all case studies
async function getAllCaseStudies() {
  try {
    // The base directory containing all case study folders - FIXED PATH
    const baseDir = path.join(process.cwd(), 'app/case-studies/assets');
    
    // Check if directory exists
    if (!fs.existsSync(baseDir)) {
      console.error(`Base directory does not exist: ${baseDir}`);
      return [];
    }
    
    // Get all case study directories (they follow the pattern case-study-X-name)
    const allFolders = fs.readdirSync(baseDir);
    console.log('Found folders:', allFolders);
    
    const caseFolders = allFolders.filter(folder => folder.startsWith('case-study-'));
    console.log('Case study folders:', caseFolders);
    
    if (caseFolders.length === 0) {
      console.error('No case study folders found');
      return [];
    }
    
    const allCaseStudies = caseFolders.map(folder => {
      try {
        // Get the case study ID from the folder name (e.g., "1" from "case-study-1-wbe")
        const id = folder.split('-')[2];
        
        // Find the markdown file in this folder
        const folderPath = path.join(baseDir, folder);
        const files = fs.readdirSync(folderPath);
        console.log(`Files in ${folder}:`, files);
        
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
        
        // FIXED: Construct image paths - update to use paths that are accessible from the frontend
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
      } catch (folderError) {
        console.error(`Error processing folder ${folder}:`, folderError);
        return null;
      }
    }).filter(caseStudy => caseStudy !== null);
    
    // Sort by ID
    return allCaseStudies.sort((a, b) => a.id - b.id);
  } catch (error) {
    console.error('Error in getAllCaseStudies:', error);
    return [];
  }
}

// Get a specific case study by ID
async function getCaseStudyById(id) {
  const caseStudies = await getAllCaseStudies();
  return caseStudies.find(caseStudy => caseStudy.id === parseInt(id)) || null;
}

// IMPROVED: Parse the custom metadata format with a more robust regex approach
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
async function getContentHtml(content) {
  const result = await remark()
    .use(html, { sanitize: false })
    .use(remarkGfm)
    .process(content);
  
  return result.toString();
}

// API route handler for GET requests
export async function GET(request) {
  try {
    console.log('API Request URL:', request.url);
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const id = searchParams.get('id');
    const content = searchParams.get('content');
    
    console.log('API Request - Action:', action, 'ID:', id);

    // Get all case studies
    if (action === 'getAllCaseStudies') {
      console.log('Processing getAllCaseStudies request');
      const caseStudies = await getAllCaseStudies();
      console.log(`Found ${caseStudies.length} case studies`);
      return NextResponse.json(caseStudies);
    }
    
    // Get case study by ID
    if (action === 'getCaseStudyById' && id) {
      console.log(`Processing getCaseStudyById request for ID: ${id}`);
      const parsedId = parseInt(id);
      
      if (isNaN(parsedId)) {
        console.error(`Invalid ID format: ${id}`);
        return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
      }
      
      const caseStudy = await getCaseStudyById(parsedId);
      
      if (!caseStudy) {
        console.error(`Case study not found for ID: ${parsedId}`);
        return NextResponse.json({ error: 'Case study not found' }, { status: 404 });
      }
      
      console.log(`Found case study for ID ${parsedId}: ${caseStudy.title}`);
      return NextResponse.json(caseStudy);
    }
    
    // Get HTML content
    if (action === 'getContentHtml' && content) {
      console.log('Processing getContentHtml request');
      const decodedContent = decodeURIComponent(content);
      const htmlContent = await getContentHtml(decodedContent);
      return NextResponse.json({ html: htmlContent });
    }
    
    // Default: unknown action
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

// API route handler for POST requests
export async function POST(request) {
  try {
    const body = await request.json();
    const { action, content } = body;
    
    // Convert markdown content to HTML
    if (action === 'getContentHtml' && content) {
      console.log('Processing POST getContentHtml request');
      const htmlContent = await getContentHtml(content);
      return NextResponse.json({ html: htmlContent });
    }
    
    // Default: unknown action
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
} 