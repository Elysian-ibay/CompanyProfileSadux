// Central theme registry for the landing page.
// Each theme fully describes `theme_settings` (stored on LandingPageContent) plus
// a `background_style` and preview metadata for the CMS Appearance tab.
//
// theme_settings schema (superset — older fields kept for backward compat):
//   mode: 'light' | 'dark'           -> flips base text colors on the page
//   font_heading, font_body          -> Google Font families
//   button_style                     -> border-radius utility class
//   accent                           -> primary accent color (badges, links, dots)
//   page_bg                          -> CSS background for the page root (light themes)
//   grid_bg                          -> draw a dotted grid overlay (retro)
//   text_color, heading_color, muted_color
//   button_gradient_start/end        -> gradient buttons (dark themes)
//   button_solid, button_text        -> solid button bg + text (retro / flat themes)
//   card_bg                          -> card background (css color / rgba)
//   card_bg_opacity                  -> legacy fallback if card_bg absent
//   card_border_color, card_border_width
//   card_shadow                      -> e.g. '6px 6px 0 #111' (hard) or 'none'
//   card_radius                      -> border-radius for cards
//   card_blur                        -> 'none' | 'md' | 'xl'
//   uppercase_headings               -> bool (retro)

export const THEMES = {
    retro: {
        id: 'retro',
        label: 'Retro / Neobrutalist',
        description: 'Cream paper + dotted grid, thick ink borders, hard shadows, loud yellow. Bold & playful.',
        swatches: ['#ffd800', '#fdf6e3', '#111111'],
        background_style: 'none',
        theme_settings: {
            mode: 'light',
            font_heading: 'Space Grotesk',
            font_body: 'Space Grotesk',
            accent: '#ffd800',
            page_bg: '#fdf6e3',
            grid_bg: true,
            text_color: '#1a1a1a',
            heading_color: '#111111',
            muted_color: '#4b4b4b',
            button_style: 'rounded-none',
            button_solid: '#ffd800',
            button_text: '#111111',
            card_bg: '#ffffff',
            card_border_color: '#111111',
            card_border_width: '3px',
            card_shadow: '6px 6px 0 #111111',
            card_radius: '0px',
            card_blur: 'none',
            uppercase_headings: true,
        },
    },

    modern_tech: {
        id: 'modern_tech',
        label: 'Modern Tech',
        description: 'Blue/violet gradients, clean sans fonts, high glassmorphism. Dark.',
        swatches: ['#3b82f6', '#8b5cf6', '#000000'],
        background_style: 'galaxy',
        theme_settings: {
            mode: 'dark',
            font_heading: 'Outfit',
            font_body: 'Inter',
            accent: '#06b6d4',
            button_style: 'rounded-xl',
            button_gradient_start: '#3b82f6',
            button_gradient_end: '#8b5cf6',
            card_bg_opacity: 0.08,
            card_blur: 'xl',
            card_border_color: 'rgba(255,255,255,0.1)',
            card_border_width: '1px',
            card_shadow: 'none',
            card_radius: '1rem',
        },
    },

    creative_studio: {
        id: 'creative_studio',
        label: 'Creative Studio',
        description: 'Vibrant pink/rose, geometric fonts, playful roundness. Dark.',
        swatches: ['#ec4899', '#f43f5e', '#1a1a1a'],
        background_style: 'sunny_clouds',
        theme_settings: {
            mode: 'dark',
            font_heading: 'Space Grotesk',
            font_body: 'Outfit',
            accent: '#ec4899',
            button_style: 'rounded-full',
            button_gradient_start: '#ec4899',
            button_gradient_end: '#f43f5e',
            card_bg_opacity: 0.15,
            card_blur: 'md',
            card_border_color: 'rgba(236, 72, 153, 0.3)',
            card_border_width: '1px',
            card_shadow: 'none',
            card_radius: '1.25rem',
        },
    },

    elegant_dark: {
        id: 'elegant_dark',
        label: 'Elegant Dark',
        description: 'Gold/silver accents, serif fonts, solid premium feel. Dark.',
        swatches: ['#d4af37', '#c0c0c0', '#0a0a0a'],
        background_style: 'starry_night',
        theme_settings: {
            mode: 'dark',
            font_heading: 'Playfair Display',
            font_body: 'Poppins',
            accent: '#d4af37',
            button_style: 'rounded-none',
            button_gradient_start: '#d4af37',
            button_gradient_end: '#c0c0c0',
            card_bg_opacity: 0.7,
            card_blur: 'none',
            card_border_color: 'rgba(212, 175, 55, 0.2)',
            card_border_width: '1px',
            card_shadow: 'none',
            card_radius: '0.25rem',
        },
    },

    neon_cyber: {
        id: 'neon_cyber',
        label: 'Neon Cyberpunk',
        description: 'Pitch-black, neon cyan→magenta, glowing borders, mono headings. Dark.',
        swatches: ['#22d3ee', '#d946ef', '#05010a'],
        background_style: 'neon_grid',
        theme_settings: {
            mode: 'dark',
            font_heading: 'Space Grotesk',
            font_body: 'Inter',
            accent: '#22d3ee',
            button_style: 'rounded-md',
            button_gradient_start: '#22d3ee',
            button_gradient_end: '#d946ef',
            card_bg_opacity: 0.06,
            card_blur: 'md',
            card_border_color: 'rgba(34, 211, 238, 0.4)',
            card_border_width: '1px',
            card_shadow: '0 0 20px rgba(34,211,238,0.25)',
            card_radius: '0.5rem',
        },
    },

    pastel_pop: {
        id: 'pastel_pop',
        label: 'Pastel Pop',
        description: 'Soft light gradient, candy accents, rounded & airy. Light.',
        swatches: ['#f472b6', '#a78bfa', '#fdf2f8'],
        background_style: 'none',
        theme_settings: {
            mode: 'light',
            font_heading: 'Poppins',
            font_body: 'Inter',
            accent: '#ec4899',
            page_bg: 'linear-gradient(135deg, #fdf2f8 0%, #eef2ff 50%, #ecfeff 100%)',
            grid_bg: false,
            text_color: '#3f3f46',
            heading_color: '#1f2937',
            muted_color: '#6b7280',
            button_style: 'rounded-full',
            button_gradient_start: '#f472b6',
            button_gradient_end: '#a78bfa',
            card_bg: 'rgba(255,255,255,0.75)',
            card_border_color: 'rgba(236,72,153,0.25)',
            card_border_width: '1px',
            card_shadow: '0 10px 30px rgba(167,139,250,0.18)',
            card_radius: '1.25rem',
            card_blur: 'md',
        },
    },
};

// Ordered list for rendering preset buttons (retro first = default).
export const THEME_LIST = [
    THEMES.retro,
    THEMES.modern_tech,
    THEMES.creative_studio,
    THEMES.elegant_dark,
    THEMES.neon_cyber,
    THEMES.pastel_pop,
];

export const DEFAULT_THEME_ID = 'retro';

// Merge a stored theme_settings object over a theme's defaults so the page has
// every field even if the DB row predates a field.
export function resolveThemeSettings(activeTheme, storedSettings) {
    const base = (THEMES[activeTheme] || THEMES[DEFAULT_THEME_ID]).theme_settings;
    return { ...base, ...(storedSettings || {}) };
}
