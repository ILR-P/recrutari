/** Setări generale și texte de pe landing. Cifrele sunt de pe bestcj.ro. */
export const SITE = {
  name: "BEST Cluj-Napoca",
  website: "https://bestcj.ro",
  season: "Recrutări · Toamna 2026",
  address: "Str. Constantin Daicoviciu 15, sala 708, Cluj-Napoca",

  /** Secunde de inactivitate în quiz până apare „Mai ești aici?” */
  idleTimeoutSec: 60,
  /** Secunde de numărătoare inversă înainte de resetare */
  idleCountdownSec: 10,
  /** Secunde de inactivitate pe landing până revine lin sus */
  landingIdleSec: 90,

  /** Recompensa din jocul memory de pe landing */
  memoryReward: "Arată acest ecran unui voluntar BEST și primești un sticker 🎁",

  about:
    "BEST (Board of European Students of Technology) este o organizație studențească non-profit și apolitică. Le oferă studenților la tehnică ocazia să comunice, să coopereze și să participe la schimburi în toată Europa. La Cluj-Napoca suntem voluntari de la Universitatea Tehnică și organizăm competiții, cursuri, evenimente de carieră și traininguri.",

  stats: [
    { value: 1989, from: 1950, label: "anul în care s-a născut BEST", grouping: false, suffix: "" },
    { value: 84, from: 0, label: "grupuri locale", grouping: true, suffix: "" },
    { value: 30, from: 0, label: "țări europene", grouping: true, suffix: "" },
    { value: 3300, from: 0, label: "membri activi", grouping: true, suffix: "+" },
  ],

  socials: [
    { label: "Instagram", href: "https://www.instagram.com/best_clujnapoca/" },
    { label: "Facebook", href: "https://www.facebook.com/BESTcluj/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/best-cluj-napoca" },
  ],
} as const;

export type SocialLabel = (typeof SITE.socials)[number]["label"];
