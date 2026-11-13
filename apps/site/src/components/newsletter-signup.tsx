import { Button } from "@wilhalla/ui/components/button";
import { Input } from "@wilhalla/ui/components/input";
import { newsletterRegistry } from "@/config/registries";
import { useEffect, useId, useRef } from "react";

const protectedForms = new WeakSet<HTMLFormElement>();

/**
 * Laposta's script instruments every subscribe form in the document when it runs (submit
 * duration, a single-use token and a proof of work, without which the v2 endpoint refuses the
 * form). It does that once, so a form mounted after a client-side navigation runs it again.
 * A page shows at most one signup form (the footer is hidden where the contact page shows its
 * own), so a run never instruments a form twice.
 */
function useLapostaProtection() {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const form = formRef.current;
    if (!form || protectedForms.has(form)) return;
    protectedForms.add(form);

    const script = document.createElement("script");
    script.src = newsletterRegistry.protectionScript;
    script.async = true;
    document.body.append(script);
  }, []);

  return formRef;
}

type NewsletterSignupProps = {
  /** Heading level that fits the surrounding outline. */
  headingLevel?: "h2" | "h3";
  className?: string;
};

export function NewsletterSignup({ headingLevel = "h3", className }: NewsletterSignupProps) {
  const formRef = useLapostaProtection();
  const id = useId();
  const Heading = headingLevel;

  return (
    <section aria-labelledby={`${id}-title`} className={className}>
      <Heading
        id={`${id}-title`}
        className="font-sans text-body-lg leading-body-lg tracking-ui mb-2 m-0 text-obsidian"
      >
        {newsletterRegistry.title}
      </Heading>
      <p className="font-sans text-body leading-body tracking-ui m-0 text-gravel">
        {newsletterRegistry.intro}
      </p>
      <form
        ref={formRef}
        method="post"
        action={newsletterRegistry.action}
        acceptCharset="utf-8"
        className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <input type="hidden" name="next" value="" />
        <input type="hidden" name="a" value={newsletterRegistry.accountCode} />
        <input type="hidden" name="l" value={newsletterRegistry.listCode} />
        <label htmlFor={`${id}-email`} className="sr-only">
          {newsletterRegistry.emailLabel}
        </label>
        <div className="flex-1">
          <Input
            id={`${id}-email`}
            name={newsletterRegistry.emailFieldName}
            type="email"
            autoComplete="email"
            placeholder={newsletterRegistry.emailPlaceholder}
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
        <Button type="submit">{newsletterRegistry.submitLabel}</Button>
      </form>
    </section>
  );
}
