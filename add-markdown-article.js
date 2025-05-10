const fs = require('fs');
const path = require('path');

// Read the markdown file directly
const markdownContent = `---
title: "How to Qualify Solar Leads: A Complete Guide"
excerpt: "Learn the essential steps and best practices for qualifying solar leads to maximize your conversion rates and grow your solar business."
category: "Solar Installation"
date: "May 19, 2024"
readTime: "12 min"
imageUrl: "/assets/blog/how-to-qualify-solar-leads.jpg"
author: "Pat Simmons"
authorRole: "Solar Investment Specialist"
authorImageUrl: "/assets/blog/authors/solar-lift-headshot-pat-simmons.png"
featured: true
---

Qualifying solar leads effectively is crucial for the success of your solar installation business. In this comprehensive guide, we'll explore the key steps and best practices for identifying and nurturing high-quality leads that are most likely to convert into successful solar installations.

## Understanding Solar Lead Qualification

Solar lead qualification is the process of evaluating potential customers to determine their likelihood of purchasing a solar system. This involves assessing various factors such as:

- Homeownership status
- Roof condition and suitability
- Energy consumption patterns
- Financial readiness
- Timeline for installation

## Key Qualification Criteria

When qualifying solar leads, focus on these essential criteria:

- **Homeownership:** Verify that the lead owns their property and has the authority to make installation decisions
- **Roof Assessment:** Evaluate roof age, condition, and orientation for solar panel installation
- **Energy Usage:** Review current electricity consumption and potential savings
- **Financial Qualification:** Assess credit score and ability to finance the installation
- **Timeline:** Determine the lead's urgency and installation timeline

## Best Practices for Lead Qualification

Implement these best practices to improve your lead qualification process:

- Use a standardized qualification checklist
- Conduct thorough initial consultations
- Leverage technology for lead scoring
- Maintain detailed communication records
- Follow up promptly with qualified leads

## Common Qualification Mistakes to Avoid

Be aware of these common pitfalls in solar lead qualification:

- Focusing too much on price alone
- Neglecting to verify homeownership
- Overlooking roof condition assessment
- Failing to document qualification criteria
- Not following up consistently

## Conclusion

Effective solar lead qualification is a critical component of your business success. By implementing a thorough qualification process and following best practices, you can improve your conversion rates and build a more efficient sales pipeline. Remember to continuously refine your qualification criteria based on your results and market feedback.`;

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

console.log('Using the exact markdown frontmatter:', frontmatter);

