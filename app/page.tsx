import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { About } from "@/components/sections/About";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";

/**
 * Server component. Nothing on this page needs client JavaScript except the
 * header, the command menu, the disclosures and the copy button, each of which
 * opts in individually.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Projects />
      <Experience />
      <Skills />
      <About />
      <Testimonials />
      <Contact />
    </>
  );
}
