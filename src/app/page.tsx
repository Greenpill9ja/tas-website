import Hero from "@/components/sections/Hero";
import ProblemSolution from "@/components/sections/ProblemSolution";
import Localism from "@/components/sections/Localism";
import HubActivities from "@/components/sections/HubActivities";
import TheStack from "@/components/sections/TheStack";
import Roadmap from "@/components/sections/Roadmap";
import Footer from "@/components/sections/Footer";
import ImpactPreview from "@/components/sections/ImpactPreview";
import SiteHeader from "@/components/SiteHeader";

export default function Home() {
  return (
    <>
    <a href="#home-content" className="fixed left-4 top-4 z-50 -translate-y-24 rounded-full bg-dark px-5 py-3 font-body text-sm font-bold text-white focus:translate-y-0">Skip to content</a>
    <SiteHeader />
    <main id="home-content" tabIndex={-1} className="relative bg-vibrant text-dark w-full overflow-x-hidden outline-none">
      <Hero />
      <ProblemSolution />
      <Localism />
      <HubActivities />
      <ImpactPreview />
      <TheStack />
      <Roadmap />
    </main>
    <Footer />
    </>
  );
}
