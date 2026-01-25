# Legacy Projects Mock Data

This document preserves the mock project data that was previously hardcoded in the frontend components before the API integration.

## Source: ProjectsPreview.tsx (3 Featured Projects)

### Project 1: E-Commerce Platform
- **id:** '1'
- **title:** E-Commerce Platform
- **slug:** e-commerce-platform
- **description:** A full-featured e-commerce platform with real-time inventory management, payment processing, and admin dashboard.
- **image_url:** https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=60
- **tech_stack:** Laravel, React, PostgreSQL, Redis, Stripe

### Project 2: AI Content Generator
- **id:** '2'
- **title:** AI Content Generator
- **slug:** ai-content-generator
- **description:** An AI-powered content generation tool that helps marketers create engaging copy for various platforms.
- **image_url:** https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60
- **tech_stack:** Next.js, OpenAI, TypeScript, Tailwind

### Project 3: Task Management System
- **id:** '3'
- **title:** Task Management System
- **slug:** task-management-system
- **description:** A collaborative task management application with real-time updates and team workspaces.
- **image_url:** https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&auto=format&fit=crop&q=60
- **tech_stack:** Vue.js, Laravel, WebSockets, MySQL

---

## Source: ProjectsListPage.tsx (6 Projects)

### Project 1: E-Commerce Platform
- **id:** '1'
- **title:** E-Commerce Platform
- **slug:** e-commerce-platform
- **description:** A full-featured e-commerce platform with real-time inventory management, payment processing, and admin dashboard.
- **image_url:** https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=60
- **tech_stack:** Laravel, React, PostgreSQL, Redis, Stripe

### Project 2: AI Content Generator
- **id:** '2'
- **title:** AI Content Generator
- **slug:** ai-content-generator
- **description:** An AI-powered content generation tool that helps marketers create engaging copy for various platforms.
- **image_url:** https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60
- **tech_stack:** Next.js, OpenAI, TypeScript, Tailwind

### Project 3: Task Management System
- **id:** '3'
- **title:** Task Management System
- **slug:** task-management-system
- **description:** A collaborative task management application with real-time updates and team workspaces.
- **image_url:** https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&auto=format&fit=crop&q=60
- **tech_stack:** Vue.js, Laravel, WebSockets, MySQL

### Project 4: Analytics Dashboard
- **id:** '4'
- **title:** Analytics Dashboard
- **slug:** analytics-dashboard
- **description:** A comprehensive analytics dashboard for tracking business metrics and generating reports.
- **image_url:** https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60
- **tech_stack:** React, D3.js, Node.js, MongoDB

### Project 5: Social Media Scheduler
- **id:** '5'
- **title:** Social Media Scheduler
- **slug:** social-media-scheduler
- **description:** A tool for scheduling and managing social media posts across multiple platforms.
- **image_url:** https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=60
- **tech_stack:** Laravel, Vue.js, Redis, PostgreSQL

### Project 6: Real Estate Platform
- **id:** '6'
- **title:** Real Estate Platform
- **slug:** real-estate-platform
- **description:** A property listing and management platform with virtual tours and appointment scheduling.
- **image_url:** https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=60
- **tech_stack:** React, Laravel, AWS, PostgreSQL

---

## Source: ProjectDetailPage.tsx (3 Projects with Extended Details)

### Project 1: E-Commerce Platform (Full Details)
- **id:** '1'
- **title:** E-Commerce Platform
- **slug:** e-commerce-platform
- **description:** A full-featured e-commerce platform with real-time inventory management, payment processing, and admin dashboard.
- **image_url:** https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=60
- **project_url:** https://example.com
- **github_url:** https://github.com/Nicholasbell03
- **tech_stack:** Laravel, React, PostgreSQL, Redis, Stripe, Elasticsearch
- **long_description:**
```
This e-commerce platform was built to handle high-traffic online stores with complex inventory requirements.

Key Features:
- Real-time inventory synchronization across multiple warehouses
- Integrated payment processing with Stripe and PayPal
- Advanced admin dashboard with sales analytics
- Multi-currency and multi-language support
- Automated email marketing integration

The architecture uses Laravel for the backend API, React for the frontend, and Redis for caching and real-time updates. PostgreSQL handles the relational data while Elasticsearch powers the product search functionality.

Performance optimizations include lazy loading, image optimization, and CDN integration, resulting in sub-second page loads even under heavy traffic.
```

### Project 2: AI Content Generator (Full Details)
- **id:** '2'
- **title:** AI Content Generator
- **slug:** ai-content-generator
- **description:** An AI-powered content generation tool that helps marketers create engaging copy for various platforms.
- **image_url:** https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60
- **project_url:** https://example.com
- **github_url:** null
- **tech_stack:** Next.js, OpenAI, TypeScript, Tailwind, Prisma
- **long_description:**
```
An intelligent content generation platform that leverages OpenAI's GPT models to help marketers create compelling copy.

Key Features:
- Multiple content templates (blog posts, social media, ads, emails)
- Brand voice customization and tone adjustment
- SEO optimization suggestions
- Content history and version control
- Team collaboration features

The application uses Next.js for server-side rendering and optimal SEO, with a custom prompt engineering system that ensures consistent, high-quality outputs tailored to each user's brand guidelines.
```

### Project 3: Task Management System (Full Details)
- **id:** '3'
- **title:** Task Management System
- **slug:** task-management-system
- **description:** A collaborative task management application with real-time updates and team workspaces.
- **image_url:** https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&auto=format&fit=crop&q=60
- **project_url:** null
- **github_url:** https://github.com/Nicholasbell03
- **tech_stack:** Vue.js, Laravel, WebSockets, MySQL, Redis
- **long_description:**
```
A modern task management solution designed for remote teams that need real-time collaboration.

Key Features:
- Kanban boards with drag-and-drop functionality
- Real-time updates using WebSockets
- Team workspaces with role-based permissions
- Time tracking and reporting
- Integration with Slack and email

Built with Vue.js for a reactive frontend experience and Laravel for a robust backend API. WebSockets provide instant updates across all connected clients, ensuring team members always see the latest changes.
```

---

## Field Mapping Notes (Old vs New API)

| Old Field (Mock) | New Field (API) |
|------------------|-----------------|
| id (string)      | id (number)     |
| image_url        | featured_image  |
| tech_stack       | technologies    |
| long_description | long_description |
| project_url      | project_url     |
| github_url       | github_url      |
