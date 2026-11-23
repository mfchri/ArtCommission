import { supabase, isSupabaseConfigured } from '../lib/supabase/client';
import { WebsiteDataBundle, AreaKey } from '../types/cms';
import { Artwork, WorkCategoryItem } from '../types/works';
import { CommissionTier, AddOnItem, ProcessStep, TosItem, FaqItem } from '../types/commissions';
import { ContactMessage } from '../types/contact';
import { SocialLinkItem } from '../types/site';

// Static default fallback datasets
import { siteConfig as staticSiteConfig } from '../data/site';
import { introData as staticIntroData } from '../data/intro';
import { profileData as staticProfileData } from '../data/profile';
import { worksData as staticWorksData } from '../data/works';
import { commissionsConfig as staticCommissionsConfig } from '../data/commissions';
import { contactData as staticContactData } from '../data/contact';
import defaultContent from '../data/defaultContent.json';

export const LOCAL_STORAGE_KEY = 'kaien_art_cms_bundle_v1';
export const REVISIONS_STORAGE_KEY = 'kaien_art_cms_revisions_v1';
export const MESSAGES_STORAGE_KEY = 'kaien_art_cms_messages_v1';
export const CMS_CONTENT_UPDATED_EVENT = 'kaien_cms_content_updated';
export const CMS_SYNC_STORAGE_KEY = 'kaien_art_cms_last_sync';
export const CMS_BROADCAST_CHANNEL_NAME = 'kaien_cms_sync_channel';

/**
 * Notifikasi instan reaktif untuk SPA internal dan multi-tab browser
 */
export function notifyContentUpdated(bundle?: WebsiteDataBundle): void {
  const data = bundle || getLocalBundle();

  // 1. Dispatch custom event di window saat ini (reaktivitas instan dalam 1 SPA session)
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(CMS_CONTENT_UPDATED_EVENT, { detail: data }));
    }
  } catch (e) {
    console.warn('Dispatch event error:', e);
  }

  // 2. Perbarui key timestamp penyimpanan agar mentrigger event 'storage' di tab browser lain
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(CMS_SYNC_STORAGE_KEY, Date.now().toString());
    }
  } catch (e) {
    console.warn('Storage sync key error:', e);
  }

  // 3. BroadcastChannel untuk komunikasi real-time antar tab browser
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel(CMS_BROADCAST_CHANNEL_NAME);
      bc.postMessage({ type: 'CMS_CONTENT_UPDATED', timestamp: Date.now() });
      bc.close();
    }
  } catch {
    // Abaikan jika browser tidak mendukung BroadcastChannel
  }
}

