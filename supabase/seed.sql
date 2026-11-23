-- ==============================================================================
-- SEED SCRIPT: IMPORT CURRENT STATIC CONTENT INTO DATABASE
-- ==============================================================================

-- 1. Site Settings
INSERT INTO public.site_settings (
    id, artist_name, artist_kanji, site_title, tagline, meta_description, 
    og_image, nav_labels, section_visibility, footer_text, copyright_year
) VALUES (
    'default',
    'KAIEN',
    '晦冥',
    'KAIEN — Original Character Artist & Illustrator',
    'Original Characters · Dark Fantasy · Graphic Narratives',
    'Portfolio of KAIEN, an illustrator specializing in dark fantasy Original Characters (OCs), personal comic projects, and selective character commissions.',
    '/assets/reference.png',
    '{"intro": "Intro", "profile": "Profile", "works": "Works", "commissions": "Commissions", "contact": "Contact"}'::jsonb,
    '{"intro": true, "profile": true, "works": true, "commissions": true, "contact": true}'::jsonb,
    'All artwork and original characters are intellectual property of the artist.',
    2026
) ON CONFLICT (id) DO UPDATE SET updated_at = now();

-- 2. Intro Section
INSERT INTO public.intro_section (
    id, eyebrow, headline, bio_summary, hero_image_src, hero_image_alt,
    hero_image_title, hero_image_medium, hero_image_year, hero_image_focal_x, hero_image_focal_y,
    cta_primary_label, cta_primary_href, cta_secondary_label, cta_secondary_href
) VALUES (
    'default',
    'Original Characters · Commissions · Comics',
    'Drawing the worlds that live in my head.',
    'Illustrator exploring dark fantasy, silent monoliths, and fractured silhouettes. Welcome to my personal archive of characters, narratives, and ongoing ink projects.',
    '/assets/reference.png',
    'Dark monochrome ink illustration of a pale long-haired figure with a clawed hand surrounded by jagged obsidian shards',
    'Vessel of Shards',
    'Digital Inking & Sumi Wash',
    '2026',
    50,
    50,
    'View Works',
    '#works',
    'Commission Me',
    '#commissions'
) ON CONFLICT (id) DO UPDATE SET updated_at = now();

-- 3. Profile Section
INSERT INTO public.profile_section (
    id, section_number, title, artist_name, subtitle, avatar_src, avatar_alt, avatar_caption,
    bio_paragraphs, style_themes, tools_used, facts, stats
) VALUES (
    'default',
    '01 — PROFILE',
    'About the Artist',
    'KAIEN',
    'Independent Character Designer & Comic Illustrator',
    '/assets/avatar.svg',
    'Stylized portrait of Kaien in ink brushwork',
    'KAIEN // Inking at the atelier',
    '["Hi, I''m Kaien. I spend most of my waking hours translating imaginary entities and atmospheric mythologies onto the page. My work is anchored in heavy contrast, gestural brushwork, and the tactile tension between raw ink and quiet negative space.", "I believe every original character carries a quiet narrative before a single word is written. Beyond client commissions, I am currently scripting and illustrating ''Echoes of the Abyss'', a serialized dark fantasy graphic novel chronicling the remnants of a shattered sun."]'::jsonb,
    '["Dark Fantasy", "Monochrome Ink", "Eldritch OCs", "Chiaroscuro", "Anatomy & Hands", "Graphic Novel Aesthetic", "Jagged Shards", "Atmospheric Halftones"]'::jsonb,
    '["Clip Studio Paint EX", "Maru & G-Pen Nibs", "Kuretake Sumi Ink", "iPad Pro + Procreate", "Arches 300gsm Paper"]'::jsonb,
    '[{"label": "Based in", "value": "Tokyo / Kyoto, JP"}, {"label": "Years drawing", "value": "10+ Years"}, {"label": "Languages", "value": "English, Japanese"}, {"label": "Current Obsession", "value": "Obsidian shards & gothic architecture"}]'::jsonb,
    '[{"value": 48, "suffix": "+", "label": "OCs Created"}, {"value": 180, "suffix": "+", "label": "Commissions Done"}, {"value": 14, "suffix": "", "label": "Comic Chapters"}, {"value": 8, "suffix": " yrs", "label": "Self-Published"}]'::jsonb
) ON CONFLICT (id) DO UPDATE SET updated_at = now();

