import { Button } from "@wilhalla/ui/components/button";
import { Input } from "@wilhalla/ui/components/input";
import { typography } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";
import { siteConfig } from "@/config";
import { useId } from "react";

const newsletter = siteConfig.newsletter;

/**
 * Laposta's script instruments every subscribe form in the document when it runs (submit
 * duration, a single-use token and a proof of work, without which the v2 endpoint refuses the
 * form). It does that once, so each form that mounts loads it again and takes it away when it
 * unmounts.
 */
function protectWithLaposta() {
  const script = document.createElement("script");
  script.src = newsletter.protectionScript;
  script.async = true;
  document.body.append(script);

  return () => script.remove();
}

type NewsletterSignupProps = {
  /** Heading level that fits the surrounding outline. */
  headingLevel?: "h2" | "h3";
  className?: string;
};

export function NewsletterSignup({ headingLevel = "h3", className }: NewsletterSignupProps) {
  const id = useId();
  const Heading = headingLevel;

  return (
    <section aria-labelledby={`${id}-title`} className={className}>
      <Heading id={`${id}-title`} className={cn(typography.body, "m-0 mb-2 text-obsidian")}>
        {newsletter.title}
      </Heading>
      <p className={cn(typography.small, "m-0 text-gravel")}>{newsletter.intro}</p>
      <form
        ref={protectWithLaposta}
        method="post"
        action={newsletter.action}
        acceptCharset="utf-8"
        className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <input type="hidden" name="next" value="" />
        <input type="hidden" name="a" value={newsletter.accountCode} />
        <input type="hidden" name="l" value={newsletter.listCode} />
        <label htmlFor={`${id}-email`} className="sr-only">
          {newsletter.emailLabel}
        </label>
        <div className="flex-1">
          <Input
            id={`${id}-email`}
            name={newsletter.emailFieldName}
            type="email"
            autoComplete="email"
            placeholder={newsletter.emailPlaceholder}
            required
          />
        </div>
        {/* Honeypot: people never see or fill it, Laposta drops submissions where it is set. */}
        <input
          type="email"
          name="email"
          autoComplete="new-password"
          tabIndex={-1}
          aria-hidden="true"
          className="sr-only"
        />
        <Button type="submit">{newsletter.submitLabel}</Button>
      </form>
    </section>
  );
}
