import type { ArchetypeId } from "./archetypes";

/** Puncte acordate de un răspuns. Arhetipurile lipsă primesc 0. */
export type Scores = Partial<Record<ArchetypeId, number>>;

export type ChoiceOption = { id: string; label: string; emoji: string; scores: Scores };

export type QuestionStep = {
  kind: "question";
  id: string;
  /** "cards" = carduri cu text, "emoji" = grilă de emoji-uri mari */
  variant: "cards" | "emoji";
  prompt: string;
  hint?: string;
  options: ChoiceOption[];
};

export type SwipeStep = {
  kind: "swipe";
  id: string;
  prompt: string;
  hint?: string;
  /** Glisarea la dreapta (DA) acordă punctele; la stânga (NU) nu acordă nimic. */
  statements: { id: string; text: string; emoji: string; scores: Scores }[];
};

export type PackGameStep = {
  kind: "game";
  game: "pack";
  id: string;
  title: string;
  story: string;
  capacity: number;
  items: { id: string; label: string; emoji: string; scores: Scores }[];
};

export type CatchGameStep = {
  kind: "game";
  game: "catch";
  id: string;
  title: string;
  story: string;
  durationSec: number;
  /** Puncte de arhetip pentru fiecare obiect prins */
  pointsPerCatch: number;
  /** Plafonul de puncte de arhetip, ca jocul să nu decidă singur rezultatul */
  maxPointsPerArchetype: number;
  items: { emoji: string; archetype: ArchetypeId }[];
  hazards: { emoji: string; label: string }[];
};

export type QuizStep = QuestionStep | SwipeStep | PackGameStep | CatchGameStep;

