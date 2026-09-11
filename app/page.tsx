import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { Education } from "@/components/sections/Education";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";

/**
 * Server component. Nothing on this page needs client JavaScript except the
 * header, the command menu, the disclosures, the copy button and the scroll to
 * top control, each of which opts in individually.
 *
 * Order follows what a recruiter looks for: what has been built, where, with
 * what, then the credentials behind it, then who the person is and how to
 * reach them.
 *
 * Every section here has a matching header nav link. Certifications and
 * references are nested inside education and about respectively, so the
 * document outline matches the navigation and the active indicator cannot
 * point at a section the nav does not list.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Projects />
      <Experience />
      <Skills />
      <Education />
      <About />
      <Contact />
    </>
  );
}
