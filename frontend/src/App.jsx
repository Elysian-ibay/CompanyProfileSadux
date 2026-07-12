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

// Fetch favicon & title globally once on app boot — applies to ALL pages including admin.
const applyGlobalBranding = async () => {
  try {
    const res = await api.get('/cms/settings');
    const s = res.data;
    if (s?.site_favicon) {
      const link = document.getElementById('app-favicon') || (() => {
        const el = document.createElement('link');
        el.id = 'app-favicon';
        el.rel = 'icon';
        document.head.appendChild(el);
        return el;
      })();
      link.type = 'image/png';
      link.href = s.site_favicon;
    }
    if (s?.site_title) document.title = s.site_title;
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
