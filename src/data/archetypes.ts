/**
 * Rezultatele posibile ale chestionarului.
 *
 * Pentru un rezultat nou:
 *   1. adaugă id-ul în ARCHETYPE_IDS;
 *   2. adaugă intrarea în ARCHETYPES (TypeScript nu compilează până nu o faci);
 *   3. dă-i puncte în opțiunile din src/data/quiz.ts.
 */
export const ARCHETYPE_IDS = ["organizator", "calator", "petrecaret", "design"] as const;

export type ArchetypeId = (typeof ARCHETYPE_IDS)[number];

export type Archetype = {
  id: ArchetypeId;
  /** Numele complet, afișat la rezultat */
  name: string;
  /** Numele scurt, afișat în bare și pe legitimație */
  short: string;
  emoji: string;
  tagline: string;
  description: string;
  /** Două culori hex pentru gradient, glow și confetti */
  colors: [string, string];
  superpowers: string[];
  whereInBest: string[];
  /** Statistici afișate pe legitimația BESTan (0–100) */
  stats: { label: string; value: number }[];
};

export const ARCHETYPES: Record<ArchetypeId, Archetype> = {
  organizator: {
    id: "organizator",
    name: "Organizatorul de evenimente",
    short: "Organizator",
    emoji: "📋",
    tagline: "Datorită ție, lucrurile chiar se întâmplă.",
    description:
      "Ai mereu un plan, și încă unul de rezervă. Îți place să transformi o idee într-un eveniment cu sute de participanți: bugete, sponsori, logistică, echipe. În BEST poți coordona proiecte precum JobShop® sau CodeRun.",
    colors: ["#fbbf24", "#f97316"],
    superpowers: ["Planificare impecabilă", "Leadership", "Negociere cu sponsori", "Calm sub presiune"],
    whereInBest: ["Core team la JobShop® sau CodeRun", "Coordonator de proiect", "Echipa de Fundraising"],
    stats: [
      { label: "Planificare", value: 97 },
      { label: "Leadership", value: 91 },
      { label: "Energie", value: 78 },
    ],
  },
  calator: {
    id: "calator",
    name: "BESTanul călător",
    short: "Călător",
    emoji: "✈️",
    tagline: "Pașaportul tău abia așteaptă ștampile noi.",
    description:
      "Ești curios, deschis și te simți acasă oriunde. BEST are 84 de grupuri locale în 30 de țări și tu vrei să le vezi pe toate: BEST Courses, evenimente internaționale, prieteni din toată Europa.",
    colors: ["#22d3ee", "#3b82f6"],
    superpowers: ["Adaptare rapidă", "Networking internațional", "Engleză fluentă", "Spirit de aventură"],
    whereInBest: ["BEST Courses în Europa", "Evenimente internaționale BEST", "Echipa de relații internaționale"],
    stats: [
      { label: "Curiozitate", value: 98 },
      { label: "Networking", value: 90 },
      { label: "Adaptare", value: 88 },
    ],
  },
  petrecaret: {
    id: "petrecaret",
    name: "BESTanul petrecăreț",
    short: "Petrecăreț",
    emoji: "🎉",
    tagline: "Oriunde apari tu, apare și atmosfera.",
    description:
      "Ai energie cât pentru o echipă întreagă și știi să aduni oamenii laolaltă. În BEST, prieteniile se leagă la evenimentele interne, la team-building-uri și la petrecerile de după proiecte, iar tu le dai viață.",
    colors: ["#e879f9", "#ec4899"],
    superpowers: ["Energie nelimitată", "Spirit de echipă", "Icebreaker-uri legendare", "DJ neoficial"],
    whereInBest: ["Evenimente interne și team-building", "Echipa de HR și integrarea bobocilor", "Petrecerile de final de proiect"],
    stats: [
      { label: "Energie", value: 99 },
      { label: "Carismă", value: 93 },
      { label: "Somn", value: 12 },
    ],
  },
  design: {
    id: "design",
    name: "BESTanul designer",
    short: "Design",
    emoji: "🎨",
    tagline: "Vezi lumea în culori, fonturi și pixeli.",
    description:
      "Observi imediat un font urât și ai mereu o idee pentru un vizual mai bun. În BEST dai identitate proiectelor: afișe, social media, merch, video și site-uri.",
    colors: ["#a3e635", "#10b981"],
    superpowers: ["Ochi pentru detalii", "Creativitate", "Figma și Photoshop", "Storytelling vizual"],
    whereInBest: ["Departamentul de PR & Design", "Social media pentru proiecte", "Merch, afișe și video"],
    stats: [
      { label: "Creativitate", value: 98 },
      { label: "Detalii", value: 94 },
      { label: "Estetică", value: 96 },
    ],
  },
};

export const archetypeGradient = (id: ArchetypeId, angle = 135) => {
  const [a, b] = ARCHETYPES[id].colors;
  return `linear-gradient(${angle}deg, ${a}, ${b})`;
};
