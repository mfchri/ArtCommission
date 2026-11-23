-- ==============================================================================
-- ARTIST PORTFOLIO & CMS: DATABASE SCHEMA
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Site Settings & Meta Table
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    artist_name TEXT NOT NULL DEFAULT 'KAIEN',
    artist_kanji TEXT DEFAULT '晦冥',
    site_title TEXT NOT NULL DEFAULT 'KAIEN — Original Character Artist & Illustrator',
    tagline TEXT DEFAULT 'Original Characters · Dark Fantasy · Graphic Narratives',
    meta_description TEXT DEFAULT 'Portfolio of KAIEN, an illustrator specializing in dark fantasy Original Characters (OCs), personal comic projects, and selective character commissions.',
    og_image TEXT DEFAULT '/assets/reference.png',
    favicon_svg TEXT DEFAULT '<svg xmlns=''http://www.w3.org/2000/svg'' viewBox=''0 0 32 32''><polygon points=''16,2 30,28 16,22 2,28'' fill=''%231E1D1C''/></svg>',
    nav_labels JSONB NOT NULL DEFAULT '{"intro": "Intro", "profile": "Profile", "works": "Works", "commissions": "Commissions", "contact": "Contact"}'::jsonb,
    section_visibility JSONB NOT NULL DEFAULT '{"intro": true, "profile": true, "works": true, "commissions": true, "contact": true}'::jsonb,
    footer_text TEXT DEFAULT 'All artwork and original characters are intellectual property of the artist.',
    copyright_year INT DEFAULT 2026,
    has_unpublished_changes BOOLEAN DEFAULT false,
    draft_data JSONB,
    published_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Intro (Hero) Section Table
