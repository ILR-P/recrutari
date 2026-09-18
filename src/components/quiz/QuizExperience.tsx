"use client";

import { AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CatchGame } from "@/components/games/CatchGame";
import { GameShell } from "@/components/games/GameShell";
import { PackBagGame } from "@/components/games/PackBagGame";
import { IdleGuard } from "@/components/layout/IdleGuard";
import { ResultReveal } from "@/components/results/ResultReveal";
import type { QuizStep, Scores } from "@/data/quiz";
import { useQuiz } from "@/hooks/useQuiz";
import { getResult } from "@/lib/quiz-engine";
import { recordResult } from "@/lib/stand-stats";
import { Calculating } from "./Calculating";
import { QuestionCard } from "./QuestionCard";
import { QuizIntro } from "./QuizIntro";
import { QuizProgress } from "./QuizProgress";
import { SwipeQuestion } from "./SwipeQuestion";

export function QuizExperience() {
  const router = useRouter();
  const quiz = useQuiz();
  const { state, step } = quiz;

  // Fiecare pas nou începe de sus (pe telefoane, unii pași sunt mai înalți decât ecranul).
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [state.phase, state.stepIndex]);

  const handleCalculated = () => {
    const id = getResult(state.scores, state.history);
    recordResult(id);
    const bestanNo = 1 + Math.floor(Math.random() * 9999);
    quiz.reveal(id, bestanNo, new Date().toLocaleDateString("ro-RO"));
  };

  const handleIdle = () => {
    quiz.reset();
    router.push("/");
  };

  return (
    <main className="relative flex min-h-svh flex-col items-center overflow-x-clip px-4 pt-24 pb-12 sm:pt-28">
      <AnimatePresence>{state.phase === "playing" && <QuizProgress current={state.stepIndex} />}</AnimatePresence>

      <div className="flex w-full flex-1 items-center justify-center py-8">
        <AnimatePresence mode="wait">
          {state.phase === "intro" && <QuizIntro key="intro" onStart={quiz.start} />}
          {state.phase === "playing" && (
            <StepView key={step.id} step={step} index={state.stepIndex} onAnswer={quiz.answer} />
          )}
          {state.phase === "calculating" && <Calculating key="calculating" onDone={handleCalculated} />}
          {state.phase === "result" && state.result && (
            <ResultReveal
              key="result"
              archetypeId={state.result.id}
              scores={state.scores}
              bestanNo={state.result.bestanNo}
              issuedAt={state.result.issuedAt}
              onRestart={quiz.reset}
            />
          )}
        </AnimatePresence>
      </div>

      <IdleGuard onTimeout={handleIdle} />
    </main>
  );
}

function StepView({ step, index, onAnswer }: { step: QuizStep; index: number; onAnswer: (s: Scores) => void }) {
  switch (step.kind) {
    case "question":
      return <QuestionCard step={step} index={index} onAnswer={onAnswer} />;
    case "swipe":
      return <SwipeQuestion step={step} index={index} onAnswer={onAnswer} />;
    case "game":
      return (
        <GameShell
          title={step.title}
          story={step.story}
          emoji={step.game === "catch" ? "🧺" : "🎒"}
          countdown={step.game === "catch"}
          onComplete={onAnswer}
        >
          {(finish) =>
            step.game === "catch" ? (
              <CatchGame step={step} onFinish={finish} />
            ) : (
              <PackBagGame step={step} onFinish={finish} />
            )
          }
        </GameShell>
      );
  }
}
