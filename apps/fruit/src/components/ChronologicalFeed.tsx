import { layout, media, typography } from "@wilhalla/ui/lib/typography";
import { cn } from "@wilhalla/ui/lib/utils";
import { archiveAssetUrl } from "../lib/assetUrls";
import {
  archiveDayLabel,
  archiveTimestamp,
  archiveYear,
  buildArchiveChronology,
  displayArchiveYear,
  formatArchiveDate,
} from "../lib/archiveDateTime";
import { formatNumber } from "../lib/format";
import type { PostSummary } from "../lib/postIndex";
import { postCounts, postListExcerpt, postListTitle } from "../lib/postMeta";
import {
  yearPickerAsideClass,
  yearPickerCountClass,
  yearPickerItemClass,
  yearPickerScrollClass,
  yearPickerTitleClass,
} from "./yearPickerStyles";

type Props = { posts: PostSummary[]; limit?: number };
const activeYearScript = `
(() => {
  const root = document.currentScript?.closest('[data-chronology-feed]')
  if (!root) return

  const links = Array.from(root.querySelectorAll('[data-chronology-year-link]'))
  const sections = Array.from(root.querySelectorAll('[data-chronology-month][data-year]'))
  let activeYear = ''

  const setActiveYear = (year) => {
    if (!year || year === activeYear) return
    activeYear = year
    for (const link of links) {
      const isActive = link.getAttribute('data-year') === year
      link.setAttribute('data-active', isActive ? 'true' : 'false')
      if (isActive) link.setAttribute('aria-current', 'true')
      else link.removeAttribute('aria-current')
    }
  }

  const activeYearFromViewport = () => {
    const offset = 112
    let selectedYear = sections[0]?.getAttribute('data-year') || ''
    for (const section of sections) {
      const rect = section.getBoundingClientRect()
      const year = section.getAttribute('data-year') || ''
      if (rect.top <= offset && rect.bottom > offset) return year
      if (rect.top <= offset) selectedYear = year
      else break
    }
    return selectedYear
  }

  let ticking = false
  const update = () => {
    ticking = false
    setActiveYear(activeYearFromViewport())
  }
  const scheduleUpdate = () => {
    if (ticking) return
    ticking = true
    window.requestAnimationFrame(update)
  }

  for (const link of links) {
    link.addEventListener('click', () => setActiveYear(link.getAttribute('data-year') || ''), { passive: true })
  }
  window.addEventListener('scroll', scheduleUpdate, { passive: true })
  window.addEventListener('resize', scheduleUpdate)
  update()
  window.requestAnimationFrame(update)
  window.setTimeout(update, 250)
})()
`;

const displayTime = (post: PostSummary) => (post.time && post.time !== "00:00" ? post.time : "");

