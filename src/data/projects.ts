/**
 * Proiectele BEST Cluj-Napoca. Numele și linkurile sunt de pe bestcj.ro,
 * descrierile sunt placeholder.
 * TODO: verifică pe bestcj.ro și completează descrierile reale.
 */
export type ProjectIcon = "briefcase" | "code" | "plane" | "book" | "sparkles";

export type Project = {
  id: string;
  name: string;
  tagline: string;
  tag: string;
  icon: ProjectIcon;
  color: string;
  description: string;
  forWho: string;
  url?: string;
  /** Textul scurt folosit în jocul memory */
  hint: { emoji: string; text: string };
};

export const PROJECTS: Project[] = [
  {
    id: "jobshop",
    name: "JobShop®",
    tagline: "Cariera ta începe aici",
    tag: "Carieră",
    icon: "briefcase",
    color: "#fbbf24",
    description:
      "Evenimentul de carieră al BEST Cluj: companii, workshop-uri, simulări de interviu și CV-uri revizuite de recrutori. (TODO)",
    forWho: "Studenții care vor un internship sau primul job",
    url: "https://js.bestcj.ro",
    hint: { emoji: "💼", text: "Carieră și companii" },
  },
  {
    id: "coderun",
    name: "CodeRun",
    tagline: "Competiție de programare",
    tag: "Competiție",
    icon: "code",
    color: "#22d3ee",
    description:
      "Echipe de studenți rezolvă probleme de algoritmică contra cronometru. Premii, pizza și multă cafea. (TODO)",
    forWho: "Pasionații de algoritmi și cod",
    url: "https://coderun.bestcj.ro",
    hint: { emoji: "⌨️", text: "Programare contra cronometru" },
  },
  {
    id: "courses",
    name: "BEST Courses",
    tagline: "Cursuri în toată Europa",
    tag: "Internațional",
    icon: "plane",
    color: "#a3e635",
    description:
      "Cursuri tehnice de 1–2 săptămâni în orașe din toată Europa, alături de studenți din zeci de țări. (TODO)",
    forWho: "Oricine vrea să învețe și să călătorească",
    url: "https://courses.bestcj.ro",
    hint: { emoji: "✈️", text: "Cursuri prin Europa" },
  },
  {
    id: "ghid",
    name: "Ghidul Bobocului",
    tagline: "Supraviețuiește anului I",
    tag: "Boboci",
    icon: "book",
    color: "#c4a1ff",
    description:
      "Tot ce trebuie să știe un boboc despre UTCN, cămin, Cluj și viața de student, strâns într-un singur ghid. (TODO)",
    forWho: "Bobocii (adică tu, probabil 😉)",
    url: "https://gb.bestcj.ro",
    hint: { emoji: "📖", text: "Ghid pentru anul I" },
  },
  {
    id: "traininguri",
    name: "Traininguri & Interne",
    tagline: "Crești alături de echipă",
    tag: "Membri",
    icon: "sparkles",
    color: "#e879f9",
    description:
      "Traininguri gratuite pe subiecte academice și non-academice, plus team-building-uri și petreceri doar pentru membri. (TODO)",
    forWho: "Toți membrii BEST",
    hint: { emoji: "🎓", text: "Traininguri gratuite" },
  },
];
