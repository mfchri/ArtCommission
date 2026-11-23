export interface StatItem {
  value: number;
  suffix?: string;
  label: string;
}

export interface FactItem {
  label: string;
  value: string;
}

export interface ProfileData {
  sectionNumber: string;
  title: string;
  artistName: string;
  subtitle: string;
  avatar: {
    src: string;
    alt: string;
    caption: string;
  };
  bioParagraphs: string[];
  styleThemes: string[];
  toolsUsed: string[];
  facts: FactItem[];
  stats: StatItem[];
}

export const profileData: ProfileData = {
  sectionNumber: "01 — PROFILE",
  title: "About the Artist",
  artistName: "KAIEN",
  subtitle: "Independent Character Designer & Comic Illustrator",
  avatar: {
    src: "/assets/avatar.svg",
    alt: "Stylized portrait of Kaien in ink brushwork",
    caption: "KAIEN // Inking at the atelier",
  },
  bioParagraphs: [
    "Hi, I'm Kaien. I spend most of my waking hours translating imaginary entities and atmospheric mythologies onto the page. My work is anchored in heavy contrast, gestural brushwork, and the tactile tension between raw ink and quiet negative space.",
    "I believe every original character carries a quiet narrative before a single word is written. Beyond client commissions, I am currently scripting and illustrating 'Echoes of the Abyss', a serialized dark fantasy graphic novel chronicling the remnants of a shattered sun."
  ],
  styleThemes: [
    "Dark Fantasy",
    "Monochrome Ink",
    "Eldritch OCs",
    "Chiaroscuro",
    "Anatomy & Hands",
    "Graphic Novel Aesthetic",
    "Jagged Shards",
    "Atmospheric Halftones"
  ],
  toolsUsed: [
    "Clip Studio Paint EX",
    "Maru & G-Pen Nibs",
    "Kuretake Sumi Ink",
    "iPad Pro + Procreate",
    "Arches 300gsm Paper"
  ],
  facts: [
    { label: "Based in", value: "Tokyo / Kyoto, JP" },
    { label: "Years drawing", value: "10+ Years" },
    { label: "Languages", value: "English, Japanese" },
    { label: "Current Obsession", value: "Obsidian shards & gothic architecture" },
  ],
  stats: [
    { value: 48, suffix: "+", label: "OCs Created" },
    { value: 180, suffix: "+", label: "Commissions Done" },
    { value: 14, suffix: "", label: "Comic Chapters" },
    { value: 8, suffix: " yrs", label: "Self-Published" },
  ],
};
