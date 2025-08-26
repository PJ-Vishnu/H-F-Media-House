# **App Name**: H&F Media House CMS

## Core Features:

- Section Navigation: Admin panel sidebar navigation for managing Hero, Gallery, About, Services, Portfolio, Testimonials, Contact, and Footer sections.
- Content Editing Forms: Form-based content editing for all sections, with text fields/text areas used for content input.
- Media Uploads: Support for image and video uploads within the content editing forms, utilizing Multer to store files in section-specific folders within the public/uploads directory, with proper naming conventions.
- Drag and Drop Reordering: Drag-and-drop interface for reordering gallery images and portfolio items, ensuring content arrangement mirrors the design's visual hierarchy.
- Confirmation Modals: Confirmation modals for delete actions to prevent accidental data loss, enhancing user experience with a safety net.
- Always-Visible Save/Publish Buttons: Persistent Save/Publish buttons within the admin panel interface, enabling constant control over content deployment and updates.
- MongoDB Integration: Implementation of MongoDB for data storage, aligning with the project requirements for database management.
- API Endpoints: Creation of REST API endpoints (/api/hero, /api/gallery, /api/about, /api/services, /api/portfolio, /api/testimonials, /api/contact, /api/footer) to manage content, supporting GET, POST, PUT, DELETE, and REORDER operations as specified.
- Admin Panel Security: Implementation of JWT (JSON Web Tokens) for secure authentication and authorization to protect admin panel routes and API endpoints.
- Form Validations: Data validation on admin panel forms to ensure data integrity and prevent invalid submissions, with appropriate error messages.
- Cylinder Carousel: Implementation of a horizontal cylinder-like carousel for the image gallery in the Hero section, matching the design's aesthetic.

## Style Guidelines:

- Use the light cyan color (#AFEEEE) observed in the logo and accent elements for a bright and modern feel.
- Predominantly white (#FFFFFF) to maintain a clean and spacious aesthetic, consistent with the original design.
- Light gray (#D3D3D3) for form backgrounds and subtle UI elements to provide contrast without overwhelming the interface.
- Employ a clean, sans-serif font (e.g., 'Arial', 'Helvetica', or 'Open Sans') for readability and a modern look, matching the font style evident in the provided visual design.
- Use a semi-bold or bold font-weight for headlines to create visual hierarchy and draw attention to key sections.
- Simple, outlined icons in a matching light cyan color for a consistent and unobtrusive visual language.
- Full-width sections with centered content to maximize screen real estate and focus user attention, mirroring the design's structure.
- Consistent padding and margins across all sections to maintain visual balance and a sense of order.
- Subtle fade-in animations for content sections as the user scrolls, enhancing user engagement without causing distraction.