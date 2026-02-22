import BootSequence from "@/components/boot-sequence";
import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero";
import StatsBar from "@/components/stats-bar";
import ChatSection from "@/components/chat/ChatSection";
import ProjectsSection from "@/components/projects-section";
import SkillsSection from "@/components/skills-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <BootSequence>
      <Navbar />
      <main>
        <HeroSection />
        <StatsBar />
        <ChatSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
      </main>
      <Footer />
    </BootSequence>
  );
}
