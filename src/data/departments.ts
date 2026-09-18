/**
 * Echipele din BEST Cluj-Napoca. Structura e placeholder.
 * TODO: înlocuiește cu departamentele reale.
 */
export type Department = { id: string; name: string; emoji: string; color: string; text: string; skills: string[] };

export const DEPARTMENTS: Department[] = [
  {
    id: "it",
    name: "IT",
    emoji: "💻",
    color: "#22d3ee",
    text: "Construiești site-urile proiectelor, automatizezi procese și ai grijă de infrastructură.",
    skills: ["Web dev", "Automatizări", "Cloud"],
  },
  {
    id: "pr",
    name: "PR & Design",
    emoji: "🎨",
    color: "#a3e635",
    text: "Dai identitate proiectelor: afișe, social media, video și merch.",
    skills: ["Figma", "Social media", "Copywriting"],
  },
  {
    id: "fr",
    name: "Fundraising",
    emoji: "🤝",
    color: "#fbbf24",
    text: "Discuți cu firmele, negociezi parteneriate și aduci resursele care fac posibile proiectele.",
    skills: ["Negociere", "Comunicare", "Business"],
  },
  {
    id: "hr",
    name: "HR",
    emoji: "🫂",
    color: "#e879f9",
    text: "Ai grijă de oameni: recrutări, integrarea bobocilor, traininguri și team-building-uri.",
    skills: ["Empatie", "Facilitare", "Organizare"],
  },
  {
    id: "proiecte",
    name: "Proiecte",
    emoji: "🚀",
    color: "#a26cff",
    text: "Faci parte din core team-ul unui eveniment și îl duci de la idee la sute de participanți.",
    skills: ["Management", "Logistică", "Leadership"],
  },
  {
    id: "international",
    name: "Internațional",
    emoji: "🌍",
    color: "#60a5fa",
    text: "Ții legătura cu cele 84 de grupuri locale și cu evenimentele BEST din Europa.",
    skills: ["Engleză", "Networking", "Diplomație"],
  },
];
