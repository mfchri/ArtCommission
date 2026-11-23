export type ArtworkCategory = 'all' | 'oc' | 'comic' | 'commissions' | 'sketches';

export interface CategoryTab {
  id: ArtworkCategory;
  label: string;
}

export interface Artwork {
  id: string;
  title: string;
  year: string;
  category: 'oc' | 'comic' | 'commissions' | 'sketches';
  categoryLabel: string;
  image: string;
  aspectClass: string; // for masonry / uneven grid
  description: string;
  medium: string;
  dimensions?: string;
  featured?: boolean;
}

export interface ComicProject {
  id: string;
  title: string;
  volume: string;
  subtitle: string;
  status: 'Ongoing' | 'Completed' | 'Hiatus';
  synopsis: string;
  genre: string[];
  coverImage: string;
  currentChapter: string;
  releaseSchedule: string;
  readUrl: string;
  notes: string;
}

export interface WorksSectionData {
  sectionNumber: string;
  title: string;
  description: string;
  categories: CategoryTab[];
  comicProject: ComicProject;
  artworks: Artwork[];
}

export const worksData: WorksSectionData = {
  sectionNumber: "02 — WORKS",
  title: "Selected Archives",
  description: "A curated collection of original character designs, comic sequential art, and commissioned pieces executed in monochromatic ink and digital chiaroscuro.",
  categories: [
    { id: 'all', label: 'All Works' },
    { id: 'oc', label: 'Original Characters' },
    { id: 'comic', label: 'Comic Project' },
    { id: 'commissions', label: 'Commissions' },
    { id: 'sketches', label: 'Sketches' },
  ],
  comicProject: {
    id: "echoes-of-the-abyss",
    title: "ECHOES OF THE ABYSS",
    volume: "Volume I: Fractured Dawn",
    subtitle: "A serialized dark fantasy graphic novel",
    status: "Ongoing",
    synopsis: "In a world where the sun fractured into floating shards of obsidian, an amnesiac knight and a mute seer traverse desolate ash plains in search of the Core. Illustrated entirely in high-contrast ink lineart and atmospheric screentones.",
    genre: ["Dark Fantasy", "Supernatural", "Psychological Drama", "Horror"],
    coverImage: "/assets/comic-cover.svg",
    currentChapter: "Chapter 14: The Whispering Monolith",
    releaseSchedule: "Monthly serialized release on Webtoon & Gumroad",
    readUrl: "#contact", // or external placeholder
    notes: "Over 240+ pages completed to date. Physical book edition currently in production.",
  },
  artworks: [
    {
      id: "vessel-of-shards",
      title: "Vessel of Shards",
      year: "2026",
      category: "oc",
      categoryLabel: "Original Character",
      image: "/assets/reference.png",
      aspectClass: "aspect-[4/5] sm:aspect-[3/4]",
      description: "Hero artwork visual exploration. An eldritch entity bound to razor shards of obsidian and pale light. Rendered with textured brush inking and aggressive cross-hatching.",
      medium: "Rough Ink & Sumi Wash",
      dimensions: "4000 × 4000 px",
      featured: true,
    },
    {
      id: "echoes-cover-vol1",
      title: "Echoes of the Abyss — Cover Vol. I",
      year: "2025",
      category: "comic",
      categoryLabel: "Comic Project",
      image: "/assets/comic-cover.svg",
      aspectClass: "aspect-[3/4]",
      description: "Official cover illustration for Act One. Emphasizes the celestial eclipse and the towering silhouette of the hollow monarch.",
      medium: "Manga Inking & Screentone",
      dimensions: "2400 × 3400 px",
      featured: true,
    },
    {
      id: "the-blind-oracle",
      title: "The Blind Oracle (OC: Vesper)",
      year: "2026",
      category: "oc",
      categoryLabel: "Original Character",
      image: "/assets/artwork-oc-1.svg",
      aspectClass: "aspect-[4/5]",
      description: "Character concept for Vesper, a seer who sacrificed vision to perceive the fractured dimensional threads. Flowing hair and floating obsidian mirrors.",
      medium: "Digital Brush & Halftones",
      dimensions: "3500 × 4500 px",
    },
    {
      id: "clawed-hand-studies",
      title: "Extensor Tendon Anatomy Studies",
      year: "2026",
      category: "sketches",
      categoryLabel: "Sketches",
      image: "/assets/artwork-sketch-1.svg",
      aspectClass: "aspect-square",
      description: "Anatomical explorations of monstrous, elongated claws and tension points. Study for character transformations in Chapter 12.",
      medium: "Graphite & Maru-pen Nib",
      dimensions: "2800 × 2800 px",
    },
    {
      id: "lord-of-crows",
      title: "Lord of Crows (Custom Commission)",
      year: "2025",
      category: "commissions",
      categoryLabel: "Commission",
      image: "/assets/artwork-comm-1.svg",
      aspectClass: "aspect-[4/5]",
      description: "Private client commission for a tabletop RPG villain. Features a feathered crow mask, broad wing silhouette, and antique velvet frock coat.",
      medium: "Full Digital Render",
      dimensions: "3200 × 4000 px",
    },
    {
      id: "wanderer-of-ash",
      title: "Wanderer of the Ash Plains (OC: Kael)",
      year: "2025",
      category: "oc",
      categoryLabel: "Original Character",
      image: "/assets/artwork-oc-2.svg",
      aspectClass: "aspect-square sm:aspect-[4/3]",
      description: "Environmental character concept depicting the lone pilgrim crossing the gray dunes under a desolate twilight sky.",
      medium: "Ink Wash on Toned Board",
      dimensions: "3000 × 3000 px",
    },
    {
      id: "monolith-sentinel",
      title: "The Monolith Sentinel (Concept Sketch)",
      year: "2026",
      category: "sketches",
      categoryLabel: "Sketches",
      image: "/assets/artwork-sketch-2.svg",
      aspectClass: "aspect-[3/4]",
      description: "Scale and structure study for ancient guardian automatons entombed beneath the sunken necropolis.",
      medium: "Technical Ink & Screentone",
      dimensions: "2800 × 3600 px",
    },
    {
      id: "astral-huntress",
      title: "Astral Huntress (Custom Commission)",
      year: "2026",
      category: "commissions",
      categoryLabel: "Commission",
      image: "/assets/artwork-comm-2.svg",
      aspectClass: "aspect-[4/5]",
      description: "Private character commission. An archer wielding an ethereal bow fashioned from celestial light and bone.",
      medium: "Full Digital Line & Light",
      dimensions: "3200 × 4000 px",
    },
  ],
};
