# Implementation Plan V2: "WordPress-Style" CMS Features

To make the Admin Panel feel like a true CMS (like WordPress), we need to add management for Site Identity, Social Proof (Testimonials), and Customer Support (FAQ).

## 1. General Settings (Site Identity & Contacts)
Managed via a new `GeneralSetting` model or expanding `LandingPageContent`. We will use a key-value pair approach or specific fields for flexibility.

**Fields to Add:**
*   `site_title`: string (SEO Title)
*   `meta_description`: text
*   `contact_whatsapp`: string
*   `contact_email`: string
*   `contact_instagram`: string
*   `footer_copyright`: string

**Admin UI:**
*   New "Settings" page or tab in Content Manager.

**Frontend Integration:**
*   Use `site_title` for `document.title`.
*   Update Navbar/Footer contact links dynamically.

## 2. Testimonials (Ulasan Pelanggan)
A new section to display customer trust (Social Proof).

**Database Model (`Testimonial`):**
*   `name`: string
*   `role`: string (e.g., "Ibu Rumah Tangga")
*   `comment`: text
*   `photo`: string (image path)
*   `rating`: integer (1-5)

**Admin UI:**
*   CRUD interface (Add, Edit, Delete).
*   Mock photo upload (or use placeholders first).

**Frontend Integration:**
*   New section in `LandingPage.jsx` below "Stats".
*   Horizontal scroll or grid card layout.

## 3. FAQ Section (Pertanyaan Umum)
To answer common customer queries.

**Database Model (`Faq`):**
*   `question`: string
*   `answer`: text
*   `order`: integer

**Admin UI:**
*   Simple list with Add/Edit/Delete.

**Frontend Integration:**
*   Accordion style section near the bottom of the Landing Page.

## 4. Navbar Menu Manager (Optional/Advanced)
To manage the navigation links.

**Database:**
*   Store `menu_items` as JSON in `LandingPageContent`.
    *   `[{ label: "Home", link: "#home" }, { label: "Koleksi", link: "#collection" }]`

**Admin UI:**
*   List editor to reorder/rename menu items.

## Execution Priority
1.  **Testimonials**: High visual impact.
2.  **FAQ**: Adds content depth.
3.  **General Settings**: Crucial for "Footer" and "Contact" buttons functionality.
