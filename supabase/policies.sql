-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intro_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comic_project ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_tos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_revisions ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 1. PUBLIC (ANONYMOUS) READ POLICIES
-- ------------------------------------------------------------------------------
-- Public can read published content
CREATE POLICY "Public can read site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public can read intro section" ON public.intro_section FOR SELECT USING (true);
CREATE POLICY "Public can read profile section" ON public.profile_section FOR SELECT USING (true);
CREATE POLICY "Public can read work categories" ON public.work_categories FOR SELECT USING (true);
CREATE POLICY "Public can read visible artworks" ON public.artworks FOR SELECT USING (is_visible = true OR auth.role() = 'authenticated');
CREATE POLICY "Public can read comic project" ON public.comic_project FOR SELECT USING (true);
CREATE POLICY "Public can read commissions config" ON public.commissions_config FOR SELECT USING (true);
CREATE POLICY "Public can read commission tiers" ON public.commission_tiers FOR SELECT USING (true);
CREATE POLICY "Public can read commission addons" ON public.commission_addons FOR SELECT USING (true);
CREATE POLICY "Public can read commission steps" ON public.commission_steps FOR SELECT USING (true);
CREATE POLICY "Public can read commission tos" ON public.commission_tos FOR SELECT USING (true);
CREATE POLICY "Public can read commission faqs" ON public.commission_faqs FOR SELECT USING (true);
CREATE POLICY "Public can read contact settings" ON public.contact_settings FOR SELECT USING (true);
CREATE POLICY "Public can read visible social links" ON public.social_links FOR SELECT USING (is_visible = true OR auth.role() = 'authenticated');
CREATE POLICY "Public can read media library" ON public.media_library FOR SELECT USING (true);

-- ------------------------------------------------------------------------------
-- 2. CONTACT MESSAGES (PUBLIC INSERT, AUTH SELECT/UPDATE/DELETE)
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can submit contact messages" ON public.contact_messages 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can view contact messages" ON public.contact_messages 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can update contact messages" ON public.contact_messages 
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete contact messages" ON public.contact_messages 
FOR DELETE USING (auth.role() = 'authenticated');

-- ------------------------------------------------------------------------------
-- 3. AUTHENTICATED ADMIN FULL ACCESS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Admin has full access to site_settings" ON public.site_settings 
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin has full access to intro_section" ON public.intro_section 
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin has full access to profile_section" ON public.profile_section 
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin has full access to work_categories" ON public.work_categories 
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin has full access to artworks" ON public.artworks 
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin has full access to comic_project" ON public.comic_project 
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin has full access to commissions_config" ON public.commissions_config 
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin has full access to commission_tiers" ON public.commission_tiers 
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin has full access to commission_addons" ON public.commission_addons 
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin has full access to commission_steps" ON public.commission_steps 
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin has full access to commission_tos" ON public.commission_tos 
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin has full access to commission_faqs" ON public.commission_faqs 
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin has full access to contact_settings" ON public.contact_settings 
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin has full access to social_links" ON public.social_links 
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin has full access to media_library" ON public.media_library 
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin has full access to content_revisions" ON public.content_revisions 
FOR ALL USING (auth.role() = 'authenticated');

-- ------------------------------------------------------------------------------
-- 4. STORAGE POLICIES (portfolio-media bucket)
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can view portfolio media" ON storage.objects
FOR SELECT USING (bucket_id = 'portfolio-media');

CREATE POLICY "Admin can upload portfolio media" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'portfolio-media' AND auth.role() = 'authenticated');

CREATE POLICY "Admin can update portfolio media" ON storage.objects
FOR UPDATE USING (bucket_id = 'portfolio-media' AND auth.role() = 'authenticated');

CREATE POLICY "Admin can delete portfolio media" ON storage.objects
FOR DELETE USING (bucket_id = 'portfolio-media' AND auth.role() = 'authenticated');
