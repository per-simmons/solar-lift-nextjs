# Solar Lift Next.js Website

## Project Overview
This is the Next.js implementation of the Solar Lift marketing website, featuring responsive design for both desktop and mobile views. - Final Version

This project is a conversion of the original Solar Lift website from plain HTML/CSS/JS to a modern Next.js application with Tailwind CSS.

## Project Structure

- `/app` - Contains the Next.js App Router components
  - `layout.tsx` - Root layout component that wraps all pages
  - `page.tsx` - Main homepage component
  - `globals.css` - Global styles including Tailwind CSS utilities
- `/public` - Static assets including images and other resources
  - `/assets` - Contains all the original website assets

## Features

- **Modern React Components**: Converted all HTML elements to React components
- **Next.js App Router**: Using the latest Next.js features
- **Tailwind CSS**: Styled using utility classes for a responsive design
- **Interactive Carousel**: Implemented the case studies carousel using React hooks
- **Responsive Navigation**: Mobile-friendly navigation with hamburger menu
- **Smooth Scrolling**: Implemented smooth scrolling for anchor links
- **Mobile-Optimized Case Studies**: Refined mobile layout with exact card dimensions (326x214px for case studies, 158x100px for metrics)

## How to Run

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Implementation Details

### HTML to React Conversion
- Replaced HTML elements with React components
- Converted `<a>` tags to Next.js `<Link>` components where appropriate
- Used Next.js `<Image>` component for optimized image loading

### JavaScript to React Hooks
- Implemented mobile menu toggle using `useState`
- Converted scroll event listeners to React `useEffect`
- Implemented carousel functionality with React state
- Created custom hooks for FAQ accordion functionality

### CSS to Tailwind
- Converted custom CSS to Tailwind utility classes
- Preserved the original styling and responsive behavior
- Extended Tailwind theme with custom colors and styles

### Carousel Implementation
- Implemented the case studies carousel using React state
- Added navigation buttons for next/previous slides
- Preserved the original carousel styling and functionality
