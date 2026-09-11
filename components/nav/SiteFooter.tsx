import { navItems, profile, secondaryNavItems } from "@/content";
import { Container } from "@/components/primitives/Container";
import { SocialLinks } from "@/components/sections/SocialLinks";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line py-xl">
      <Container>
        <div className="flex flex-col gap-xl md:flex-row md:items-start md:justify-between">
          <div className="measure-tight">
            <p className="text-lg text-ink">{profile.name}</p>
            <p className="mt-2xs text-xs text-muted">{profile.role}</p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-l gap-y-xs">
            {[...navItems, ...secondaryNavItems].map((item) => (
              <a
                key={item.sectionId}
                href={item.href}
                className="link-underline text-xs text-muted hover:text-ink"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <SocialLinks />
        </div>

        <div className="mt-xl flex flex-col gap-xs border-t border-line-faint pt-l md:flex-row md:items-center md:justify-between">
          <p className="text-2xs mono text-faint">
            {year} {profile.name}
          </p>
          <p className="text-2xs mono text-faint">
            Built with Next.js, Tailwind CSS and Motion
          </p>
        </div>
      </Container>
    </footer>
  );
}