CREATE TABLE IF NOT EXISTS public.intro_section (
    id TEXT PRIMARY KEY DEFAULT 'default',
    eyebrow TEXT NOT NULL DEFAULT 'Original Characters · Commissions · Comics',
    headline TEXT NOT NULL DEFAULT 'Drawing the worlds that live in my head.',
    bio_summary TEXT NOT NULL DEFAULT 'Illustrator exploring dark fantasy, silent monoliths, and fractured silhouettes. Welcome to my personal archive of characters, narratives, and ongoing ink projects.',
    hero_image_src TEXT NOT NULL DEFAULT '/assets/reference.png',
    hero_image_alt TEXT NOT NULL DEFAULT 'Dark monochrome ink illustration of a pale long-haired figure with a clawed hand surrounded by jagged obsidian shards',
    hero_image_title TEXT NOT NULL DEFAULT 'Vessel of Shards',
    hero_image_medium TEXT NOT NULL DEFAULT 'Digital Inking & Sumi Wash',
    hero_image_year TEXT NOT NULL DEFAULT '2026',
    hero_image_focal_x INT DEFAULT 50,
    hero_image_focal_y INT DEFAULT 50,
    cta_primary_label TEXT NOT NULL DEFAULT 'View Works',
    cta_primary_href TEXT NOT NULL DEFAULT '#works',
    cta_secondary_label TEXT NOT NULL DEFAULT 'Commission Me',
    cta_secondary_href TEXT NOT NULL DEFAULT '#commissions',
    has_unpublished_changes BOOLEAN DEFAULT false,
    draft_data JSONB,
    published_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Profile Section Table
CREATE TABLE IF NOT EXISTS public.profile_section (
    id TEXT PRIMARY KEY DEFAULT 'default',
    section_number TEXT NOT NULL DEFAULT '01 — PROFILE',
    title TEXT NOT NULL DEFAULT 'About the Artist',
    artist_name TEXT NOT NULL DEFAULT 'KAIEN',
    subtitle TEXT NOT NULL DEFAULT 'Independent Character Designer & Comic Illustrator',
    avatar_src TEXT NOT NULL DEFAULT '/assets/avatar.svg',
    avatar_alt TEXT NOT NULL DEFAULT 'Stylized portrait of Kaien in ink brushwork',
    avatar_caption TEXT NOT NULL DEFAULT 'KAIEN // Inking at the atelier',
    bio_paragraphs JSONB NOT NULL DEFAULT '[]'::jsonb,
    style_themes JSONB NOT NULL DEFAULT '[]'::jsonb,
    tools_used JSONB NOT NULL DEFAULT '[]'::jsonb,
    facts JSONB NOT NULL DEFAULT '[]'::jsonb,
    stats JSONB NOT NULL DEFAULT '[]'::jsonb,
    has_unpublished_changes BOOLEAN DEFAULT false,
    draft_data JSONB,
    published_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Work Categories Table (powers filter tabs)
CREATE TABLE IF NOT EXISTS public.work_categories (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Artworks Table
CREATE TABLE IF NOT EXISTS public.artworks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    year TEXT NOT NULL DEFAULT '2026',
    category TEXT NOT NULL REFERENCES public.work_categories(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    category_label TEXT NOT NULL,
    image TEXT NOT NULL,
    thumbnail TEXT,
    aspect_class TEXT NOT NULL DEFAULT 'aspect-[4/5]',
    description TEXT NOT NULL DEFAULT '',
    medium TEXT NOT NULL DEFAULT 'Digital Ink & Sumi Wash',
    dimensions TEXT DEFAULT '3000 × 4000 px',
    featured BOOLEAN NOT NULL DEFAULT false,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Comic Book Featured Project
CREATE TABLE IF NOT EXISTS public.comic_project (
    id TEXT PRIMARY KEY DEFAULT 'default',
    title TEXT NOT NULL DEFAULT 'ECHOES OF THE ABYSS',
    volume TEXT NOT NULL DEFAULT 'Volume I: Fractured Dawn',
    subtitle TEXT NOT NULL DEFAULT 'A serialized dark fantasy graphic novel',
    status TEXT NOT NULL DEFAULT 'Ongoing',
    synopsis TEXT NOT NULL,
    genre JSONB NOT NULL DEFAULT '[]'::jsonb,
    cover_image TEXT NOT NULL DEFAULT '/assets/comic-cover.svg',
    current_chapter TEXT NOT NULL DEFAULT 'Chapter 14: The Whispering Monolith',
    release_schedule TEXT NOT NULL DEFAULT 'Monthly serialized release on Webtoon & Gumroad',
    read_url TEXT NOT NULL DEFAULT '#contact',
    notes TEXT DEFAULT 'Over 240+ pages completed to date. Physical book edition currently in production.',
    has_unpublished_changes BOOLEAN DEFAULT false,
    draft_data JSONB,
    published_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Commissions Config & Availability
CREATE TABLE IF NOT EXISTS public.commissions_config (
    id TEXT PRIMARY KEY DEFAULT 'default',
    section_number TEXT NOT NULL DEFAULT '03 — COMMISSIONS',
    title TEXT NOT NULL DEFAULT 'Open Commissions',
    description TEXT NOT NULL,
    is_open BOOLEAN NOT NULL DEFAULT true,
    slots_total INT NOT NULL DEFAULT 5,
    slots_available INT NOT NULL DEFAULT 3,
    next_opening_estimate TEXT DEFAULT 'Batch 02 opening in December 2026',
    has_unpublished_changes BOOLEAN DEFAULT false,
    draft_data JSONB,
    published_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Commission Pricing Tiers
CREATE TABLE IF NOT EXISTS public.commission_tiers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price TEXT NOT NULL,
    badge TEXT,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    turnaround TEXT NOT NULL,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_popular BOOLEAN NOT NULL DEFAULT false,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Commission Add-ons
CREATE TABLE IF NOT EXISTS public.commission_addons (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price TEXT NOT NULL,
    note TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Commission Process Steps
CREATE TABLE IF NOT EXISTS public.commission_steps (
    id TEXT PRIMARY KEY,
    step TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 11. Commission Terms of Service (Accordion)
CREATE TABLE IF NOT EXISTS public.commission_tos (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content JSONB NOT NULL DEFAULT '[]'::jsonb,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 12. Commission FAQs
CREATE TABLE IF NOT EXISTS public.commission_faqs (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 13. Contact Settings Table
CREATE TABLE IF NOT EXISTS public.contact_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    section_number TEXT NOT NULL DEFAULT '04 — CONTACT',
    title TEXT NOT NULL DEFAULT 'Initiate an Inquiry',
    invitation TEXT NOT NULL,
    subtext TEXT NOT NULL,
    email TEXT NOT NULL DEFAULT 'kaien.atelier@example.com',
    availability_note TEXT NOT NULL,
    commission_types JSONB NOT NULL DEFAULT '[]'::jsonb,
    has_unpublished_changes BOOLEAN DEFAULT false,
    draft_data JSONB,
    published_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 14. Social Links Table
CREATE TABLE IF NOT EXISTS public.social_links (
    id TEXT PRIMARY KEY,
    platform TEXT NOT NULL,
    name TEXT NOT NULL,
    handle TEXT NOT NULL,
    url TEXT NOT NULL,
    icon_name TEXT NOT NULL DEFAULT 'mail',
    is_visible BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 15. Contact Form Submissions (Messages Inbox)
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    commission_type TEXT NOT NULL DEFAULT 'general',
    reference_url TEXT,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 16. Media Library Assets
CREATE TABLE IF NOT EXISTS public.media_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    size_bytes BIGINT DEFAULT 0,
    mime_type TEXT DEFAULT 'image/png',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 17. Revisions & Snapshots Table
CREATE TABLE IF NOT EXISTS public.content_revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    area TEXT NOT NULL, -- e.g. 'site_settings', 'intro', 'profile', 'commissions', etc.
    snapshot JSONB NOT NULL,
    published_at TIMESTAMPTZ DEFAULT now(),
    published_by TEXT
);

-- Storage bucket for portfolio uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO NOTHING;
