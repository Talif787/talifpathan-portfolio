"use client";

import { Container } from "@/components/primitives/Container";
import { Button } from "@/components/primitives/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container className="flex min-h-[70vh] flex-col justify-center py-section">
      <p className="mono text-2xs text-error">Error</p>
      <h1 className="mt-m text-3xl">This section failed to render</h1>
      <p className="measure mt-m text-lg text-muted">
        Reloading usually clears it. If it keeps happening, email me and include what
        you were looking at.
      </p>
      {error.digest ? (
        <p className="mono mt-s text-2xs text-faint">Reference {error.digest}</p>
      ) : null}
      <div className="mt-xl">
        <Button type="button" variant="primary" onClick={reset} className="w-fit">
          Try again
        </Button>
      </div>
    </Container>
  );
}
