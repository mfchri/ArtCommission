export interface IntroData {
  eyebrow: string;
  headline: string;
  bioSummary: string;
  heroArtwork: {
    src: string;
    alt: string;
    title: string;
    medium: string;
    year: string;
  };
  ctaPrimary: {
    label: string;
    href: string;
  };
  ctaSecondary: {
    label: string;
    href: string;
  };
}

export const introData: IntroData = {
  eyebrow: "Original Characters · Commissions · Comics",
  headline: "Drawing the worlds that live in my head.",
  bioSummary: "Illustrator exploring dark fantasy, silent monoliths, and fractured silhouettes. Welcome to my personal archive of characters, narratives, and ongoing ink projects.",
  heroArtwork: {
    src: "/assets/reference.png",
    alt: "Dark monochrome ink illustration of a pale long-haired figure with a clawed hand surrounded by jagged obsidian shards",
    title: "Vessel of Shards",
    medium: "Digital Inking & Sumi Wash",
    year: "2026",
  },
  ctaPrimary: {
    label: "View Works",
    href: "#works",
  },
  ctaSecondary: {
    label: "Commission Me",
    href: "#commissions",
  },
};
