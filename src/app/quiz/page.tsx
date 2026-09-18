import type { Metadata } from "next";
import { QuizExperience } from "@/components/quiz/QuizExperience";

export const metadata: Metadata = { title: "Quiz" };

export default function QuizPage() {
  return <QuizExperience />;
}