// Convert markdown content to HTML for the blog post page
function markdownToHtml(markdown) {
  // Convert headers - specifically look for markdown ## headers
  let html = markdown.replace(/## (.*?)$/gm, '<h2>$1</h2>');
  
  // Convert paragraphs - groups of text that aren't lists or headers
  const paragraphs = markdown.split(/\n\n+/);
  let processedHtml = '';
  
  for (const paragraph of paragraphs) {
    // Skip headers (already converted)
    if (paragraph.trim().startsWith('## ')) {
      continue;
    }
    
    // Skip list items (will be handled separately)
    if (paragraph.trim().match(/^- /m)) {
      // Process list items
      const listItems = paragraph.trim().split(/\n- /);
      let listHtml = '<ul>';
      
      listItems.forEach((item, index) => {
        if (index === 0 && !item.startsWith('- ')) {
          // This might be the paragraph before the list
          if (!item.trim().endsWith(':')) {
            processedHtml += `<p>${item.trim()}</p>`;
          } else {
            processedHtml += `<p>${item.trim()}</p>`;
          }
        } else {
          // This is a list item
          const cleanItem = index === 0 ? item.replace(/^- /, '') : item;
          if (cleanItem.trim()) {
            // Handle bold text within list items
            const processedItem = cleanItem.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            listHtml += `<li>${processedItem}</li>`;
          }
        }
      });
      
      listHtml += '</ul>';
      processedHtml += listHtml;
    } else if (paragraph.trim()) {
      // Regular paragraph with bold formatting
      const processedParagraph = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      processedHtml += `<p>${processedParagraph}</p>`;
    }
  }
  
  return processedHtml;
}

// Create HTML content from markdown
const htmlContent = markdownToHtml(contentText);

console.log('Generated HTML content for blog post');

// ===================== UPDATE BLOG LISTING PAGE =====================

// Read and update the blog listing page (app/blog/page.tsx)
const blogPagePath = path.join(__dirname, 'app', 'blog', 'page.tsx');
let blogPageContent = fs.readFileSync(blogPagePath, 'utf8');

// Delete existing blog posts array and replace with new content
const blogPostsArrayStart = blogPageContent.indexOf('const blogPosts = [');
const blogPostsArrayEnd = blogPageContent.indexOf(']', blogPostsArrayStart);

if (blogPostsArrayStart !== -1 && blogPostsArrayEnd !== -1) {
  const newBlogPostsArray = `const blogPosts = [
  {
    id: 1,
    title: ${JSON.stringify(frontmatter.title)},
    excerpt: ${JSON.stringify(frontmatter.excerpt)},
    category: ${JSON.stringify(frontmatter.category)},
    date: ${JSON.stringify(frontmatter.date)},
    readTime: ${JSON.stringify(frontmatter.readTime)},
    imageUrl: ${JSON.stringify(frontmatter.imageUrl)},
    featured: true
  },
  {
    id: 2,
    title: "How Solar Panels Increase Home Value: A 2025 Analysis",
    excerpt: "Discover how installing solar panels can significantly boost your property value and provide long-term financial benefits beyond energy savings.",
    category: "Solar Investment",
    date: "May 9, 2025",
    readTime: "10 min",
    imageUrl: "/assets/dummy-images/blog-post-1-dummy.png",
    featured: true
  },
  {
    id: 3,
    title: "Solar Tax Credits: What Homeowners Need to Know in 2025",
    excerpt: "A comprehensive guide to federal, state, and local solar incentives that can help reduce your installation costs by up to 50%.",
    category: "Solar Incentives",
    date: "April 28, 2025",
    readTime: "13 min",
    imageUrl: "/assets/dummy-images/blog-post-2-dummy.png",
    featured: false
  },
  {
    id: 4,
    title: "The Latest Advancements in Solar Panel Technology",
    excerpt: "Explore cutting-edge developments in solar technology that are making installations more efficient and affordable than ever before.",
    category: "Solar Technology",
    date: "April 15, 2025",
    readTime: "11 min",
    imageUrl: "/assets/dummy-images/blog-post-3-dummy.png",
    featured: false
  },
  {
    id: 5,
    title: "How to Choose the Right Solar Installer for Your Home",
    excerpt: "Learn the key factors to consider when selecting a solar installation company to ensure quality, reliability, and long-term satisfaction.",
    category: "Solar Installation",
    date: "March 30, 2025",
    readTime: "14 min",
    imageUrl: "/assets/dummy-images/blog-post-4-dummy.png",
    featured: false
  }
]`;

  blogPageContent = blogPageContent.substring(0, blogPostsArrayStart) + 
                    newBlogPostsArray + 
                    blogPageContent.substring(blogPostsArrayEnd + 1);

  fs.writeFileSync(blogPagePath, blogPageContent);
  console.log('Successfully updated blog listing page with new content');
} else {
  console.error('Could not find blogPosts array in the blog page');
}

// ===================== UPDATE BLOG POST DETAIL PAGE =====================

// Read and update the blog post detail page (app/blog/[id]/page.tsx)
const blogPostPagePath = path.join(__dirname, 'app', 'blog', '[id]', 'page.tsx');
let blogPostPageContent = fs.readFileSync(blogPostPagePath, 'utf8');

// Delete existing blog posts array and replace with new content
const blogPostDetailArrayStart = blogPostPageContent.indexOf('const blogPosts = [');
const blogPostDetailArrayEnd = blogPostPageContent.indexOf(']', blogPostDetailArrayStart);

if (blogPostDetailArrayStart !== -1 && blogPostDetailArrayEnd !== -1) {
  const newBlogPostDetailArray = `const blogPosts = [
  {
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
  },
  {
    id: 2,
    title: "Solar Tax Credits: What Homeowners Need to Know in 2025",
    excerpt: "A comprehensive guide to federal, state, and local solar incentives that can help reduce your installation costs by up to 50%.",
    content: \`
      <p>Solar energy has become more accessible than ever, thanks to various tax credits and incentives available to homeowners. Understanding these financial benefits is crucial for maximizing your return on investment when going solar.</p>
      
      <h2>Federal Solar Investment Tax Credit (ITC)</h2>
      
      <p>The federal solar tax credit, also known as the Investment Tax Credit (ITC), allows you to deduct a percentage of your solar system costs from your federal taxes. As of 2025, the ITC offers a 30% credit for residential solar installations.</p>
      
      <p>For example, if your solar system costs $20,000, you could receive a $6,000 tax credit. This is a dollar-for-dollar reduction in the income taxes you would otherwise pay to the federal government.</p>
      
      <h2>State-Level Incentives</h2>
      
      <p>Beyond federal incentives, many states offer additional tax credits, rebates, and other financial incentives for solar installations. These vary widely by location but can significantly reduce your overall costs.</p>
      
      <p>Some of the most generous state programs include:</p>
      
      <ul>
        <li><strong>California:</strong> The Self-Generation Incentive Program (SGIP) provides rebates for energy storage systems paired with solar</li>
        <li><strong>New York:</strong> NY-Sun program offers direct incentives based on system size and location</li>
        <li><strong>Massachusetts:</strong> SMART program provides production-based incentives for solar energy generation</li>
        <li><strong>Illinois:</strong> Adjustable Block Program offers Solar Renewable Energy Credits (SRECs) for solar production</li>
      </ul>
      
      <h2>Local Incentives and Property Tax Exemptions</h2>
      
      <p>Many local governments and utilities offer additional incentives:</p>
      
      <ul>
        <li>Property tax exemptions for the added value of solar systems</li>
        <li>Sales tax exemptions on solar equipment purchases</li>
        <li>Performance-based incentives that pay you for the electricity your system generates</li>
        <li>Low-interest solar loans and financing programs</li>
      </ul>
      
      <h2>How to Claim Your Solar Tax Credits</h2>
      
      <p>To claim the federal solar tax credit, you'll need to:</p>
      
      <ol>
        <li>Confirm your eligibility (you must own the system, not lease it)</li>
        <li>Complete IRS Form 5695 with your tax return</li>
        <li>Calculate your credit amount based on qualified solar expenses</li>
        <li>Carry over any unused credit to future tax years if necessary</li>
      </ol>
      
      <p>For state and local incentives, application processes vary. Work with your solar installer to identify and apply for all available programs in your area.</p>
    \`,
    category: "Solar Incentives",
    date: "April 28, 2025",
    readTime: "13 min",
    imageUrl: "/assets/dummy-images/blog-post-2-dummy.png",
    author: "Pat Simmons",
    authorRole: "Solar Investment Specialist",
    authorImageUrl: "/assets/blog/authors/solar-lift-headshot-pat-simmons.png"
  },
  {
    id: 3,
    title: "The Latest Advancements in Solar Panel Technology",
    excerpt: "Explore cutting-edge developments in solar technology that are making installations more efficient and affordable than ever before.",
    content: \`
      <p>The solar industry continues to evolve at a rapid pace, with new technological breakthroughs making solar energy more efficient, affordable, and accessible. Here's a look at the latest innovations that are transforming the solar landscape.</p>
      
      <h2>Bifacial Solar Panels</h2>
      
      <p>Bifacial solar panels can capture sunlight from both sides, increasing energy production by 5-30% compared to traditional monofacial panels. These panels are particularly effective when installed over reflective surfaces like white roofs or light-colored ground covers.</p>
      
      <p>The technology works by allowing sunlight to pass through the panel and reflect off the surface below, where it's captured by the rear side of the panel. This design maximizes energy harvest throughout the day and performs especially well in snowy conditions.</p>
      
      <h2>Perovskite Solar Cells</h2>
      
      <p>Perovskite solar cells represent one of the most exciting developments in solar technology. These cells use a synthetic material with a special crystal structure that can be manufactured at low temperatures using relatively simple processes.</p>
      
      <p>Key advantages include:</p>
      
      <ul>
        <li>Higher theoretical efficiency limits than silicon</li>
        <li>Lower production costs and energy requirements</li>
        <li>Flexibility and potential for transparent applications</li>
        <li>Ability to be combined with silicon in tandem cells for even higher efficiencies</li>
      </ul>
      
      <p>While durability remains a challenge, researchers have made significant progress, with some perovskite cells now demonstrating stability for thousands of hours under real-world conditions.</p>
      
      <h2>Integrated Solar Roofing</h2>
      
      <p>Building-integrated photovoltaics (BIPV) are evolving beyond simple solar shingles to full solar roofing systems that replace conventional roofing materials entirely. These systems serve dual purposes as both weatherproof roofing and power generation.</p>
      
      <p>The latest BIPV products offer:</p>
      
      <ul>
        <li>Seamless integration with traditional roofing aesthetics</li>
        <li>Improved durability and weather resistance</li>
        <li>Simplified installation processes</li>
        <li>Better value proposition through combined roofing and energy benefits</li>
      </ul>
      
      <h2>AI-Powered Solar Management</h2>
      
      <p>Artificial intelligence is revolutionizing how solar systems operate, with smart inverters and energy management systems that continuously optimize performance based on weather forecasts, energy usage patterns, and grid conditions.</p>
      
      <p>These intelligent systems can:</p>
      
      <ul>
        <li>Predict solar production and automatically adjust home energy usage</li>
        <li>Identify potential system issues before they cause significant problems</li>
        <li>Optimize battery charging and discharging for maximum financial benefit</li>
        <li>Participate in grid services and virtual power plants for additional revenue</li>
      </ul>
      
      <p>As these technologies continue to mature and scale, solar energy will become an increasingly dominant and reliable part of our energy landscape.</p>
    \`,
    category: "Solar Technology",
    date: "April 15, 2025",
    readTime: "11 min",
    imageUrl: "/assets/dummy-images/blog-post-3-dummy.png",
    author: "Pat Simmons",
    authorRole: "Solar Investment Specialist",
    authorImageUrl: "/assets/blog/authors/solar-lift-headshot-pat-simmons.png"
  },
  {
    id: 4,
    title: "How to Choose the Right Solar Installer for Your Home",
    excerpt: "Learn the key factors to consider when selecting a solar installation company to ensure quality, reliability, and long-term satisfaction.",
    content: \`
      <p>Investing in solar power is a significant decision that can benefit your home and finances for decades. However, the quality of your installation plays a crucial role in determining how well your system performs. Here's how to choose the right solar installer for your needs.</p>
      
      <h2>Verify Credentials and Experience</h2>
      
      <p>When evaluating potential solar installers, start by checking their credentials:</p>
      
      <ul>
        <li><strong>NABCEP Certification:</strong> The North American Board of Certified Energy Practitioners certification is the gold standard in the solar industry</li>
        <li><strong>State licensing:</strong> Ensure the company has proper electrical and contractor licenses for your state</li>
        <li><strong>Insurance coverage:</strong> Verify they carry adequate liability and worker's compensation insurance</li>
        <li><strong>Years in business:</strong> Companies with a longer track record tend to have more installation experience and are more likely to be around to honor warranties</li>
      </ul>
      
      <h2>Evaluate Their Proposal Process</h2>
      
      <p>A thorough proposal process indicates a professional installer who will design a system that meets your specific needs:</p>
      
      <ul>
        <li>They should conduct a detailed site assessment, including roof condition and shading analysis</li>
        <li>The proposal should include realistic production estimates based on your location and roof orientation</li>
        <li>They should explain different equipment options and their benefits/drawbacks</li>
        <li>Financial projections should be reasonable and based on your actual electricity usage</li>
      </ul>
      
      <h2>Compare Equipment and Warranties</h2>
      
      <p>The quality of equipment and warranties offered can significantly impact your system's long-term performance:</p>
      
      <ul>
        <li><strong>Solar panels:</strong> Look for tier-one manufacturers with 25+ year production warranties</li>
        <li><strong>Inverters:</strong> These typically have shorter warranties (10-25 years) but are critical components</li>
        <li><strong>Workmanship warranty:</strong> The installer should provide at least a 10-year warranty on their installation work</li>
        <li><strong>Performance guarantee:</strong> Some installers offer guarantees that your system will produce a minimum amount of electricity</li>
      </ul>
      
      <h2>Check Reviews and References</h2>
      
      <p>Research the company's reputation through multiple channels:</p>
      
      <ul>
        <li>Read reviews on multiple platforms (Google, Yelp, BBB, Solar Reviews)</li>
        <li>Ask for references from customers with similar systems to what you're considering</li>
        <li>Look for reviews that mention post-installation support and service</li>
        <li>Check if there are complaints filed with consumer protection agencies</li>
      </ul>
      
      <h2>Consider Long-Term Service and Support</h2>
      
      <p>Your relationship with your installer doesn't end when the system is activated:</p>
      
      <ul>
        <li>Ask about their monitoring capabilities and how system issues are identified and resolved</li>
        <li>Understand their service response times and processes</li>
        <li>Confirm who handles warranty claims if equipment fails</li>
        <li>Inquire about maintenance recommendations and services offered</li>
      </ul>
      
      <p>By thoroughly vetting potential solar installers using these criteria, you'll be well-positioned to choose a company that will deliver a high-quality system and stand behind their work for years to come.</p>
    \`,
    category: "Solar Installation",
    date: "March 30, 2025",
    readTime: "14 min",
    imageUrl: "/assets/dummy-images/blog-post-4-dummy.png",
    author: "Pat Simmons",
    authorRole: "Solar Investment Specialist",
    authorImageUrl: "/assets/blog/authors/solar-lift-headshot-pat-simmons.png"
  }
]`;

  blogPostPageContent = blogPostPageContent.substring(0, blogPostDetailArrayStart) + 
                        newBlogPostDetailArray + 
                        blogPostPageContent.substring(blogPostDetailArrayEnd + 1);

  fs.writeFileSync(blogPostPagePath, blogPostPageContent);
  console.log('Successfully updated blog post detail page with new content');
} else {
  console.error('Could not find blogPosts array in the blog post page');
}

console.log('Blog post now successfully added with the EXACT markdown content from the file.'); 