export default function ChronologicalFeed({ posts, limit }: Props) {
  const {
    chronologicalItems: chronologicalPosts,
    yearGroups,
    monthGroups,
  } = buildArchiveChronology(posts, { limit });
  const validPosts = chronologicalPosts.filter((post) => Number.isFinite(archiveTimestamp(post)));
  const firstPost = validPosts[0] ?? chronologicalPosts[0];
  const firstYear = firstPost ? archiveYear(firstPost) : "";

  return (
    <section className="w-full pb-24" aria-labelledby="chronology-title" data-chronology-feed>
      <div className={cn(layout.container, "relative z-10 overflow-x-clip py-16")}>
        <div className="grid min-w-0 grid-cols-rail items-start gap-4 md:grid-cols-sidebar md:gap-8">
          <aside className={yearPickerAsideClass} aria-label="Tijdlijnnavigatie">
            <div className={yearPickerScrollClass}>
              <p className={cn(yearPickerTitleClass, "mb-3")}>Jaren</p>
              <nav className="grid gap-1 md:gap-0.5" aria-label="Spring naar jaar">
                {yearGroups.map((group) => (
                  <a
                    className={yearPickerItemClass}
                    data-active={group.year === firstYear ? "true" : "false"}
                    data-chronology-year-link
                    data-year={group.year}
                    key={group.year}
                    aria-current={group.year === firstYear ? "true" : undefined}
                    aria-label={`Spring naar ${displayArchiveYear(group.year)}, ${group.count} berichten`}
                    href={`#year-${group.year}`}
                  >
                    <span>{displayArchiveYear(group.year)}</span>
                    <span className={yearPickerCountClass}>{group.count}</span>
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="grid min-w-0 gap-10" aria-label="Chronologische berichtenindex">
            {monthGroups.map((month) => (
              <section
                className="flex min-w-0 flex-col gap-3 [content-visibility:auto] [contain-intrinsic-size:1px_1200px] md:flex-row md:flex-wrap md:gap-x-3"
                id={month.key}
                data-chronology-month
                data-year={month.year}
                aria-label={month.label}
                key={month.key}
              >
                {month.startsYear && (
                  <span id={`year-${month.year}`} className="basis-full" aria-hidden="true"></span>
                )}
                {month.startsYear && (
                  <header className="mb-4 flex basis-full items-end justify-between border-b border-chalk pb-5">
                    <p className={cn(typography.small, "m-0 text-gravel")}>
                      {formatNumber(
                        yearGroups.find((group) => group.year === month.year)?.count ?? 0,
                      )}{" "}
                      berichten
                    </p>
                    <h2 className={cn(typography.display, "leading-none")}>
                      {displayArchiveYear(month.year)}
                    </h2>
                  </header>
                )}
                <div className="w-14 shrink-0 pt-3 max-md:hidden" aria-hidden="true">
                  <span
                    className={cn(
                      typography.small,
                      "sticky top-navbar block pt-6 font-medium text-gravel lowercase",
                    )}
                  >
                    {month.shortLabel}
                  </span>
                </div>
                <div className="grid min-w-0 flex-1">
                  <div className="border-t border-chalk py-3 md:hidden">
                    <p className={typography.eyebrow}>{month.label}</p>
                  </div>
                  {month.items.map((post, index) => {
                    const image = post.images[0];
                    const dateId = post.isoDate?.slice(0, 10) || "";
                    const timeLabel = displayTime(post);
                    return (
                      <article
                        className={cn(
                          "group min-w-0 py-6 [content-visibility:auto] [contain-intrinsic-size:1px_9rem]",
                          !(month.startsYear && index === 0) &&
                            "border-t border-chalk transition-colors duration-hover ease-out hover:border-slate",
                        )}
                        key={post.id}
                      >
                        <a
                          className={cn(
                            "flex min-w-0 flex-col gap-4 text-inherit no-underline md:flex-row",
                            image ? "md:items-center md:gap-8" : "md:gap-4",
                          )}
                          href={`/posts/${post.slug}/`}
                          aria-label={`Lees ${post.title}`}
                        >
                          <div
                            className={cn(
                              "self-start md:shrink-0",
                              image ? "grid gap-3 md:w-52" : "md:w-11",
                            )}
                          >
                            <time
                              className={
                                image
                                  ? "flex items-baseline gap-2 text-gravel md:block md:text-left"
                                  : "flex items-baseline gap-2 text-gravel"
                              }
                              dateTime={dateId}
                              aria-label={formatArchiveDate(post)}
                            >
                              <span className="font-sans text-body leading-none font-medium text-obsidian">
                                {archiveDayLabel(post)}
                              </span>
                              <span className="font-sans text-body text-gravel md:hidden">
                                {month.shortLabel}
                              </span>
                            </time>
                            {image && (
                              <div
                                className="relative aspect-4/3 overflow-hidden rounded-lg"
                                aria-hidden="true"
                              >
                                <img
                                  className={cn(media.image, media.zoom, "size-full rounded-lg")}
                                  src={archiveAssetUrl(image)}
                                  alt=""
                                  loading="lazy"
                                  decoding="async"
                                />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1 self-center">
                            {(timeLabel || postCounts(post)) && (
                              <p className="m-0 mb-1.5 font-sans text-body leading-body text-gravel">
                                {[timeLabel, postCounts(post)].filter(Boolean).join(" · ")}
                              </p>
                            )}
                            <h3 className={postListTitle}>{post.title}</h3>
                            {post.excerpt && <p className={postListExcerpt}>{post.excerpt}</p>}
                          </div>
                        </a>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
        <script dangerouslySetInnerHTML={{ __html: activeYearScript }} />
      </div>
    </section>
  );
}