-- 4. Work Categories
INSERT INTO public.work_categories (id, label, sort_order) VALUES
('all', 'All Works', 0),
('oc', 'Original Characters', 1),
('comic', 'Comic Project', 2),
('commissions', 'Commissions', 3),
('sketches', 'Sketches', 4)
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label, sort_order = EXCLUDED.sort_order;

-- 5. Artworks
INSERT INTO public.artworks (
    id, title, year, category, category_label, image, aspect_class, description,
    medium, dimensions, featured, is_visible, sort_order
) VALUES
(
    'vessel-of-shards',
    'Vessel of Shards',
    '2026',
    'oc',
    'Original Character',
    '/assets/reference.png',
    'aspect-[4/5] sm:aspect-[3/4]',
    'Hero artwork visual exploration. An eldritch entity bound to razor shards of obsidian and pale light. Rendered with textured brush inking and aggressive cross-hatching.',
    'Rough Ink & Sumi Wash',
    '4000 × 4000 px',
    true,
    true,
    0
),
(
    'echoes-cover-vol1',
    'Echoes of the Abyss — Cover Vol. I',
    '2025',
    'comic',
    'Comic Project',
    '/assets/comic-cover.svg',
    'aspect-[3/4]',
    'Official cover illustration for Act One. Emphasizes the celestial eclipse and the towering silhouette of the hollow monarch.',
    'Manga Inking & Screentone',
    '2400 × 3400 px',
    true,
    true,
    1
),
(
    'the-blind-oracle',
    'The Blind Oracle (OC: Vesper)',
    '2026',
    'oc',
    'Original Character',
    '/assets/artwork-oc-1.svg',
    'aspect-[4/5]',
    'Character concept for Vesper, a seer who sacrificed vision to perceive the fractured dimensional threads. Flowing hair and floating obsidian mirrors.',
    'Digital Brush & Halftones',
    '3500 × 4500 px',
    false,
    true,
    2
),
(
    'clawed-hand-studies',
    'Extensor Tendon Anatomy Studies',
    '2026',
    'sketches',
    'Sketches',
    '/assets/artwork-sketch-1.svg',
    'aspect-square',
    'Anatomical explorations of monstrous, elongated claws and tension points. Study for character transformations in Chapter 12.',
    'Graphite & Maru-pen Nib',
    '2800 × 2800 px',
    false,
    true,
    3
),
(
    'lord-of-crows',
    'Lord of Crows (Custom Commission)',
    '2025',
    'commissions',
    'Commission',
    '/assets/artwork-comm-1.svg',
    'aspect-[4/5]',
    'Private client commission for a tabletop RPG villain. Features a feathered crow mask, broad wing silhouette, and antique velvet frock coat.',
    'Full Digital Render',
    '3200 × 4000 px',
    false,
    true,
    4
),
(
    'wanderer-of-ash',
    'Wanderer of the Ash Plains (OC: Kael)',
    '2025',
    'oc',
    'Original Character',
    '/assets/artwork-oc-2.svg',
    'aspect-square sm:aspect-[4/3]',
    'Environmental character concept depicting the lone pilgrim crossing the gray dunes under a desolate twilight sky.',
    'Ink Wash on Toned Board',
    '3000 × 3000 px',
    false,
    true,
    5
),
(
    'monolith-sentinel',
    'The Monolith Sentinel (Concept Sketch)',
    '2026',
    'sketches',
    'Sketches',
    '/assets/artwork-sketch-2.svg',
    'aspect-[3/4]',
    'Scale and structure study for ancient guardian automatons entombed beneath the sunken necropolis.',
    'Technical Ink & Screentone',
    '2800 × 3600 px',
    false,
    true,
    6
),
(
    'astral-huntress',
    'Astral Huntress (Custom Commission)',
    '2026',
    'commissions',
    'Commission',
    '/assets/artwork-comm-2.svg',
    'aspect-[4/5]',
    'Private character commission. An archer wielding an ethereal bow fashioned from celestial light and bone.',
    'Full Digital Line & Light',
    '3200 × 4000 px',
    false,
    true,
    7
)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    image = EXCLUDED.image,
    sort_order = EXCLUDED.sort_order;

