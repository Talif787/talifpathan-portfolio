import { Github, Linkedin, Mail } from "lucide-react";
import { profile } from "@/content";
import { cn } from "@/lib/utils";

const icons = { github: Github, linkedin: Linkedin, mail: Mail } as const;

export function SocialLinks({ className }: { className?: string }) {
  return (
    <ul className={cn("flex items-center gap-xs", className)}>
      {profile.socials.map((social) => {
        const Icon = icons[social.icon];
        const isMail = social.icon === "mail";
        return (
          <li key={social.label}>
            <a
              href={social.href}
              aria-label={`${social.label}: ${social.handle}`}
              {...(isMail ? {} : { target: "_blank", rel: "noopener noreferrer" })}
              className={cn(
                "inline-flex size-10 items-center justify-center rounded-inline",
                "border border-line bg-surface text-muted",
                "transition-[color,border-color,transform] duration-ui ease-standard",
                "hover:-translate-y-0.5 hover:border-line-strong hover:text-ink",
              )}
            >
              <Icon aria-hidden className="size-4" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
