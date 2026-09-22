/**
 * „Un an în BEST”. Lunile și ordinea sunt placeholder.
 * TODO: verifică pe bestcj.ro calendarul real al proiectelor.
 */
export type TimelineItem = { when: string; title: string; text: string; emoji: string };

export const TIMELINE: TimelineItem[] = [
  { when: "Octombrie", title: "Recrutări și Ghidul Bobocului", text: "Intri în echipă, cunoști oamenii și afli cum funcționează BEST.", emoji: "🚪" },
  { when: "Noiembrie", title: "Primul training și team-building", text: "Un weekend cu jocuri, traininguri și prietenii noi.", emoji: "🏕️" },
  { when: "Decembrie", title: "CodeRun", text: "Ajuți la organizarea competiției de programare, de la probleme la premii.", emoji: "⌨️" },
  { when: "Martie", title: "JobShop®", text: "Aduci companiile mai aproape de studenți și îți lărgești rețeaua.", emoji: "💼" },
  { when: "Aprilie", title: "Aplicații pentru BEST Courses", text: "Alegi cursurile din Europa la care vrei să mergi vara.", emoji: "📝" },
  { when: "Vara", title: "BEST Courses în Europa", text: "Două săptămâni de cursuri, excursii și prieteni din 30 de țări.", emoji: "🌍" },
];
