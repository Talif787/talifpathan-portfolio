import { profile } from "@/content";
import { Section } from "@/components/primitives/Section";
import { LinkButton } from "@/components/primitives/Button";
import { StatusDot } from "@/components/primitives/StatusDot";
import { CopyEmail } from "./CopyEmail";
import { SocialLinks } from "./SocialLinks";

export function Contact() {
  return (
    <Section
      id="contact"
      label="Contact"
      title="Tell me what you are building"
      intro="Email is the fastest route. Both addresses reach me."
      aside={<StatusDot label={profile.status} />}
    >
      <div className="sheet p-l sm:p-xl">
        <div className="grid gap-xl lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <dl className="flex flex-col gap-l">
            <div>
              <dt className="text-xs text-faint">Personal</dt>
              <dd className="mt-2xs">
                <a
                  href={`mailto:${profile.emails.personal}`}
                  className="link-underline text-lg text-ink"
                >
                  {profile.emails.personal}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs text-faint">University</dt>
              <dd className="mt-2xs">
                <a
                  href={`mailto:${profile.emails.academic}`}
                  className="link-underline text-lg text-ink"
                >
                  {profile.emails.academic}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs text-faint">Based in</dt>
              <dd className="mt-2xs text-lg text-ink">{profile.location}</dd>
            </div>
          </dl>

          <div className="flex flex-col items-start gap-m">
            <LinkButton
              href={`mailto:${profile.emails.personal}`}
              variant="primary"
              className="w-full sm:w-auto"
            >
              Send an email
            </LinkButton>
            <CopyEmail email={profile.emails.personal} />
            {profile.resumeUrl ? (
              <LinkButton href={profile.resumeUrl} external>
                Resume
              </LinkButton>
            ) : null}
            <SocialLinks />
          </div>
        </div>
      </div>
    </Section>
  );
}