// Initial default bundle snapshot
export function getDefaultBundle(): WebsiteDataBundle {
  const baseBundle: WebsiteDataBundle = {
    siteSettings: {
      id: 'default',
      artistName: staticSiteConfig.artistName,
      artistKanji: staticSiteConfig.artistKanji,
      siteTitle: staticSiteConfig.siteTitle,
      tagline: staticSiteConfig.tagline,
      metaDescription: 'Portfolio of KAIEN, an illustrator specializing in dark fantasy Original Characters (OCs), personal comic projects, and selective character commissions.',
      ogImage: '/assets/reference.png',
      faviconSvg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><polygon points='16,2 30,28 16,22 2,28' fill='%231E1D1C'/></svg>`,
      navLabels: {
        intro: 'Intro',
        profile: 'Profile',
        works: 'Works',
        commissions: 'Commissions',
        contact: 'Contact',
      },
      sectionVisibility: {
        intro: true,
        profile: true,
        works: true,
        commissions: true,
        contact: true,
      },
      footerText: 'All artwork and original characters are intellectual property of the artist.',
      copyrightYear: staticSiteConfig.copyrightYear,
      hasUnpublishedChanges: false,
    },
    intro: {
      id: 'default',
      eyebrow: staticIntroData.eyebrow,
      headline: staticIntroData.headline,
      bioSummary: staticIntroData.bioSummary,
      heroArtwork: {
        src: staticIntroData.heroArtwork.src,
        alt: staticIntroData.heroArtwork.alt,
        title: staticIntroData.heroArtwork.title,
        medium: staticIntroData.heroArtwork.medium,
        year: staticIntroData.heroArtwork.year,
        focalX: 50,
        focalY: 50,
      },
      ctaPrimary: staticIntroData.ctaPrimary,
      ctaSecondary: staticIntroData.ctaSecondary,
      hasUnpublishedChanges: false,
    },
    profile: {
      id: 'default',
      sectionNumber: staticProfileData.sectionNumber,
      title: staticProfileData.title,
      artistName: staticProfileData.artistName,
      subtitle: staticProfileData.subtitle,
      avatar: staticProfileData.avatar,
      bioParagraphs: staticProfileData.bioParagraphs,
      styleThemes: staticProfileData.styleThemes,
      toolsUsed: staticProfileData.toolsUsed,
      facts: staticProfileData.facts,
      stats: staticProfileData.stats,
      hasUnpublishedChanges: false,
    },
    categories: staticWorksData.categories.map((c, i) => ({
      id: c.id,
      label: c.label,
      sortOrder: i,
    })),
    artworks: staticWorksData.artworks.map((art, i) => ({
      ...art,
      featured: Boolean(art.featured),
      isVisible: true,
      sortOrder: i,
    })),
    comicProject: {
      ...staticWorksData.comicProject,
      hasUnpublishedChanges: false,
    },
    commissionsConfig: {
      id: 'default',
      sectionNumber: staticCommissionsConfig.sectionNumber,
      title: staticCommissionsConfig.title,
      description: staticCommissionsConfig.description,
      isOpen: staticCommissionsConfig.isOpen,
      slotsTotal: staticCommissionsConfig.slotsTotal,
      slotsAvailable: staticCommissionsConfig.slotsAvailable,
      nextOpeningEstimate: staticCommissionsConfig.nextOpeningEstimate,
      hasUnpublishedChanges: false,
    },
    commissionTiers: staticCommissionsConfig.tiers.map((t, i) => ({
      ...t,
      isPopular: Boolean(t.isPopular),
      sortOrder: i,
    })),
    commissionAddons: staticCommissionsConfig.addOns.map((a, i) => ({
      id: `addon-${i + 1}`,
      name: a.name,
      price: a.price,
      note: a.note,
      sortOrder: i,
    })),
    commissionSteps: staticCommissionsConfig.processSteps.map((s, i) => ({
      id: `step-${i + 1}`,
      step: s.step,
      title: s.title,
      description: s.description,
      sortOrder: i,
    })),
    commissionTos: staticCommissionsConfig.termsOfService.map((tos, i) => ({
      id: tos.id,
      title: tos.title,
      content: tos.content,
      sortOrder: i,
    })),
    commissionFaqs: [
      {
        id: 'faq-1',
        question: 'Berapa lama proses pengerjaan komisi?',
        answer: 'Estimasi waktu tergantung tier yang dipilih: Sketch memakan waktu 5-7 hari kerja, Line Art 10-14 hari kerja, dan Full Render membutuhkan 3-4 minggu.',
        sortOrder: 0,
      },
      {
        id: 'faq-2',
        question: 'Apakah saya boleh mencetak hasil karya untuk keperluan pribadi?',
        answer: 'Tentu saja! Semua pesanan non-komersial menyertakan izin cetak pribadi (personal display) resolusi tinggi 300 DPI.',
        sortOrder: 1,
      },
    ],
    contactSettings: {
      id: 'default',
      sectionNumber: staticContactData.sectionNumber,
      title: staticContactData.title,
      invitation: staticContactData.invitation,
      subtext: staticContactData.subtext,
      email: staticContactData.email,
      availabilityNote: staticContactData.availabilityNote,
      commissionTypes: staticContactData.commissionTypes,
      hasUnpublishedChanges: false,
    },
    socialLinks: staticSiteConfig.socialLinks.map((s, i) => ({
      id: `social-${i + 1}`,
      platform: s.name,
      name: s.name,
      handle: s.handle,
      url: s.url,
      iconName: s.iconName,
      isVisible: true,
      sortOrder: i,
    })),
  };

  // If a defaultContent snapshot is provided, merge it seamlessly
  if (defaultContent && Object.keys(defaultContent).length > 0) {
    const dc = defaultContent as any;
    return {
      ...baseBundle,
      ...dc,
      siteSettings: { ...baseBundle.siteSettings, ...(dc.siteSettings || dc.site_settings || {}) },
      intro: { ...baseBundle.intro, ...(dc.intro || {}) },
      profile: { ...baseBundle.profile, ...(dc.profile || {}) },
      comicProject: { ...baseBundle.comicProject, ...(dc.comicProject || dc.comic || {}) },
      commissionsConfig: { ...baseBundle.commissionsConfig, ...(dc.commissionsConfig || dc.commissions || {}) },
      contactSettings: { ...baseBundle.contactSettings, ...(dc.contactSettings || dc.contact || {}) },
      artworks: dc.artworks || baseBundle.artworks,
      categories: dc.categories || baseBundle.categories,
      commissionTiers: dc.commissionTiers || baseBundle.commissionTiers,
      commissionAddons: dc.commissionAddons || baseBundle.commissionAddons,
      commissionSteps: dc.commissionSteps || baseBundle.commissionSteps,
      commissionTos: dc.commissionTos || baseBundle.commissionTos,
      commissionFaqs: dc.commissionFaqs || baseBundle.commissionFaqs,
      socialLinks: dc.socialLinks || baseBundle.socialLinks,
    };
  }

  return baseBundle;
}

// Mapping from AreaKey to WebsiteDataBundle key
export function getBundleKeyForArea(area: AreaKey): keyof WebsiteDataBundle {
  switch (area) {
    case 'site_settings':
      return 'siteSettings';
    case 'intro':
      return 'intro';
    case 'profile':
      return 'profile';
    case 'works':
      return 'artworks';
    case 'comic':
      return 'comicProject';
    case 'commissions':
      return 'commissionsConfig';
    case 'contact':
      return 'contactSettings';
    default:
      return area as keyof WebsiteDataBundle;
  }
}

// Local cache helper
export function getLocalBundle(): WebsiteDataBundle {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_KEY) : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      const defaultBundle = getDefaultBundle();

      // Resolve alias properties (both camelCase and snake_case)
      const siteSettingsData = parsed.siteSettings || parsed.site_settings || {};
      const introData = parsed.intro || {};
      const profileData = parsed.profile || {};
      const comicData = parsed.comicProject || parsed.comic || {};
      const commissionsData = parsed.commissionsConfig || parsed.commissions || {};
      const contactData = parsed.contactSettings || parsed.contact || {};

      return {
        ...defaultBundle,
        ...parsed,
        siteSettings: {
          ...defaultBundle.siteSettings,
          ...siteSettingsData,
          navLabels: {
            ...defaultBundle.siteSettings.navLabels,
            ...(siteSettingsData.navLabels || {}),
          },
          sectionVisibility: {
            ...defaultBundle.siteSettings.sectionVisibility,
            ...(siteSettingsData.sectionVisibility || {}),
          },
        },
        intro: {
          ...defaultBundle.intro,
          ...introData,
          heroArtwork: {
            ...defaultBundle.intro.heroArtwork,
            ...(introData.heroArtwork || {}),
          },
          ctaPrimary: {
            ...defaultBundle.intro.ctaPrimary,
            ...(introData.ctaPrimary || {}),
          },
          ctaSecondary: {
            ...defaultBundle.intro.ctaSecondary,
            ...(introData.ctaSecondary || {}),
          },
        },
        profile: {
          ...defaultBundle.profile,
          ...profileData,
          avatar: {
            ...defaultBundle.profile.avatar,
            ...(profileData.avatar || {}),
          },
          bioParagraphs: Array.isArray(profileData.bioParagraphs)
            ? profileData.bioParagraphs
            : defaultBundle.profile.bioParagraphs,
          styleThemes: Array.isArray(profileData.styleThemes)
            ? profileData.styleThemes
            : defaultBundle.profile.styleThemes,
          toolsUsed: Array.isArray(profileData.toolsUsed)
            ? profileData.toolsUsed
            : defaultBundle.profile.toolsUsed,
          facts: Array.isArray(profileData.facts) ? profileData.facts : defaultBundle.profile.facts,
          stats: Array.isArray(profileData.stats) ? profileData.stats : defaultBundle.profile.stats,
        },
        comicProject: {
          ...defaultBundle.comicProject,
          ...comicData,
        },
        commissionsConfig: {
          ...defaultBundle.commissionsConfig,
          ...commissionsData,
          tiers: (
            Array.isArray(parsed.commissionTiers)
              ? parsed.commissionTiers
              : Array.isArray(parsed.commission_tiers)
              ? parsed.commission_tiers
              : Array.isArray(commissionsData.tiers)
              ? commissionsData.tiers
              : defaultBundle.commissionTiers
          ).map((t: any, i: number) => ({
            ...t,
            id: t.id || `tier-${i + 1}`,
            name: t.name || `Tier ${i + 1}`,
            price: t.price || '$0',
            badge: t.badge || '',
            description: t.description || '',
            image: t.image || '/assets/tier-sketch.svg',
            turnaround: t.turnaround || '5-7 business days',
            features: Array.isArray(t.features)
              ? t.features
              : typeof t.features === 'string'
              ? t.features.split('\n').filter((l: string) => l.trim() !== '')
              : [],
            isPopular: Boolean(t.isPopular || t.is_popular),
            sortOrder: t.sortOrder ?? t.sort_order ?? i,
          })),
        },
        contactSettings: {
          ...defaultBundle.contactSettings,
          ...contactData,
          commissionTypes: Array.isArray(contactData.commissionTypes)
            ? contactData.commissionTypes
            : defaultBundle.contactSettings.commissionTypes,
        },
        categories: Array.isArray(parsed.categories) ? parsed.categories : defaultBundle.categories,
        artworks: Array.isArray(parsed.artworks)
          ? parsed.artworks.map((art: any, i: number) => ({
              ...art,
              featured: Boolean(art.featured),
              isVisible: art.isVisible !== false && art.is_visible !== false,
              sortOrder: art.sortOrder ?? art.sort_order ?? i,
            }))
          : defaultBundle.artworks,
        commissionTiers: (
          Array.isArray(parsed.commissionTiers)
            ? parsed.commissionTiers
            : Array.isArray(parsed.commission_tiers)
            ? parsed.commission_tiers
            : Array.isArray(commissionsData.tiers)
            ? commissionsData.tiers
            : defaultBundle.commissionTiers
        ).map((t: any, i: number) => ({
          ...t,
          id: t.id || `tier-${i + 1}`,
          name: t.name || `Tier ${i + 1}`,
          price: t.price || '$0',
          badge: t.badge || '',
          description: t.description || '',
          image: t.image || '/assets/tier-sketch.svg',
          turnaround: t.turnaround || '5-7 business days',
          features: Array.isArray(t.features)
            ? t.features
            : typeof t.features === 'string'
            ? t.features.split('\n').filter((l: string) => l.trim() !== '')
            : [],
          isPopular: Boolean(t.isPopular || t.is_popular),
          sortOrder: t.sortOrder ?? t.sort_order ?? i,
        })),
        commissionAddons: Array.isArray(parsed.commissionAddons)
          ? parsed.commissionAddons
          : defaultBundle.commissionAddons,
        commissionSteps: Array.isArray(parsed.commissionSteps)
          ? parsed.commissionSteps
          : defaultBundle.commissionSteps,
        commissionTos: Array.isArray(parsed.commissionTos) ? parsed.commissionTos : defaultBundle.commissionTos,
        commissionFaqs: Array.isArray(parsed.commissionFaqs)
          ? parsed.commissionFaqs
          : defaultBundle.commissionFaqs,
        socialLinks: Array.isArray(parsed.socialLinks) ? parsed.socialLinks : defaultBundle.socialLinks,
      };
    }
  } catch (e) {
    console.warn('Gagal membaca bundle lokal:', e);
  }
  return getDefaultBundle();
}

export function saveLocalBundle(bundle: WebsiteDataBundle): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bundle));
    }
  } catch (e: any) {
    console.warn('Gagal menyimpan bundle lokal ke localStorage:', e);
    // Jika melebihi kuota localStorage karena gambar base64, bersihkan riwayat revisi dan simpan ulang
    if (e?.name === 'QuotaExceededError' || e?.code === 22) {
      try {
        localStorage.removeItem(REVISIONS_STORAGE_KEY);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bundle));
      } catch (retryErr) {
        console.warn('Retry simpan bundle lokal gagal:', retryErr);
      }
    }
  }

  // Tetap berikan notifikasi pembaruan instan agar cache TanStack Query & view aplikasi langsung terupdate
  notifyContentUpdated(bundle);
}

// Revisions helper (stores last published copy for safe revert)
function saveRevisionSnapshot(area: AreaKey, data: unknown): void {
  try {
    const existingRaw = localStorage.getItem(REVISIONS_STORAGE_KEY);
    const existing = existingRaw ? JSON.parse(existingRaw) : {};
    existing[area] = {
      snapshot: data,
      publishedAt: new Date().toISOString(),
    };
    localStorage.setItem(REVISIONS_STORAGE_KEY, JSON.stringify(existing));
  } catch (e) {
    console.warn('Gagal menyimpan snapshot revisi:', e);
  }
}

function getRevisionSnapshot(area: AreaKey): unknown | null {
  try {
    const existingRaw = localStorage.getItem(REVISIONS_STORAGE_KEY);
    if (existingRaw) {
      const existing = JSON.parse(existingRaw);
      return existing[area]?.snapshot || null;
    }
  } catch (e) {
    console.warn('Gagal membaca snapshot revisi:', e);
  }
  return null;
}

/**
 * Fetch all content for public site or preview
 */
export async function getWebsiteContent(isPreview: boolean = false): Promise<WebsiteDataBundle> {
  if (isSupabaseConfigured && supabase) {
    try {
      // Fetch in parallel from Supabase
      const [
        siteRes,
        introRes,
        profileRes,
        categoriesRes,
        artworksRes,
        comicRes,
        commissionsRes,
        tiersRes,
        addonsRes,
        stepsRes,
        tosRes,
        faqsRes,
        contactRes,
        socialsRes,
      ] = await Promise.all([
        supabase.from('site_settings').select('*').single(),
        supabase.from('intro_section').select('*').single(),
        supabase.from('profile_section').select('*').single(),
        supabase.from('work_categories').select('*').order('sort_order', { ascending: true }),
        supabase.from('artworks').select('*').order('sort_order', { ascending: true }),
        supabase.from('comic_project').select('*').single(),
        supabase.from('commissions_config').select('*').single(),
        supabase.from('commission_tiers').select('*').order('sort_order', { ascending: true }),
        supabase.from('commission_addons').select('*').order('sort_order', { ascending: true }),
        supabase.from('commission_steps').select('*').order('sort_order', { ascending: true }),
        supabase.from('commission_tos').select('*').order('sort_order', { ascending: true }),
        supabase.from('commission_faqs').select('*').order('sort_order', { ascending: true }),
        supabase.from('contact_settings').select('*').single(),
        supabase.from('social_links').select('*').order('sort_order', { ascending: true }),
      ]);

      const bundle = getDefaultBundle();

      if (siteRes.data) {
        const row = siteRes.data;
        const sourceData = isPreview && row.draft_data ? row.draft_data : row;
        bundle.siteSettings = {
          id: 'default',
          artistName: sourceData.artist_name ?? bundle.siteSettings.artistName,
          artistKanji: sourceData.artist_kanji ?? bundle.siteSettings.artistKanji,
          siteTitle: sourceData.site_title ?? bundle.siteSettings.siteTitle,
          tagline: sourceData.tagline ?? bundle.siteSettings.tagline,
          metaDescription: sourceData.meta_description ?? bundle.siteSettings.metaDescription,
          ogImage: sourceData.og_image ?? bundle.siteSettings.ogImage,
          faviconSvg: sourceData.favicon_svg ?? bundle.siteSettings.faviconSvg,
          navLabels: sourceData.nav_labels ?? bundle.siteSettings.navLabels,
          sectionVisibility: sourceData.section_visibility ?? bundle.siteSettings.sectionVisibility,
          footerText: sourceData.footer_text ?? bundle.siteSettings.footerText,
          copyrightYear: sourceData.copyright_year ?? bundle.siteSettings.copyrightYear,
          hasUnpublishedChanges: row.has_unpublished_changes ?? false,
          publishedAt: row.published_at,
          updatedAt: row.updated_at,
        };
      }

      if (introRes.data) {
        const row = introRes.data;
        const sourceData = isPreview && row.draft_data ? row.draft_data : row;
        bundle.intro = {
          id: 'default',
          eyebrow: sourceData.eyebrow ?? bundle.intro.eyebrow,
          headline: sourceData.headline ?? bundle.intro.headline,
          bioSummary: sourceData.bio_summary ?? bundle.intro.bioSummary,
          heroArtwork: {
            src: sourceData.hero_image_src ?? bundle.intro.heroArtwork.src,
            alt: sourceData.hero_image_alt ?? bundle.intro.heroArtwork.alt,
            title: sourceData.hero_image_title ?? bundle.intro.heroArtwork.title,
            medium: sourceData.hero_image_medium ?? bundle.intro.heroArtwork.medium,
            year: sourceData.hero_image_year ?? bundle.intro.heroArtwork.year,
            focalX: sourceData.hero_image_focal_x ?? 50,
            focalY: sourceData.hero_image_focal_y ?? 50,
          },
          ctaPrimary: {
            label: sourceData.cta_primary_label ?? bundle.intro.ctaPrimary.label,
            href: sourceData.cta_primary_href ?? bundle.intro.ctaPrimary.href,
          },
          ctaSecondary: {
            label: sourceData.cta_secondary_label ?? bundle.intro.ctaSecondary.label,
            href: sourceData.cta_secondary_href ?? bundle.intro.ctaSecondary.href,
          },
          hasUnpublishedChanges: row.has_unpublished_changes ?? false,
          publishedAt: row.published_at,
          updatedAt: row.updated_at,
        };
      }

      if (profileRes.data) {
        const row = profileRes.data;
        const sourceData = isPreview && row.draft_data ? row.draft_data : row;
        bundle.profile = {
          id: 'default',
          sectionNumber: sourceData.section_number ?? bundle.profile.sectionNumber,
          title: sourceData.title ?? bundle.profile.title,
          artistName: sourceData.artist_name ?? bundle.profile.artistName,
          subtitle: sourceData.subtitle ?? bundle.profile.subtitle,
          avatar: {
            src: sourceData.avatar_src ?? bundle.profile.avatar.src,
            alt: sourceData.avatar_alt ?? bundle.profile.avatar.alt,
            caption: sourceData.avatar_caption ?? bundle.profile.avatar.caption,
          },
          bioParagraphs: sourceData.bio_paragraphs ?? bundle.profile.bioParagraphs,
          styleThemes: sourceData.style_themes ?? bundle.profile.styleThemes,
          toolsUsed: sourceData.tools_used ?? bundle.profile.toolsUsed,
          facts: sourceData.facts ?? bundle.profile.facts,
          stats: sourceData.stats ?? bundle.profile.stats,
          hasUnpublishedChanges: row.has_unpublished_changes ?? false,
          publishedAt: row.published_at,
          updatedAt: row.updated_at,
        };
      }

      if (categoriesRes.data && categoriesRes.data.length > 0) {
        bundle.categories = categoriesRes.data.map((c: any) => ({
          id: c.id,
          label: c.label,
          sortOrder: c.sort_order ?? 0,
        }));
      }

      if (artworksRes.data && artworksRes.data.length > 0) {
        bundle.artworks = artworksRes.data.map((art: any) => ({
          id: art.id,
          title: art.title,
          year: art.year,
          category: art.category,
          categoryLabel: art.category_label,
          image: art.image,
          thumbnail: art.thumbnail,
          aspectClass: art.aspect_class || 'aspect-[4/5]',
          description: art.description || '',
          medium: art.medium || 'Ink',
          dimensions: art.dimensions,
          featured: Boolean(art.featured),
          isVisible: Boolean(art.is_visible),
          sortOrder: art.sort_order ?? 0,
        }));
      }

      if (comicRes.data) {
        const row = comicRes.data;
        const sourceData = isPreview && row.draft_data ? row.draft_data : row;
        bundle.comicProject = {
          id: 'default',
          title: sourceData.title ?? bundle.comicProject.title,
          volume: sourceData.volume ?? bundle.comicProject.volume,
          subtitle: sourceData.subtitle ?? bundle.comicProject.subtitle,
          status: sourceData.status ?? bundle.comicProject.status,
          synopsis: sourceData.synopsis ?? bundle.comicProject.synopsis,
          genre: sourceData.genre ?? bundle.comicProject.genre,
          coverImage: sourceData.cover_image ?? bundle.comicProject.coverImage,
          currentChapter: sourceData.current_chapter ?? bundle.comicProject.currentChapter,
          releaseSchedule: sourceData.release_schedule ?? bundle.comicProject.releaseSchedule,
          readUrl: sourceData.read_url ?? bundle.comicProject.readUrl,
          notes: sourceData.notes ?? bundle.comicProject.notes,
          hasUnpublishedChanges: row.has_unpublished_changes ?? false,
          publishedAt: row.published_at,
          updatedAt: row.updated_at,
        };
      }

      if (commissionsRes.data) {
        const row = commissionsRes.data;
        const sourceData = isPreview && row.draft_data ? row.draft_data : row;
        bundle.commissionsConfig = {
          id: 'default',
          sectionNumber: sourceData.section_number ?? bundle.commissionsConfig.sectionNumber,
          title: sourceData.title ?? bundle.commissionsConfig.title,
          description: sourceData.description ?? bundle.commissionsConfig.description,
          isOpen: sourceData.is_open ?? bundle.commissionsConfig.isOpen,
          slotsTotal: sourceData.slots_total ?? bundle.commissionsConfig.slotsTotal,
          slotsAvailable: sourceData.slots_available ?? bundle.commissionsConfig.slotsAvailable,
          nextOpeningEstimate: sourceData.next_opening_estimate ?? bundle.commissionsConfig.nextOpeningEstimate,
          hasUnpublishedChanges: row.has_unpublished_changes ?? false,
          publishedAt: row.published_at,
          updatedAt: row.updated_at,
        };
      }

      if (tiersRes.data && tiersRes.data.length > 0) {
        bundle.commissionTiers = tiersRes.data.map((t: any) => ({
          id: t.id,
          name: t.name,
          price: t.price,
          badge: t.badge,
          description: t.description,
          image: t.image,
          turnaround: t.turnaround,
          features: t.features || [],
          isPopular: Boolean(t.is_popular),
          sortOrder: t.sort_order ?? 0,
        }));
      }

      if (addonsRes.data && addonsRes.data.length > 0) {
        bundle.commissionAddons = addonsRes.data.map((a: any) => ({
          id: a.id,
          name: a.name,
          price: a.price,
          note: a.note,
          sortOrder: a.sort_order ?? 0,
        }));
      }

      if (stepsRes.data && stepsRes.data.length > 0) {
        bundle.commissionSteps = stepsRes.data.map((s: any) => ({
          id: s.id,
          step: s.step,
          title: s.title,
          description: s.description,
          sortOrder: s.sort_order ?? 0,
        }));
      }

      if (tosRes.data && tosRes.data.length > 0) {
        bundle.commissionTos = tosRes.data.map((tos: any) => ({
          id: tos.id,
          title: tos.title,
          content: tos.content || [],
          sortOrder: tos.sort_order ?? 0,
        }));
      }

      if (faqsRes.data && faqsRes.data.length > 0) {
        bundle.commissionFaqs = faqsRes.data.map((f: any) => ({
          id: f.id,
          question: f.question,
          answer: f.answer,
          sortOrder: f.sort_order ?? 0,
        }));
      }

      if (contactRes.data) {
        const row = contactRes.data;
        const sourceData = isPreview && row.draft_data ? row.draft_data : row;
        bundle.contactSettings = {
          id: 'default',
          sectionNumber: sourceData.section_number ?? bundle.contactSettings.sectionNumber,
          title: sourceData.title ?? bundle.contactSettings.title,
          invitation: sourceData.invitation ?? bundle.contactSettings.invitation,
          subtext: sourceData.subtext ?? bundle.contactSettings.subtext,
          email: sourceData.email ?? bundle.contactSettings.email,
          availabilityNote: sourceData.availability_note ?? bundle.contactSettings.availabilityNote,
          commissionTypes: sourceData.commission_types ?? bundle.contactSettings.commissionTypes,
          hasUnpublishedChanges: row.has_unpublished_changes ?? false,
          publishedAt: row.published_at,
          updatedAt: row.updated_at,
        };
      }

      if (socialsRes.data && socialsRes.data.length > 0) {
        bundle.socialLinks = socialsRes.data.map((s: any) => ({
          id: s.id,
          platform: s.platform,
          name: s.name,
          handle: s.handle,
          url: s.url,
          iconName: s.icon_name || 'mail',
          isVisible: Boolean(s.is_visible),
          sortOrder: s.sort_order ?? 0,
        }));
      }

      return bundle;
    } catch (err) {
      console.warn('Supabase query error, falling back to local snapshot:', err);
    }
  }

  // Fallback: Local storage + defaults
  return getLocalBundle();
}

/**
 * Save draft for a specific area
 */
export async function saveAreaDraft(area: AreaKey, data: unknown): Promise<void> {
  // Update local bundle
  const local = getLocalBundle();
  const bundleKey = getBundleKeyForArea(area);
  
  const updatedSection = {
    ...(local as any)[bundleKey],
    ...(data as object),
    hasUnpublishedChanges: true,
  };

  (local as any)[bundleKey] = updatedSection;
  (local as any)[area] = updatedSection; // Keep alias in sync
  
  saveLocalBundle(local);

  if (isSupabaseConfigured && supabase) {
    const tableName = getTableNameForArea(area);
    if (tableName) {
      await supabase
        .from(tableName)
        .update({
          draft_data: data,
          has_unpublished_changes: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', 'default');
    }
  }
}

/**
 * Publish an area (moves draft to live published content, creates revision snapshot)
 */
export async function publishArea(area: AreaKey, data?: unknown): Promise<void> {
  const local = getLocalBundle();
  const bundleKey = getBundleKeyForArea(area);
  const currentData = data ?? (local as any)[bundleKey] ?? (local as any)[area];

  // Save revision snapshot for revert capability
  if (area === 'commissions') {
    saveRevisionSnapshot(area, {
      config: currentData,
      tiers: local.commissionTiers,
      addons: local.commissionAddons,
      steps: local.commissionSteps,
      tos: local.commissionTos,
      faqs: local.commissionFaqs,
    });
  } else {
    saveRevisionSnapshot(area, currentData);
  }

  const updatedSection = {
    ...currentData,
    hasUnpublishedChanges: false,
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  (local as any)[bundleKey] = updatedSection;
  (local as any)[area] = updatedSection; // Keep alias in sync

  saveLocalBundle(local);

  if (isSupabaseConfigured && supabase) {
    const tableName = getTableNameForArea(area);
    if (tableName) {
      const dbPayload = mapAreaToDbColumns(area, currentData);
      await supabase
        .from(tableName)
        .update({
          ...dbPayload,
          draft_data: null,
          has_unpublished_changes: false,
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', 'default');

      // Record revision
      try {
        await supabase.from('content_revisions').insert({
          area,
          snapshot: currentData,
        });
      } catch (revErr) {
        console.warn('Gagal mencatat content_revisions:', revErr);
      }
    }
  }
}

/**
 * Revert area to last published state
 */
export async function revertAreaToPublished(area: AreaKey): Promise<unknown | null> {
  const snapshot = getRevisionSnapshot(area);
  if (snapshot) {
    const local = getLocalBundle();
    const bundleKey = getBundleKeyForArea(area);

    if (area === 'commissions' && (snapshot as any).config) {
      const commSnap = snapshot as any;
      const revertedConfig = { ...(commSnap.config as object), hasUnpublishedChanges: false };
      local.commissionsConfig = revertedConfig as any;
      (local as any).commissions = revertedConfig;
      if (Array.isArray(commSnap.tiers)) {
        local.commissionTiers = commSnap.tiers;
        (local.commissionsConfig as any).tiers = commSnap.tiers;
      }
      if (Array.isArray(commSnap.addons)) local.commissionAddons = commSnap.addons;
      if (Array.isArray(commSnap.steps)) local.commissionSteps = commSnap.steps;
      if (Array.isArray(commSnap.tos)) local.commissionTos = commSnap.tos;
      if (Array.isArray(commSnap.faqs)) local.commissionFaqs = commSnap.faqs;
      saveLocalBundle(local);
      return revertedConfig;
    }

    const revertedSection = { ...(snapshot as object), hasUnpublishedChanges: false };

    (local as any)[bundleKey] = revertedSection;
    (local as any)[area] = revertedSection;

    saveLocalBundle(local);

    if (isSupabaseConfigured && supabase) {
      const tableName = getTableNameForArea(area);
      if (tableName) {
        await supabase
          .from(tableName)
          .update({
            draft_data: null,
            has_unpublished_changes: false,
            updated_at: new Date().toISOString(),
          })
          .eq('id', 'default');
      }
    }
    return snapshot;
  }
  return null;
}

/**
 * Contact Message Submission with honeypot & rate limit
 */
const lastSubmissionTimes: number[] = [];

export async function submitContactMessage(messageData: {
  name: string;
  email: string;
  commissionType: string;
  referenceUrl?: string;
  message: string;
  honeypot?: string;
}): Promise<void> {
  // Honeypot spam trap
  if (messageData.honeypot && messageData.honeypot.trim() !== '') {
    console.warn('Honeypot triggered, message dropped.');
    return;
  }

  // Simple client rate limit: max 3 submissions per minute
  const now = Date.now();
  const recent = lastSubmissionTimes.filter((t) => now - t < 60000);
  if (recent.length >= 3) {
    throw new Error('Terlalu banyak permintaan pesan dalam waktu singkat. Harap tunggu sejenak.');
  }
  lastSubmissionTimes.push(now);

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('contact_messages').insert({
      name: messageData.name.trim(),
      email: messageData.email.trim(),
      commission_type: messageData.commissionType,
      reference_url: messageData.referenceUrl?.trim() || null,
      message: messageData.message.trim(),
    });

    if (error) {
      throw new Error(`Gagal mengirim pesan: ${error.message}`);
    }
    return;
  }

  // Fallback to local storage inbox
  const currentMessages = getStoredMessages();
  currentMessages.unshift({
    id: `local-msg-${Date.now()}`,
    name: messageData.name,
    email: messageData.email,
    commissionType: messageData.commissionType,
    referenceUrl: messageData.referenceUrl || null,
    message: messageData.message,
    isRead: false,
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(currentMessages));
}

export function getStoredMessages(): ContactMessage[] {
  try {
    const raw = localStorage.getItem(MESSAGES_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Gagal membaca pesan lokal:', e);
  }
  return [];
}

/**
 * Works CRUD operations
 */
export async function saveArtwork(artwork: Artwork): Promise<void> {
  const local = getLocalBundle();
  const idx = local.artworks.findIndex((a) => a.id === artwork.id);
  if (idx >= 0) {
    local.artworks[idx] = artwork;
  } else {
    local.artworks.push(artwork);
  }
  saveLocalBundle(local);

  if (isSupabaseConfigured && supabase) {
    await supabase.from('artworks').upsert({
      id: artwork.id,
      title: artwork.title,
      year: artwork.year,
      category: artwork.category,
      category_label: artwork.categoryLabel,
      image: artwork.image,
      thumbnail: artwork.thumbnail,
      aspect_class: artwork.aspectClass,
      description: artwork.description,
      medium: artwork.medium,
      dimensions: artwork.dimensions,
      featured: artwork.featured,
      is_visible: artwork.isVisible,
      sort_order: artwork.sortOrder,
      updated_at: new Date().toISOString(),
    });
  }
}

export async function deleteArtwork(id: string): Promise<void> {
  const local = getLocalBundle();
  local.artworks = local.artworks.filter((a) => a.id !== id);
  saveLocalBundle(local);

  if (isSupabaseConfigured && supabase) {
    await supabase.from('artworks').delete().eq('id', id);
  }
}

export async function updateArtworksOrder(artworks: Artwork[]): Promise<void> {
  const local = getLocalBundle();
  local.artworks = artworks.map((a, i) => ({ ...a, sortOrder: i }));
  saveLocalBundle(local);

  if (isSupabaseConfigured && supabase) {
    for (let i = 0; i < artworks.length; i++) {
      await supabase.from('artworks').update({ sort_order: i }).eq('id', artworks[i].id);
    }
  }
}

/**
 * Work Categories CRUD
 */
export async function saveWorkCategories(categories: WorkCategoryItem[]): Promise<void> {
  const local = getLocalBundle();
  local.categories = categories;
  saveLocalBundle(local);

  if (isSupabaseConfigured && supabase) {
    for (const cat of categories) {
      await supabase.from('work_categories').upsert({
        id: cat.id,
        label: cat.label,
        sort_order: cat.sortOrder,
      });
    }
  }
}

export async function deleteWorkCategory(id: string): Promise<void> {
  const local = getLocalBundle();
  local.categories = local.categories.filter((c) => c.id !== id);
  saveLocalBundle(local);

  if (isSupabaseConfigured && supabase) {
    await supabase.from('work_categories').delete().eq('id', id);
  }
}

/**
 * Commission Tiers CRUD
 */
export async function saveCommissionTiers(tiers: CommissionTier[]): Promise<void> {
  const local = getLocalBundle();
  local.commissionTiers = tiers;
  if (local.commissionsConfig) {
    (local.commissionsConfig as any).tiers = tiers;
  }
  if ((local as any).commissions) {
    ((local as any).commissions as any).tiers = tiers;
  }

  // Auto-sync contactSettings.commissionTypes so contact form select dropdown stays updated
  if (local.contactSettings) {
    const tierOpts = tiers.map((t) => ({
      value: t.id,
      label: `${t.name} (${t.price})`,
    }));
    const extraOpts = (local.contactSettings.commissionTypes || []).filter(
      (opt) => !tiers.some((t) => t.id === opt.value)
    );
    local.contactSettings.commissionTypes = [
      ...tierOpts,
      ...(extraOpts.length > 0
        ? extraOpts
        : [
            { value: 'comic', label: 'Comic / Sequential Art Inquiry' },
            { value: 'other', label: 'Other / Commercial Inquiry' },
          ]),
    ];
  }

  saveLocalBundle(local);

  if (isSupabaseConfigured && supabase) {
    for (const tier of tiers) {
      await supabase.from('commission_tiers').upsert({
        id: tier.id,
        name: tier.name,
        price: tier.price,
        badge: tier.badge,
        description: tier.description,
        image: tier.image,
        turnaround: tier.turnaround,
        features: tier.features,
        is_popular: tier.isPopular,
        sort_order: tier.sortOrder,
        updated_at: new Date().toISOString(),
      });
    }
  }
}

export async function deleteCommissionTier(id: string): Promise<void> {
  const local = getLocalBundle();
  local.commissionTiers = local.commissionTiers.filter((t) => t.id !== id);
  if (local.commissionsConfig) {
    (local.commissionsConfig as any).tiers = local.commissionTiers;
  }
  if ((local as any).commissions) {
    ((local as any).commissions as any).tiers = local.commissionTiers;
  }
  if (local.contactSettings && Array.isArray(local.contactSettings.commissionTypes)) {
    local.contactSettings.commissionTypes = local.contactSettings.commissionTypes.filter(
      (opt) => opt.value !== id
    );
  }
  saveLocalBundle(local);

  if (isSupabaseConfigured && supabase) {
    await supabase.from('commission_tiers').delete().eq('id', id);
  }
}

/**
 * Add-ons & Steps & TOS CRUD
 */
export async function saveCommissionAddons(addons: AddOnItem[]): Promise<void> {
  const local = getLocalBundle();
  local.commissionAddons = addons;
  saveLocalBundle(local);
  if (isSupabaseConfigured && supabase) {
    for (const item of addons) {
      await supabase.from('commission_addons').upsert({
        id: item.id,
        name: item.name,
        price: item.price,
        note: item.note,
        sort_order: item.sortOrder,
      });
    }
  }
}

export async function saveCommissionSteps(steps: ProcessStep[]): Promise<void> {
  const local = getLocalBundle();
  local.commissionSteps = steps;
  saveLocalBundle(local);
  if (isSupabaseConfigured && supabase) {
    for (const s of steps) {
      await supabase.from('commission_steps').upsert({
        id: s.id,
        step: s.step,
        title: s.title,
        description: s.description,
        sort_order: s.sortOrder,
      });
    }
  }
}

export async function saveCommissionTos(tosList: TosItem[]): Promise<void> {
  const local = getLocalBundle();
  local.commissionTos = tosList;
  saveLocalBundle(local);
  if (isSupabaseConfigured && supabase) {
    for (const t of toList(tosList)) {
      await supabase.from('commission_tos').upsert({
        id: t.id,
        title: t.title,
        content: t.content,
        sort_order: t.sortOrder,
      });
    }
  }
}

function toList<T>(items: T[]): T[] {
  return items;
}

export async function saveCommissionFaqs(faqs: FaqItem[]): Promise<void> {
  const local = getLocalBundle();
  local.commissionFaqs = faqs;
  saveLocalBundle(local);
  if (isSupabaseConfigured && supabase) {
    for (const f of faqs) {
      await supabase.from('commission_faqs').upsert({
        id: f.id,
        question: f.question,
        answer: f.answer,
        sort_order: f.sortOrder,
      });
    }
  }
}

/**
 * Social Links CRUD
 */
export async function saveSocialLinks(links: SocialLinkItem[]): Promise<void> {
  const local = getLocalBundle();
  local.socialLinks = links;
  saveLocalBundle(local);
  if (isSupabaseConfigured && supabase) {
    for (const s of links) {
      await supabase.from('social_links').upsert({
        id: s.id,
        platform: s.platform,
        name: s.name,
        handle: s.handle,
        url: s.url,
        icon_name: s.iconName,
        is_visible: s.isVisible,
        sort_order: s.sortOrder,
      });
    }
  }
}

/**
 * Messages Inbox Operations
 */
export async function fetchMessages(): Promise<ContactMessage[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      return data.map((d: any) => ({
        id: d.id,
        name: d.name,
        email: d.email,
        commissionType: d.commission_type,
        referenceUrl: d.reference_url,
        message: d.message,
        isRead: Boolean(d.is_read),
        createdAt: d.created_at,
      }));
    }
  }
  return getStoredMessages();
}

export async function markMessageRead(id: string, isRead: boolean): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.from('contact_messages').update({ is_read: isRead }).eq('id', id);
  }
  const messages = getStoredMessages();
  const msg = messages.find((m) => m.id === id);
  if (msg) {
    msg.isRead = isRead;
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  }
}

export async function deleteMessage(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.from('contact_messages').delete().eq('id', id);
  }
  const messages = getStoredMessages().filter((m) => m.id !== id);
  localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
}

/**
 * Backup / Export & Import
 */
export async function exportAllContentAsJson(): Promise<string> {
  const bundle = await getWebsiteContent(true);
  const messages = await fetchMessages();
  const backupObject = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    bundle,
    messages,
  };
  return JSON.stringify(backupObject, null, 2);
}

export async function importAllContentFromJson(jsonString: string): Promise<void> {
  const parsed = JSON.parse(jsonString);
  if (!parsed.bundle) {
    throw new Error('Format berkas cadangan (backup) tidak valid.');
  }

  saveLocalBundle(parsed.bundle);

  if (Array.isArray(parsed.messages)) {
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(parsed.messages));
  }

  // If Supabase is connected, optionally sync all tables
  if (isSupabaseConfigured && supabase) {
    const b = parsed.bundle as WebsiteDataBundle;
    await Promise.all([
      publishArea('site_settings', b.siteSettings),
      publishArea('intro', b.intro),
      publishArea('profile', b.profile),
      publishArea('comic', b.comicProject),
      publishArea('commissions', b.commissionsConfig),
      publishArea('contact', b.contactSettings),
      saveWorkCategories(b.categories),
      saveCommissionTiers(b.commissionTiers),
      saveCommissionAddons(b.commissionAddons),
      saveCommissionSteps(b.commissionSteps),
      saveCommissionTos(b.commissionTos),
      saveCommissionFaqs(b.commissionFaqs),
      saveSocialLinks(b.socialLinks),
    ]);
    for (const art of b.artworks) {
      await saveArtwork(art);
    }
  }
}

// Helper mappings for Supabase table names and column names
function getTableNameForArea(area: AreaKey): string | null {
  switch (area) {
    case 'site_settings':
      return 'site_settings';
    case 'intro':
      return 'intro_section';
    case 'profile':
      return 'profile_section';
    case 'comic':
      return 'comic_project';
    case 'commissions':
      return 'commissions_config';
    case 'contact':
      return 'contact_settings';
    default:
      return null;
  }
}

function mapAreaToDbColumns(area: AreaKey, data: any): Record<string, unknown> {
  switch (area) {
    case 'site_settings':
      return {
        artist_name: data.artistName,
        artist_kanji: data.artistKanji,
        site_title: data.siteTitle,
        tagline: data.tagline,
        meta_description: data.metaDescription,
        og_image: data.ogImage,
        favicon_svg: data.faviconSvg,
        nav_labels: data.navLabels,
        section_visibility: data.sectionVisibility,
        footer_text: data.footerText,
        copyright_year: data.copyrightYear,
      };
    case 'intro':
      return {
        eyebrow: data.eyebrow,
        headline: data.headline,
        bio_summary: data.bioSummary,
        hero_image_src: data.heroArtwork?.src,
        hero_image_alt: data.heroArtwork?.alt,
        hero_image_title: data.heroArtwork?.title,
        hero_image_medium: data.heroArtwork?.medium,
        hero_image_year: data.heroArtwork?.year,
        hero_image_focal_x: data.heroArtwork?.focalX ?? 50,
        hero_image_focal_y: data.heroArtwork?.focalY ?? 50,
        cta_primary_label: data.ctaPrimary?.label,
        cta_primary_href: data.ctaPrimary?.href,
        cta_secondary_label: data.ctaSecondary?.label,
        cta_secondary_href: data.ctaSecondary?.href,
      };
    case 'profile':
      return {
        section_number: data.sectionNumber,
        title: data.title,
        artist_name: data.artistName,
        subtitle: data.subtitle,
        avatar_src: data.avatar?.src,
        avatar_alt: data.avatar?.alt,
        avatar_caption: data.avatar?.caption,
        bio_paragraphs: data.bioParagraphs,
        style_themes: data.styleThemes,
        tools_used: data.toolsUsed,
        facts: data.facts,
        stats: data.stats,
      };
    case 'comic':
      return {
        title: data.title,
        volume: data.volume,
        subtitle: data.subtitle,
        status: data.status,
        synopsis: data.synopsis,
        genre: data.genre,
        cover_image: data.coverImage,
        current_chapter: data.currentChapter,
        release_schedule: data.releaseSchedule,
        read_url: data.readUrl,
        notes: data.notes,
      };
    case 'commissions':
      return {
        section_number: data.sectionNumber,
        title: data.title,
        description: data.description,
        is_open: data.isOpen,
        slots_total: data.slotsTotal,
        slots_available: data.slotsAvailable,
        next_opening_estimate: data.nextOpeningEstimate,
      };
    case 'contact':
      return {
        section_number: data.sectionNumber,
        title: data.title,
        invitation: data.invitation,
        subtext: data.subtext,
        email: data.email,
        availability_note: data.availabilityNote,
        commission_types: data.commissionTypes,
      };
    default:
      return data;
  }
}
