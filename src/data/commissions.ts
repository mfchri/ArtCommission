export interface CommissionTier {
  id: string;
  name: string;
  price: string;
  badge?: string;
  description: string;
  image: string;
  turnaround: string;
  features: string[];
  isPopular?: boolean;
}

export interface AddOnItem {
  name: string;
  price: string;
  note?: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface TosItem {
  id: string;
  title: string;
  content: string[];
}

export interface CommissionsConfig {
  sectionNumber: string;
  title: string;
  description: string;
  isOpen: boolean; // toggle this to open/close commissions
  slotsTotal: number;
  slotsAvailable: number;
  nextOpeningEstimate: string;
  tiers: CommissionTier[];
  addOns: AddOnItem[];
  processSteps: ProcessStep[];
  termsOfService: TosItem[];
}

export const commissionsConfig: CommissionsConfig = {
  sectionNumber: "03 — COMMISSIONS",
  title: "Open Commissions",
  description: "I take a limited number of custom commissions each month to ensure dedicated attention to every piece. Below you will find current availability, pricing tiers, and guidelines.",
  isOpen: true, // Switch to false to display "Closed" state and disable CTA
  slotsTotal: 5,
  slotsAvailable: 3,
  nextOpeningEstimate: "Batch 02 opening in December 2026",
  tiers: [
    {
      id: "sketch",
      name: "Rough Ink Sketch",
      price: "$65 USD",
      description: "Loose, dynamic pencil and ink sketch focusing on posture, expression, and kinetic energy.",
      image: "/assets/tier-sketch.svg",
      turnaround: "5 – 7 business days",
      features: [
        "Bust or waist-up character framing",
        "Raw graphite / ink brush textures",
        "Tonal monochrome wash",
        "1 round of pose adjustments",
        "High-res 300 DPI PNG & JPG"
      ],
      isPopular: false,
    },
    {
      id: "lineart",
      name: "Clean Line Art & Tone",
      price: "$130 USD",
      badge: "Most Popular",
      description: "Precision inking inspired by manga masters, featuring detailed hatching, spot blacks, and classic screentones.",
      image: "/assets/tier-lineart.svg",
      turnaround: "10 – 14 business days",
      features: [
        "Full body or dynamic 3/4 action pose",
        "Crisp weighted lines & manga halftones",
        "Transparent PNG + print-ready file",
        "2 revision checkpoints (sketch & ink)",
        "Suitable for avatar, poster, or card print"
      ],
      isPopular: true,
    },
    {
      id: "render",
      name: "Full Illustrative Render",
      price: "$240 USD",
      description: "A complete, cinematic character artwork with dramatic chiaroscuro lighting, floating shards, and textural ambiance.",
      image: "/assets/tier-render.svg",
      turnaround: "3 – 4 weeks",
      features: [
        "Elaborate character design with props/weapons",
        "Atmospheric lighting & particle VFX",
        "Subtle scenic vignette or themed background",
        "3 milestone revisions (sketch, lines, final light)",
        "Includes full-res PSD with separated layers"
      ],
      isPopular: false,
    },
  ],
  addOns: [
    {
      name: "Additional Character",
      price: "+75% of base tier price",
      note: "Per extra subject in the same composition",
    },
    {
      name: "Complex Background / Architecture",
      price: "+$60 – $120 USD",
      note: "Gothic interiors, crumbling monoliths, or landscapes",
    },
    {
      name: "Commercial Use License",
      price: "+100% of base tier price",
      note: "For merch, book covers, games, or streaming branding",
    },
    {
      name: "Rush Order Delivery",
      price: "+50% of base tier price",
      note: "Guaranteed turnaround within 4 business days",
    },
    {
      name: "Detailed Weapon / Eldritch Pet",
      price: "+$30 USD",
      note: "Ornate scythes, demonic companions, or complex armor",
    },
  ],
  processSteps: [
    {
      step: "01",
      title: "Inquiry & Brief",
      description: "Submit the request form below with character visual references, desired tier, and any specific mood or pose notes.",
    },
    {
      step: "02",
      title: "Quote & 50% Deposit",
      description: "I will review your request and send an itemized invoice. A 50% upfront deposit locks your slot on the board.",
    },
    {
      step: "03",
      title: "WIP Feedback",
      description: "You receive progress snapshots at key milestones (composition thumbnail, rough sketch, clean lines) for approval.",
    },
    {
      step: "04",
      title: "Final Delivery",
      description: "Upon settlement of the final invoice, full-resolution 300 DPI files, transparent PNGs, and print assets are delivered via Drive.",
    },
  ],
  termsOfService: [
    {
      id: "scope",
      title: "What I Draw & What I Do Not Draw",
      content: [
        "WILL DRAW: Original Characters (OCs), fantasy/sci-fi personas, dark fantasy entities, horned/clawed humanoids, selective fanart, armor, flowing hair, gothic fashion, and atmospheric scenes.",
        "WILL NOT DRAW: Heavy gore/mutilation, explicit NSFW/pornography, mecha/complex vehicles, hateful/offensive themes, or mimicry of other artists' personal styles."
      ],
    },
    {
      id: "payment",
      title: "Payment, Invoicing & Deadlines",
      content: [
        "All payments are in USD handled securely through PayPal invoice or Stripe.",
        "A 50% non-refundable deposit is required to commence work. The remaining 50% is due upon presentation of the watermarked final preview before final file delivery.",
        "Turnaround times are estimates and begin once the deposit and all character references are confirmed."
      ],
    },
    {
      id: "revisions",
      title: "Revision Policy",
      content: [
        "Up to 2 major revisions are permitted free of charge during the initial sketch stage (pose, costume silhouette, composition).",
        "Minor adjustments (facial expressions, line weights) are included in the inking stage.",
        "Changes requested after line art completion or complete pose changes will incur an additional fee commensurate with the work required."
      ],
    },
    {
      id: "rights",
      title: "Copyright & Usage Rights",
      content: [
        "The artist (KAIEN) retains all moral rights and intellectual property copyright over the illustration, including the right to display the piece in portfolios, art books, and social archives.",
        "The client receives personal, non-commercial display rights (personal avatars, desktop wallpapers, social media sharing with artist credit).",
        "Commercial use (merchandise, monetized streaming, album covers, game assets) requires a commercial license upgrade specified prior to project kickoff."
      ],
    },
    {
      id: "cancellation",
      title: "Cancellation & Refund Policy",
      content: [
        "If the artist is unable to complete the commission due to unforeseen circumstances, a 100% full refund will be immediately issued.",
        "If the client cancels before work has commenced, a full refund minus payment processing fees will be granted.",
        "If the client cancels after the sketch phase has begun, the 50% deposit is retained to cover labor expended."
      ],
    },
  ],
};
