import { Separator } from "@wilhalla/ui/components/separator";
import { cn } from "@wilhalla/ui/lib/utils";

import { badgeStory } from "./stories/badge";
import { buttonStory } from "./stories/button";
import { cardStory } from "./stories/card";
import { breadcrumbStory, dividerStory, pageHeaderStory, teaserStory } from "./stories/layout";
import type { Story } from "./stories/story";
import { chartStory, feedbackStory, tableStory } from "./stories/data";
import { inputGroupStory, inputStory, selectStory, switchStory } from "./stories/forms";
import { commandStory, overlayStory } from "./stories/overlays";
import { tokensStory } from "./stories/tokens";
import { typographyStory } from "./stories/typography";

// Add a story here when a component joins @wilhalla/ui.
const stories: Story[] = [
  tokensStory,
  typographyStory,
  buttonStory,
  badgeStory,
  cardStory,
  inputStory,
  inputGroupStory,
  selectStory,
  switchStory,
  overlayStory,
  commandStory,
  tableStory,
  chartStory,
  feedbackStory,
  pageHeaderStory,
  breadcrumbStory,
  teaserStory,
  dividerStory,
];

export function App() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="sticky top-0 z-10 border-b border-chalk bg-eggshell/90 backdrop-blur">
        <div className="mx-auto flex w-[calc(100%-2rem)] max-w-page items-center justify-between gap-4 py-3">
          <div className="flex items-baseline gap-3">
            <span className="font-heading text-heading-sm text-obsidian">Wilhalla UI</span>
            <span className="hidden font-mono text-xs text-gravel sm:inline">@wilhalla/ui</span>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-[calc(100%-2rem)] max-w-page gap-10 py-10 lg:grid-cols-[12rem_1fr]">
        <nav aria-label="Components" className="lg:sticky lg:top-24 lg:self-start">
          <ul className="m-0 flex list-none flex-wrap gap-1 p-0 lg:flex-col">
            {stories.map((story) => (
              <li key={story.id}>
                <a
                  href={`#${story.id}`}
                  className={cn(
                    "block rounded-full px-3 py-1.5 text-body leading-body text-gravel no-underline",
                    "transition-colors hover:bg-powder hover:text-obsidian",
                  )}
                >
                  {story.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <main className="grid min-w-0 gap-16">
          {stories.map((story) => (
            <section key={story.id} id={story.id} className="grid scroll-mt-24 gap-6">
              <div className="grid gap-2">
                <h2 className="m-0 font-heading text-heading leading-heading font-light tracking-heading text-obsidian">
                  {story.title}
                </h2>
                <code className="font-mono text-xs text-gravel">{story.source}</code>
                <p className="m-0 max-w-[65ch] text-body leading-body text-cinder">
                  {story.description}
                </p>
              </div>
              <Separator className="bg-chalk" />
              {story.render()}
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
