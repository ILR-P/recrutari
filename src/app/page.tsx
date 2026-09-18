import { Departments } from "@/components/about/Departments";
import { FinalCta } from "@/components/about/FinalCta";
import { Hero } from "@/components/about/Hero";
import { MemoryUnlock } from "@/components/about/MemoryUnlock";
import { Projects } from "@/components/about/Projects";
import { Stats } from "@/components/about/Stats";
import { Timeline } from "@/components/about/Timeline";
import { Footer } from "@/components/layout/Footer";
import { IdleScrollTop } from "@/components/layout/IdleGuard";

export default function Home() {
  return (
    <>
      <main className="overflow-x-clip">
        <Hero />
        <Stats />
        <Projects />
        <Timeline />
        <Departments />
        <MemoryUnlock />
        <FinalCta />
      </main>
      <Footer />
      <IdleScrollTop />
    </>
  );
}
