# Implementation Plan: Full Dynamic Landing Page Management

This plan outlines the steps to make **every single element** of the Landing Page editable via the Admin Panel, including text, numbers, list items, and images.

## 1. Database Schema Expansion (Backend)

We need to store more data. We will expand the current `LandingPageContent` model and add new related models for lists (Features, Stats).

### A. Update `LandingPageContent` Table
This table will store singleton data (unique sections).

**New Fields:**
*   **Hero Section**:
    *   `hero_badge_text`: string (e.g., "Boneka Premium...")
    *   `hero_btn_primary_text`: string
    *   `hero_btn_secondary_text`: string
*   **Product Teaser Section**:
    *   `teaser_title`: string
    *   `teaser_highlight_text`: string (e.g., "Impianmu")
    *   `teaser_description`: text
    *   `teaser_btn_text`: string
    *   `teaser_image`: string (File path for the side image)
    *   `teaser_features`: json (Array of strings for the bullet points)
*   **Stats Section**:
    *   `stats_visible`: boolean    

### B. New Table: `Feature`
To manage the "Kenapa Memilih MyBoneka?" cards dynamically.
*   `icon_name`: string (Lucide icon name)
*   `title`: string
*   `description`: text
*   `order`: integer

### C. New Table: `Statistic`
To manage the numbers strip (10k+ Pelanggan, etc.)
*   `value`: string (e.g. "10k+")
*   `label`: string (e.g. "Pelanggan Puas")
*   `order`: integer

## 2. Backend API Updates

### A. Content Controller (`contentController.js`)
*   Update `updateContent` to handle file uploads for `teaser_image`.
*   Handle saving the new text fields.

### B. Feature & Stat Controllers
*   Create CRUD endpoints for Features: `GET /features`, `POST /features`, `PUT /features/:id`, `DELETE /features/:id`
*   Create CRUD endpoints for Stats: `GET /stats`, `POST /stats`, etc.

## 3. Admin Panel Updates (Frontend)

We will redesign the **Content Manager** page to be more organized, possibly using Tabs.

### A. Hero & General Tab
*   Edit Badge, Title, Subtitle, Description.
*   Edit Button Texts.

### B. Features Tab
*   List existing features.
*   Form to Add/Edit Feature (Dropdown to select Icon, Input Title/Desc).

### C. Teaser/Promo Tab (Big Section)
*   Edit Title & Description.
*   **Image Uploader**: Upload the big image for the "Wujudkan Boneka Impianmu" section.
*   Dynamic List Editor: Add/Remove bullet points.

### D. Stats Tab
*   Add/Edit/Remove stat items.

## 4. Landing Page Integration (Frontend)

Update `LandingPage.jsx` to:
1.  Fetch `features` and `stats` in addition to `content` and `products`.
2.  Replace the hardcoded `FeatureCard` list with the dynamic data.
3.  Replace the hardcoded `Stats` section with dynamic data.
4.  Render the `teaser_image` if it exists, otherwise fallback to the placeholder.
5.  Render the dynamic bullet points in the Teaser section.

## 5. Execution Steps

1.  **Backend Models**: Create `Feature.js`, `Statistic.js` and update `LandingPageContent.js`.
2.  **Backend Routes/Controllers**: Implement the logic.
3.  **Frontend API**: Update `fetch` logic.
4.  **Admin UI**: Build the comprehensive Content Manager.
5.  **Public UI**: Connect the data.
