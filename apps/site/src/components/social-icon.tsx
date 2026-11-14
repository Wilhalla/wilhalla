import type { SocialLink } from "@/types";
import type { SVGProps } from "react";

const paths = {
  facebook: (
    <path
      fill="currentColor"
      stroke="none"
      d="M14 8.8V7.1c0-.8.5-1 1-1h1.8V3h-2.5C11.5 3 10 4.7 10 7v1.8H7.8V12H10v9h3.4v-9h2.8l.5-3.2h-3.3Z"
    />
  ),
  instagram: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="12" r="3.2" />
      <circle cx="17" cy="7" r="0.7" fill="currentColor" stroke="none" />
    </>
  ),
} satisfies Record<SocialLink["icon"], React.ReactNode>;

/** Monochrome brand marks in the line style of the lucide icons used elsewhere. */
export function SocialIcon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & { name: SocialLink["icon"] }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
