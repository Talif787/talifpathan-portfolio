import { Container } from "@/components/primitives/Container";
import { LinkButton } from "@/components/primitives/Button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[70vh] flex-col justify-center py-section">
      <p className="mono text-2xs text-faint">404</p>
      <h1 className="mt-m text-3xl">That page does not exist</h1>
      <p className="measure mt-m text-lg text-muted">
        This site is a single page. Everything lives on the home page, under projects,
        experience, skills, about and contact.
      </p>
      <div className="mt-xl">
        <LinkButton href="/" variant="primary" className="w-fit">
          Back to the start
        </LinkButton>
      </div>
    </Container>
  );
}
