"use client";

import { useReducer } from "react";
import type { ArchetypeId } from "@/data/archetypes";
import { QUIZ_STEPS, type Scores } from "@/data/quiz";
import { addScores, emptyBoard, type ScoreBoard } from "@/lib/quiz-engine";

export type QuizPhase = "intro" | "playing" | "calculating" | "result";

export type QuizState = {
  phase: QuizPhase;
  stepIndex: number;
  scores: ScoreBoard;
  history: Scores[];
  result: { id: ArchetypeId; bestanNo: number; issuedAt: string } | null;
};

type QuizAction =
  | { type: "START" }
  | { type: "ANSWER"; delta: Scores }
  | { type: "REVEAL"; id: ArchetypeId; bestanNo: number; issuedAt: string }
  | { type: "RESET" };

const initialState: QuizState = {
  phase: "intro",
  stepIndex: 0,
  scores: emptyBoard(),
  history: [],
  result: null,
};

function reducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "START":
      return { ...initialState, scores: emptyBoard(), phase: "playing" };
    case "ANSWER": {
      if (state.phase !== "playing") return state;
      const isLast = state.stepIndex >= QUIZ_STEPS.length - 1;
      return {
        ...state,
        scores: addScores(state.scores, action.delta),
        history: [...state.history, action.delta],
        stepIndex: isLast ? state.stepIndex : state.stepIndex + 1,
        phase: isLast ? "calculating" : "playing",
      };
    }
    case "REVEAL":
      if (state.phase !== "calculating") return state;
      return {
        ...state,
        phase: "result",
        result: { id: action.id, bestanNo: action.bestanNo, issuedAt: action.issuedAt },
      };
    case "RESET":
      return { ...initialState, scores: emptyBoard() };
  }
}

export function useQuiz() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return {
    state,
    step: QUIZ_STEPS[state.stepIndex],
    totalSteps: QUIZ_STEPS.length,
    start: () => dispatch({ type: "START" }),
    answer: (delta: Scores) => dispatch({ type: "ANSWER", delta }),
    reveal: (id: ArchetypeId, bestanNo: number, issuedAt: string) =>
      dispatch({ type: "REVEAL", id, bestanNo, issuedAt }),
    reset: () => dispatch({ type: "RESET" }),
  };
}