-- 6. Comic Book Project
INSERT INTO public.comic_project (
    id, title, volume, subtitle, status, synopsis, genre, cover_image,
    current_chapter, release_schedule, read_url, notes
) VALUES (
    'default',
    'ECHOES OF THE ABYSS',
    'Volume I: Fractured Dawn',
    'A serialized dark fantasy graphic novel',
    'Ongoing',
    'In a world where the sun fractured into floating shards of obsidian, an amnesiac knight and a mute seer traverse desolate ash plains in search of the Core. Illustrated entirely in high-contrast ink lineart and atmospheric screentones.',
    '["Dark Fantasy", "Supernatural", "Psychological Drama", "Horror"]'::jsonb,
    '/assets/comic-cover.svg',
    'Chapter 14: The Whispering Monolith',
    'Monthly serialized release on Webtoon & Gumroad',
    '#contact',
    'Over 240+ pages completed to date. Physical book edition currently in production.'
) ON CONFLICT (id) DO UPDATE SET updated_at = now();

-- 7. Commissions Config
INSERT INTO public.commissions_config (
    id, section_number, title, description, is_open, slots_total, slots_available, next_opening_estimate
) VALUES (
    'default',
    '03 — COMMISSIONS',
    'Open Commissions',
    'I take a limited number of custom commissions each month to ensure dedicated attention to every piece. Below you will find current availability, pricing tiers, and guidelines.',
    true,
    5,
    3,
    'Batch 02 opening in December 2026'
) ON CONFLICT (id) DO UPDATE SET updated_at = now();

