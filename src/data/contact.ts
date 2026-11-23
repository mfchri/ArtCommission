export interface ContactOption {
  type: string;
  value: string;
  description: string;
}

export interface ContactData {
  sectionNumber: string;
  title: string;
  invitation: string;
  subtext: string;
  email: string;
  availabilityNote: string;
  commissionTypes: { value: string; label: string }[];
  budgetOptions: { value: string; label: string }[];
}

export const contactData: ContactData = {
  sectionNumber: "04 — CONTACT",
  title: "Initiate an Inquiry",
  invitation: "Have an original character waiting to be brought to life, or interested in a commercial collaboration? Send a message below.",
  subtext: "For standard commissions, please include character references and a brief description of the mood. For publishing or comic inquiries, feel free to pitch directly.",
  email: "kaien.atelier@example.com",
  availabilityNote: "Currently accepting inquiries for Batch 01. Typical response window: 24–48 hours.",
  commissionTypes: [
    { value: "sketch", label: "Rough Ink Sketch ($65+)" },
    { value: "lineart", label: "Clean Line Art & Halftones ($130+)" },
    { value: "render", label: "Full Illustrative Render ($240+)" },
    { value: "comic", label: "Comic / Sequential Project" },
    { value: "commercial", label: "Commercial / Book Cover Licensing" },
    { value: "other", label: "Other / General Question" },
  ],
  budgetOptions: [
    { value: "under-100", label: "Under $100 USD" },
    { value: "100-250", label: "$100 – $250 USD" },
    { value: "250-500", label: "$250 – $500 USD" },
    { value: "500-plus", label: "$500+ USD" },
  ],
};
