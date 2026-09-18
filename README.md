# BEST Cluj-Napoca · „Ce tip de BESTan ești?”

Site de recrutare pentru standul BEST Cluj-Napoca: landing interactiv „Despre noi”, un quiz cu mini-jocuri și un panou pentru voluntari. Rulează pe laptopurile, tabletele și telefoanele echipei.

**Stack:** Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · Motion (fostul Framer Motion) · lucide-react · canvas-confetti

## Pornire locală

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de producție (îl rulează și Vercel)
npm run lint
```

## Pagini

| Rută | Ce conține |
| --- | --- |
| `/` | Hero, Despre, Proiecte (carduri 3D), Timeline, Echipe (carusel), jocul memory cu recompensă, CTA |
| `/quiz` | Quizul: 6 întrebări + 2 mini-jocuri → rezultat cu confetti și legitimație holografică |
| `/stand` | Panoul voluntarilor (nelinkat): statistici pe dispozitiv, ecran complet, ecran mereu aprins, resetare. Se deschide și cu **triplu-tap pe logo**. |

## Unde editezi conținutul

Tot conținutul stă în `src/data/`. Ce e marcat `TODO` e placeholder și trebuie verificat pe [bestcj.ro](https://bestcj.ro).

| Fișier | Conținut |
| --- | --- |
| `site.ts` | sezonul de recrutare, adresa, cifrele, linkurile sociale, textul recompensei, timpii de inactivitate |
| `archetypes.ts` | rezultatele posibile ale quizului |
| `quiz.ts` | întrebările, afirmațiile de swipe și configurația mini-jocurilor |
| `projects.ts` | proiectele (carduri + jocul memory) |
| `timeline.ts`, `departments.ts` | „Un an în BEST” și echipele |

### Cum adaugi un rezultat nou

1. În `src/data/archetypes.ts`, adaugă id-ul în `ARCHETYPE_IDS` (ex. `"it"`).
2. Adaugă intrarea în `ARCHETYPES`. TypeScript dă eroare până când o completezi.
3. În `src/data/quiz.ts`, dă-i puncte în opțiuni, de exemplu `scores: { it: 3 }`.

Scorul, procentele, barele, confetti-ul și legitimația se adaptează automat.

## La stand

- **Resetare automată:** după 60 s fără activitate în quiz apare „Mai ești aici?”, apoi site-ul revine la pagina principală pentru următorul student. Se poate opri din `/stand`.
- **Tablete:** deschide site-ul, alege „Add to Home Screen”, apoi pornește „Ecran mereu aprins” din `/stand`.
- **Recompensa:** cine termină jocul memory de pe landing primește textul din `SITE.memoryReward` (implicit un sticker).
- Statisticile din `/stand` rămân doar pe dispozitivul respectiv (localStorage).

## Structură

```
src/
├─ app/          rute (layout, template, /, /quiz, /stand, manifest, icon)
├─ components/
│  ├─ layout/    Navbar, Footer, AnimatedBackground, MotionProvider, IdleGuard
│  ├─ ui/        Button, TiltCard, AnimatedCounter, Morisca, SectionHeading, Marquee, SocialIcon
│  ├─ about/     secțiunile de pe landing
│  ├─ quiz/      QuizExperience, QuizIntro, QuestionCard, SwipeQuestion, QuizProgress, Calculating
│  ├─ games/     GameShell, PackBagGame, CatchGame, MemoryGame
│  ├─ results/   ResultReveal, BestanIdCard, ScoreBreakdown, celebrate
│  └─ stand/     StandPanel
├─ data/         conținutul editabil
├─ hooks/        useQuiz, useIdle, useWakeLock, useSafeTimeout
└─ lib/          quiz-engine (scor), animations (config animații), stand-stats, cn
```

## Deploy pe Vercel

**1. Push pe GitHub.** Creează întâi un repo gol pe <https://github.com/new>, fără README și fără .gitignore.

```bash
git init
git add .
git commit -m "Site recrutare BEST Cluj-Napoca"
git branch -M main
git remote add origin https://github.com/<utilizator>/<repo>.git
git push -u origin main
```

**2a. Deploy prin integrarea Git (recomandat).** Pe <https://vercel.com/new>: Import → alegi repo-ul → Deploy (Next.js e detectat automat). De acum, fiecare push pe `main` merge în producție, iar fiecare alt branch primește un URL de preview.

**2b. Sau totul din terminal:**

```bash
vercel login
vercel link          # creează proiectul Vercel și îl leagă de folder
vercel --prod        # deploy de producție, afișează URL-ul
vercel git connect   # leagă repo-ul GitHub pentru deploy automat la push
```