-- 8. Commission Tiers
INSERT INTO public.commission_tiers (
    id, name, price, badge, description, image, turnaround, features, is_popular, sort_order
) VALUES
(
    'sketch',
    'Rough Ink Sketch',
    '$65 USD',
    NULL,
    'Loose, dynamic pencil and ink sketch focusing on posture, expression, and kinetic energy.',
    '/assets/tier-sketch.svg',
    '5 – 7 business days',
    '["Bust or waist-up character framing", "Raw graphite / ink brush textures", "Tonal monochrome wash", "1 round of pose adjustments", "High-res 300 DPI PNG & JPG"]'::jsonb,
    false,
    0
),
(
    'lineart',
    'Clean Line Art & Tone',
    '$130 USD',
    'Most Popular',
    'Precision inking inspired by manga masters, featuring detailed hatching, spot blacks, and classic screentones.',
    '/assets/tier-lineart.svg',
    '10 – 14 business days',
    '["Full body or dynamic 3/4 action pose", "Crisp weighted lines & manga halftones", "Transparent PNG + print-ready file", "2 revision checkpoints (sketch & ink)", "Suitable for avatar, poster, or card print"]'::jsonb,
    true,
    1
),
(
    'render',
    'Full Illustrative Render',
    '$240 USD',
    NULL,
    'A complete, cinematic character artwork with dramatic chiaroscuro lighting, floating shards, and textural ambiance.',
    '/assets/tier-render.svg',
    '3 – 4 weeks',
    '["Elaborate character design with props/weapons", "Atmospheric lighting & particle VFX", "Subtle scenic vignette or themed background", "3 milestone revisions (sketch, lines, final light)", "Includes full-res PSD with separated layers"]'::jsonb,
    false,
    2
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    features = EXCLUDED.features,
    sort_order = EXCLUDED.sort_order;

-- 9. Commission Add-ons
INSERT INTO public.commission_addons (id, name, price, note, sort_order) VALUES
('addon-1', 'Additional Character', '+75% of base tier price', 'Per extra subject in the same composition', 0),
('addon-2', 'Complex Background / Architecture', '+$60 – $120 USD', 'Gothic interiors, crumbling monoliths, or landscapes', 1),
('addon-3', 'Commercial Use License', '+100% of base tier price', 'For merch, book covers, games, or streaming branding', 2),
('addon-4', 'Rush Order Delivery', '+50% of base tier price', 'Guaranteed turnaround within 4 business days', 3),
('addon-5', 'Detailed Weapon / Eldritch Pet', '+$30 USD', 'Ornate scythes, demonic companions, or complex armor', 4)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, sort_order = EXCLUDED.sort_order;

-- 10. Commission Steps
INSERT INTO public.commission_steps (id, step, title, description, sort_order) VALUES
('step-1', '01', 'Inquiry & Brief', 'Submit the request form below with character visual references, desired tier, and any specific mood or pose notes.', 0),
('step-2', '02', 'Quote & 50% Deposit', 'I will review your request and send an itemized invoice. A 50% upfront deposit locks your slot on the board.', 1),
('step-3', '03', 'WIP Feedback', 'You receive progress snapshots at key milestones (composition thumbnail, rough sketch, clean lines) for approval.', 2),
('step-4', '04', 'Final Delivery', 'Upon settlement of the final invoice, full-resolution 300 DPI files, transparent PNGs, and print assets are delivered via Drive.', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;

-- 11. Commission TOS
INSERT INTO public.commission_tos (id, title, content, sort_order) VALUES
(
    'tos-1',
    'What I Draw & What I Do Not Draw',
    '["WILL DRAW: Original Characters (OCs), fantasy/sci-fi personas, dark fantasy entities, horned/clawed humanoids, selective fanart, armor, flowing hair, gothic fashion, and atmospheric scenes.", "WILL NOT DRAW: Heavy gore/mutilation, explicit NSFW/pornography, mecha/complex vehicles, hateful/offensive themes, or mimicry of other artists'' personal styles."]'::jsonb,
    0
),
(
    'tos-2',
    'Payment, Invoicing & Deadlines',
    '["All payments are in USD handled securely through PayPal invoice or Stripe.", "A 50% non-refundable deposit is required to commence work. The remaining 50% is due upon presentation of the watermarked final preview before final file delivery.", "Turnaround times are estimates and begin once the deposit and all character references are confirmed."]'::jsonb,
    1
),
(
    'tos-3',
    'Revision Policy',
    '["Up to 2 major revisions are permitted free of charge during the initial sketch stage (pose, costume silhouette, composition).", "Minor adjustments (facial expressions, line weights) are included in the inking stage.", "Changes requested after line art completion or complete pose changes will incur an additional fee commensurate with the work required."]'::jsonb,
    2
),
(
    'tos-4',
    'Copyright & Usage Rights',
    '["The artist (KAIEN) retains all moral rights and intellectual property copyright over the illustration, including the right to display the piece in portfolios, art books, and social archives.", "The client receives personal, non-commercial display rights (personal avatars, desktop wallpapers, social media sharing with artist credit).", "Commercial use (merchandise, monetized streaming, album covers, game assets) requires a commercial license upgrade specified prior to project kickoff."]'::jsonb,
    3
),
(
    'tos-5',
    'Cancellation & Refund Policy',
    '["If the artist is unable to complete the commission due to unforeseen circumstances, a 100% full refund will be immediately issued.", "If the client cancels before work has commenced, a full refund minus payment processing fees will be granted.", "If the client cancels after the sketch phase has begun, the 50% deposit is retained to cover labor expended."]'::jsonb,
    4
)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content, sort_order = EXCLUDED.sort_order;

-- 12. Contact Settings
INSERT INTO public.contact_settings (
    id, section_number, title, invitation, subtext, email, availability_note, commission_types
) VALUES (
    'default',
    '04 — CONTACT',
    'Initiate an Inquiry',
    'Have an original character waiting to be brought to life, or interested in a commercial collaboration? Send a message below.',
    'For standard commissions, please include character references and a brief description of the mood. For publishing or comic inquiries, feel free to pitch directly.',
    'kaien.atelier@example.com',
    'Currently accepting inquiries for Batch 01. Typical response window: 24–48 hours.',
    '[{"value": "sketch", "label": "Rough Ink Sketch ($65+)"}, {"value": "lineart", "label": "Clean Line Art & Halftones ($130+)"}, {"value": "render", "label": "Full Illustrative Render ($240+)"}, {"value": "comic", "label": "Comic / Sequential Project"}, {"value": "commercial", "label": "Commercial / Book Cover Licensing"}, {"value": "other", "label": "Other / General Question"}]'::jsonb
) ON CONFLICT (id) DO UPDATE SET updated_at = now();

-- 13. Social Links
INSERT INTO public.social_links (id, platform, name, handle, url, icon_name, is_visible, sort_order) VALUES
('social-1', 'Instagram', 'Instagram', '@kaien_ink', 'https://instagram.com/placeholder_kaien', 'instagram', true, 0),
('social-2', 'Twitter', 'X (Twitter)', '@kaien_draws', 'https://x.com/placeholder_kaien', 'twitter', true, 1),
('social-3', 'ArtStation', 'ArtStation', 'artstation.com/kaien', 'https://artstation.com/placeholder_kaien', 'artstation', true, 2),
('social-4', 'Pixiv', 'Pixiv', 'pixiv.me/kaien_oc', 'https://pixiv.me/placeholder_kaien', 'pixiv', true, 3),
('social-5', 'Email', 'Email', 'kaien.atelier@example.com', 'mailto:kaien.atelier@example.com', 'mail', true, 4)
ON CONFLICT (id) DO UPDATE SET handle = EXCLUDED.handle, url = EXCLUDED.url, sort_order = EXCLUDED.sort_order;
