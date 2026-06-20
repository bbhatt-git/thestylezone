# Sanity CMS Setup Guide

## Overview
Sanity CMS is now integrated for content management only (NOT for products). Products continue to be managed through WooCommerce.

## What You Can Edit with Sanity
- Hero carousel slides (homepage hero section)
- Privacy Policy content
- Terms of Service content
- About Us content
- Contact page content

## Setup Instructions

### 1. Create Sanity Project
1. Go to [sanity.io](https://www.sanity.io) and sign up/login
2. Create a new project
3. Choose "Blank" template
4. Copy your Project ID

### 2. Configure Environment Variables
Add these to your `.env` file:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
```

### 3. Initialize Sanity Studio
Run this command in your project root:
```bash
npx sanity init
```
- Select "Create new project"
- Use existing project (enter your Project ID)
- Select "production" dataset
- Choose "Yes" for TypeScript
- Choose "No" for Clean project
- Select the schema path: `sanity/schemas`

### 4. Start Sanity Studio
```bash
npx sanity start
```
This will open the Sanity Studio at `http://localhost:3333`

## How to Edit Content

### Hero Slides
1. Open Sanity Studio
2. Click "Hero Slide" in the left sidebar
3. Click "New hero slide"
4. Fill in:
   - **Headline**: The main text (use \n for line breaks)
   - **CTA Button Text**: Button text (e.g., "Shop the Collection")
   - **CTA Link**: Button destination (e.g., "/shop")
   - **Background Image URL**: Full image URL
   - **Overlay Opacity**: Number between 0-1 (0.45 is default)
   - **Display Order**: Number to control slide order (0, 1, 2, etc.)

### Page Content (Privacy, Terms, About, Contact)
1. Open Sanity Studio
2. Click "Page Content" in the left sidebar
3. Click "New page content"
4. Fill in:
   - **Page Type**: Select from dropdown (Privacy Policy, Terms of Service, About Us, Contact)
   - **Page Title**: The heading for the page
   - **Page Content**: Rich text content (use the editor toolbar for formatting)
   - **SEO Description**: Meta description for search engines

## Content Fallback
If Sanity is not configured or content is not available, the pages will automatically fall back to the hardcoded content, so your site will always work.

## Notes
- Products are NOT managed in Sanity - use WooCommerce for product management
- Content changes in Sanity appear immediately on your site
- All content pages have fallback to hardcoded content
- Hero carousel will use default slides if no Sanity content is available
