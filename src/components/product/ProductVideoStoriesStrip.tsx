"use client";

import {
  productVideoStoriesSection,
  type ProductVideoStory,
} from "@/config/productVideoStories";

const cardGradients = [
  "from-velora-burgundy via-[#4a2430] to-[#2c1318]",
  "from-[#5c3040] via-velora-burgundy-dark to-[#2c1318]",
  "from-[#3d2830] via-[#5a3545] to-[#2c1318]",
  "from-velora-burgundy-dark via-[#4a2430] to-[#1a0c10]",
  "from-[#6b4450] via-velora-burgundy to-[#2c1318]",
] as const;

function StoryCard({ story, index }: { story: ProductVideoStory; index: number }) {
  const gradient = cardGradients[index % cardGradients.length];
  const hasVideo = Boolean(story.videoSrc?.trim());

  return (
    <article
      className={`relative flex w-[9.5rem] shrink-0 snap-center flex-col overflow-hidden rounded-[1.35rem] border border-white/10 shadow-[0_12px_40px_rgba(44,19,24,0.35)] sm:w-[10.5rem] md:w-[11.25rem]`}
    >
      <div className={`relative aspect-[9/16] w-full bg-gradient-to-b ${gradient}`}>
        {hasVideo ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={story.videoSrc}
            poster={story.posterSrc}
            playsInline
            muted
            loop
            preload="metadata"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-3 text-center">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-full border border-velora-cream/25 bg-black/20 text-velora-cream/70"
              aria-hidden
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <p className="text-[10px] font-semibold leading-snug text-velora-cream/45">فيديو قريباً</p>
          </div>
        )}

        <span className="absolute left-2.5 top-2.5 inline-flex max-w-[85%] items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-bold text-velora-cream backdrop-blur-sm">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-velora-champagne" aria-hidden />
          <span className="truncate">{story.name}</span>
        </span>

        <span
          className="absolute bottom-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-velora-cream/80 backdrop-blur-sm"
          aria-hidden
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <path d="M15.5 8.5a5 5 0 010 7" />
            <line x1="18" y1="6" x2="18" y2="18" />
          </svg>
        </span>
      </div>

      <div className="bg-[#2c1318] px-3 py-2.5 text-right">
        <p className="truncate text-xs font-extrabold text-velora-cream">{story.name}</p>
        {story.city ? (
          <p className="truncate text-[10px] font-medium text-velora-cream/55">{story.city}</p>
        ) : null}
      </div>
    </article>
  );
}

export function ProductVideoStoriesStrip() {
  const { eyebrow, title, stories } = productVideoStoriesSection;

  return (
    <section className="bg-velora-cream py-8 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-5 text-right sm:mb-6">
          <p className="text-[11px] font-bold tracking-[0.22em] text-velora-champagne-dark">{eyebrow}</p>
          <h2 className="mt-1 text-xl font-extrabold text-velora-burgundy-dark sm:text-2xl">{title}</h2>
        </div>

        <div
          className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 snap-x snap-mandatory scrollbar-thin scrollbar-track-transparent scrollbar-thumb-velora-burgundy/20"
          dir="ltr"
        >
          {[...stories].reverse().map((story, i) => (
            <StoryCard key={story.id} story={story} index={i} />
          ))}
        </div>
        <p className="mt-3 text-right text-[10px] text-velora-burgundy/40">اسحبي لعرض المزيد</p>
      </div>
    </section>
  );
}
