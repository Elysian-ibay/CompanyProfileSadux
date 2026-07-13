/**
 * Vercel Edge Middleware — social-media / SEO bot handler.
 *
 * Bots (WhatsApp, Facebook, Telegram, Twitter, LinkedIn, Google, Slack, dll)
 * tidak menjalankan JavaScript, sehingga mereka melihat meta tag kosong di
 * index.html yang di-generate Vite. Middleware ini mendeteksi bot berdasarkan
 * User-Agent, fetches settings dari CMS, lalu mengembalikan HTML minimal yang
 * berisi meta tag lengkap — sehingga link preview dan scraping bekerja dengan benar.
 *
 * Pengguna biasa melewati middleware ini tanpa perubahan (Vercel tetap
 * menyajikan SPA Vite seperti biasa).
 */

const BOT_UA =
  /bot|crawler|spider|slurp|facebookexternalhit|whatsapp|telegram|twitterbot|linkedinbot|slackbot|discordbot|googlebot|bingbot|duckduckbot|applebot|pinterestbot|snapchat|ia_archiver|curl|wget|python-requests|okhttp|java\/|node-fetch|preview/i;

export const config = {
  matcher: '/',
};

export default async function middleware(request) {
  const ua = request.headers.get('user-agent') || '';

  // Pass non-bots through unchanged → Vercel serves Vite SPA normally
  if (!BOT_UA.test(ua)) return;

  try {
    const apiUrl = (process.env.VITE_API_URL || '').replace(/\/+$/, '');
    if (!apiUrl) return;

    const s = await fetch(`${apiUrl}/cms/settings`, {
      headers: { 'Accept': 'application/json' },
    }).then((r) => (r.ok ? r.json() : null)).catch(() => null);

    if (!s) return;

    const title    = s.site_title        || 'SaduX - Company Profile';
    const desc     = s.footer_description || 'Sadulur Teknologi Indonesia — Innovate. Integrate. Inspire.';
    // Always use the static logo for bots — guarantees public accessibility.
    // CMS logo (site_logo) may be a private Supabase URL that bots can't reach.
    const logo    = 'https://sadux.my.id/logo.png';
    const favicon = s.site_favicon || logo;
    const siteName = s.site_name         || 'SaduX';
    const siteUrl  = 'https://sadux.my.id';

    const html = `<!doctype html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="index, follow" />
${favicon  ? `  <link rel="icon" type="image/png" href="${esc(favicon)}" />` : ''}
${logo     ? `  <link rel="apple-touch-icon" href="${esc(logo)}" />` : ''}
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}" />

  <!-- Open Graph -->
  <meta property="og:type"        content="website" />
  <meta property="og:url"         content="${esc(siteUrl)}" />
  <meta property="og:site_name"   content="${esc(siteName)}" />
  <meta property="og:title"       content="${esc(title)}" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta property="og:image"       content="${esc(logo)}" />
  <meta property="og:image:width"  content="1200" />
  <meta property="og:image:height" content="630" />

  <!-- Twitter / X -->
  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:title"       content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(desc)}" />
  <meta name="twitter:image"       content="${esc(logo)}" />
</head>
<body></body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        // Cache 1 hour on CDN edge, stale-while-revalidate 24 h
        'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch {
    // On any error fall through → Vercel serves index.html as usual
    return;
  }
}

/** Escape characters that would break inline HTML attribute values. */
function esc(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
