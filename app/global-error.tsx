"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#0c141f",
          color: "#e6ecf5",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: "34rem" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 500, margin: 0 }}>
            The page failed to load
          </h1>
          <p style={{ color: "#8c9cb3", lineHeight: 1.6 }}>
            Something broke before the site could start. Reloading usually fixes it.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              padding: "0.7rem 1.25rem",
              borderRadius: 5,
              border: "1px solid #f2b25c",
              background: "#f2b25c",
              color: "#08101a",
              font: "inherit",
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