export const QUIZ_STEPS: QuizStep[] = [
  {
    kind: "question",
    id: "vineri",
    variant: "cards",
    prompt: "E vineri seara. Unde te găsim?",
    options: [
      { id: "plan", label: "Fac planul pentru tot weekendul, cu Excel cu tot", emoji: "📅", scores: { organizator: 3 } },
      { id: "tren", label: "În tren, spre un oraș în care n-am mai fost", emoji: "🚆", scores: { calator: 3 } },
      { id: "muzica", label: "Unde e muzica cea mai tare", emoji: "🪩", scores: { petrecaret: 3 } },
      { id: "creativ", label: "Acasă, lucrez la un proiect creativ", emoji: "🖌️", scores: { design: 3 } },
    ],
  },
  {
    kind: "swipe",
    id: "da-nu",
    prompt: "Da sau nu? Glisează!",
    hint: "Dreapta = DA · Stânga = NU",
    statements: [
      { id: "calendar", text: "Am un Google Calendar colorat pe categorii.", emoji: "🗓️", scores: { organizator: 2 } },
      { id: "pasaport", text: "Am mai multe ștampile în pașaport decât note în carnet.", emoji: "🛂", scores: { calator: 2 } },
      { id: "versuri", text: "Știu versurile la toate piesele de la petreceri.", emoji: "🎤", scores: { petrecaret: 2 } },
      { id: "font", text: "Observ imediat când un afiș e scris cu Comic Sans.", emoji: "🔠", scores: { design: 2 } },
      { id: "grup", text: "Eu fac mereu grupul de WhatsApp pentru ieșiri.", emoji: "💬", scores: { organizator: 1, petrecaret: 1 } },
    ],
  },
  {
    kind: "game",
    game: "pack",
    id: "rucsac",
    title: "Fă-ți bagajul!",
    story: "Ai fost acceptat la un BEST Course în Portugalia 🇵🇹 În rucsac ai loc doar pentru 3 lucruri. Ce iei?",
    capacity: 3,
    items: [
      { id: "laptop", label: "Laptop", emoji: "💻", scores: { organizator: 1, design: 1 } },
      { id: "pasaport", label: "Pașaport", emoji: "🛂", scores: { calator: 2 } },
      { id: "boxa", label: "Boxă portabilă", emoji: "🔊", scores: { petrecaret: 2 } },
      { id: "sketchbook", label: "Sketchbook", emoji: "✏️", scores: { design: 2 } },
      { id: "agenda", label: "Agendă", emoji: "📓", scores: { organizator: 2 } },
      { id: "camera", label: "Cameră foto", emoji: "📷", scores: { design: 1, calator: 1 } },
      { id: "harta", label: "Hartă", emoji: "🗺️", scores: { calator: 2 } },
      { id: "confetti", label: "Confetti", emoji: "🎊", scores: { petrecaret: 2 } },
    ],
  },
  {
    kind: "question",
    id: "superputere",
    variant: "cards",
    prompt: "Care e superputerea ta într-o echipă?",
    options: [
      { id: "directie", label: "Îi țin pe toți pe drumul cel bun", emoji: "🧭", scores: { organizator: 3 } },
      { id: "cunostinte", label: "Fac cunoștință cu oricine, oriunde", emoji: "🌍", scores: { calator: 3 } },
      { id: "moral", label: "Ridic moralul echipei când e greu", emoji: "⚡", scores: { petrecaret: 3 } },
      { id: "wow", label: "Fac orice să arate WOW", emoji: "✨", scores: { design: 3 } },
    ],
  },
  {
    kind: "question",
    id: "emoji",
    variant: "emoji",
    prompt: "Alege emoji-ul care te descrie cel mai bine",
    options: [
      { id: "nerd", label: "Mereu pregătit", emoji: "🤓", scores: { organizator: 2 } },
      { id: "valiza", label: "Mereu pe drum", emoji: "🧳", scores: { calator: 2 } },
      { id: "party", label: "Mereu la petrecere", emoji: "🥳", scores: { petrecaret: 2 } },
      { id: "unicorn", label: "Mereu original", emoji: "🦄", scores: { design: 2 } },
      { id: "racheta", label: "Mereu în mișcare", emoji: "🚀", scores: { organizator: 1, calator: 1 } },
      { id: "foc", label: "Mereu în priză", emoji: "🔥", scores: { petrecaret: 1, design: 1 } },
    ],
  },
  {
    kind: "game",
    game: "catch",
    id: "prinde",
    title: "Prinde-le pe toate!",
    story: "Prinde tot ce îți place și ferește-te de restanțe 💣. Ai 20 de secunde!",
    durationSec: 20,
    pointsPerCatch: 0.5,
    maxPointsPerArchetype: 3,
    items: [
      { emoji: "📋", archetype: "organizator" },
      { emoji: "📅", archetype: "organizator" },
      { emoji: "✈️", archetype: "calator" },
      { emoji: "🌍", archetype: "calator" },
      { emoji: "🎉", archetype: "petrecaret" },
      { emoji: "🪩", archetype: "petrecaret" },
      { emoji: "🎨", archetype: "design" },
      { emoji: "✏️", archetype: "design" },
    ],
    hazards: [{ emoji: "💣", label: "Restanță" }],
  },
  {
    kind: "question",
    id: "instagram",
    variant: "cards",
    prompt: "Ce găsim pe Instagramul tău?",
    options: [
      { id: "evenimente", label: "Poze de la evenimentele pe care le-am organizat", emoji: "🎤", scores: { organizator: 3 } },
      { id: "apusuri", label: "Apusuri din 10 țări diferite", emoji: "🌅", scores: { calator: 3 } },
      { id: "story", label: "Story-uri de la petreceri, până la 4 dimineața", emoji: "🌙", scores: { petrecaret: 3 } },
      { id: "feed", label: "Un feed aranjat pe culori", emoji: "🎨", scores: { design: 3 } },
    ],
  },
  {
    kind: "question",
    id: "criza",
    variant: "cards",
    prompt: "Cu o zi înainte de eveniment apare o problemă. Tu…",
    options: [
      { id: "plan", label: "Fac un plan de criză în 5 minute", emoji: "🚨", scores: { organizator: 3 } },
      { id: "suna", label: "Sun pe cineva din alt oraș care a mai trecut prin asta", emoji: "📞", scores: { calator: 2, organizator: 1 } },
      { id: "pizza", label: "Comand pizza și țin moralul sus", emoji: "🍕", scores: { petrecaret: 3 } },
      { id: "vizual", label: "Refac tot vizualul peste noapte", emoji: "🖥️", scores: { design: 3 } },
    ],
  },
];
