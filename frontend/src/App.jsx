import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import ContentManager from './pages/admin/ContentManager';
import api from './lib/api';

// Fetch CMS settings once at boot → apply favicon, title, and ALL OG/Twitter meta tags.
// Runs for every route including /admin/* so the browser tab always shows the right icon.
const applyGlobalBranding = async () => {
  try {
    const res = await api.get('/cms/settings');
    const s = res.data;

    const logo    = s?.site_logo    || '';
    const favicon = s?.site_favicon || logo;
    const title   = s?.site_title   || 'SaduX - Company Profile';
    const desc    = s?.footer_description || 'Sadulur Teknologi Indonesia — Innovate. Integrate. Inspire.';
    const siteName = s?.site_name   || 'SaduX';
    const siteUrl  = window.location.origin;

    // ── Favicon (browser tab) ──────────────────────────────────────────────
    if (favicon) {
      const link = document.getElementById('app-favicon') || (() => {
        const el = document.createElement('link');
        el.id = 'app-favicon'; el.rel = 'icon';
        document.head.appendChild(el); return el;
      })();
      link.type = 'image/png';
      link.href = favicon;
    }

    // ── Apple touch icon (iOS home screen) ────────────────────────────────
    if (logo) {
      const apple = document.getElementById('app-apple-icon') || (() => {
        const el = document.createElement('link');
        el.id = 'app-apple-icon'; el.rel = 'apple-touch-icon';
        document.head.appendChild(el); return el;
      })();
      apple.href = logo;
    }

    // ── Page title ────────────────────────────────────────────────────────
    document.title = title;

    // ── Helper: set content/attribute on a meta element by ID ─────────────
    const setMeta = (id, attr, val) => {
      if (!val) return;
      const el = document.getElementById(id);
      if (el) el.setAttribute(attr, val);
    };

    // ── Standard SEO ──────────────────────────────────────────────────────
    setMeta('meta-description', 'content', desc);

    // ── Open Graph ────────────────────────────────────────────────────────
    setMeta('og-title',       'content', title);
    setMeta('og-description', 'content', desc);
    setMeta('og-image',       'content', logo);
    setMeta('og-url',         'content', siteUrl);
    setMeta('og-site-name',   'content', siteName);

    // ── Twitter / X ───────────────────────────────────────────────────────
    setMeta('tw-title',       'content', title);
    setMeta('tw-description', 'content', desc);
    setMeta('tw-image',       'content', logo);

  } catch (_) {}
};
applyGlobalBranding();

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login/super-admin" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="content" element={<ContentManager />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
