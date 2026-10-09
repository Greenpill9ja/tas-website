import Hero from "@/components/sections/Hero";
import ProblemSolution from "@/components/sections/ProblemSolution";
import Localism from "@/components/sections/Localism";
import HubActivities from "@/components/sections/HubActivities";
import TheStack from "@/components/sections/TheStack";
import Roadmap from "@/components/sections/Roadmap";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="relative bg-vibrant text-dark w-full overflow-x-hidden">
      <Hero />
      <ProblemSolution />
      <Localism />
      <HubActivities />
      <TheStack />
      <Roadmap />
      <Footer />
    </main>
  );
}
