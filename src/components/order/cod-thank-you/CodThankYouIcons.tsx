/** Thank-you page icons — single stroke weight, 24×24, no emoji. */

const S = 1.5;

type IconProps = { className?: string };

export function IconCheck({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={S} aria-hidden>
      <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconCart({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={S} aria-hidden>
      <path d="M4 5h1.5l2.2 11.2a1 1 0 0 0 1 .8h9.1a1 1 0 0 0 1-.86L20.5 9H7" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="20" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="17" cy="20" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconPhone({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={S} aria-hidden>
      <path
        d="M8.5 4h2.2a1 1 0 0 1 1 .76l.6 2.6a1 1 0 0 1-.28.95l-1.4 1.4a12 12 0 0 0 5.07 5.07l1.4-1.4a1 1 0 0 1 .95-.28l2.6.6a1 1 0 0 1 .76 1V18a1 1 0 0 1-1 1A13 13 0 0 1 5 6.5a1 1 0 0 1 1-1Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconBox({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={S} aria-hidden>
      <path d="M12 3 4 7v10l8 4 8-4V7l-8-4z" strokeLinejoin="round" />
      <path d="M4 7l8 4 8-4M12 11v10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconTruck({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={S} aria-hidden>
      <path d="M3 7h11v10H3V7z" strokeLinejoin="round" />
      <path d="M14 10h4l3 4v3h-7v-7z" strokeLinejoin="round" />
      <circle cx="7.5" cy="18" r="1.75" />
      <circle cx="17.5" cy="18" r="1.75" />
    </svg>
  );
}

/** Monochrome — on burgundy buttons */
export function IconWhatsApp({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={S} aria-hidden>
      <path
        d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 9.4c.2-.5.4-.5.6-.5h.5c.2 0 .4 0 .5.4l.7 1.6c.1.2 0 .5-.2.7l-.4.4c-.2.2-.2.4 0 .7.8 1.4 2 2.5 3.5 3.2.2.1.5.1.6-.1l.5-.5c.2-.2.4-.2.7-.1l1.6.7c.3.1.3.3.3.5v.5c0 .2-.1.4-.5.6-.5.3-1.2.6-2 .6-.9 0-2-.4-3.4-1.8-2.4-2.4-2.5-4.3-2.5-4.7 0-.4.3-1.1.6-1.6z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconClock({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={S} aria-hidden>
      <circle cx="12" cy="12" r="8.25" />
      <path d="M12 8v4.5l2.5 1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconShield({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={S} aria-hidden>
      <path d="M12 3 5 6v5.5c0 4.2 3 7.2 7 8 4-0.8 7-3.8 7-8V6l-7-3z" strokeLinejoin="round" />
      <path d="m9.5 12 1.8 1.8L15 10.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconGem({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={S} aria-hidden>
      <path d="M4 9l8-5 8 5-8 11-8-11z" strokeLinejoin="round" />
      <path d="M4 9h16M12 4v16" strokeLinecap="round" />
    </svg>
  );
}

export function IconCalendar({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={S} aria-hidden>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v3M16 3v3M4 10h16" strokeLinecap="round" />
    </svg>
  );
}

export function IconPackage({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={S} aria-hidden>
      <path d="M12 3 4 7l8 4 8-4-8-4z" strokeLinejoin="round" />
      <path d="M4 7v10l8 4 8-4V7" strokeLinejoin="round" />
      <path d="M12 11v10" strokeLinecap="round" />
    </svg>
  );
}

export function IconHeadset({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={S} aria-hidden>
      <path d="M4 14a8 8 0 0 1 16 0" strokeLinecap="round" />
      <rect x="3" y="14" width="5" height="6" rx="1.5" />
      <rect x="16" y="14" width="5" height="6" rx="1.5" />
    </svg>
  );
}

export function IconHeart({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={S} aria-hidden>
      <path
        d="M12 20s-6-3.6-8-7.2C2.5 9.5 4.5 6.5 7.5 6.5c1.6 0 2.8.9 4.5 2.7 1.7-1.8 2.9-2.7 4.5-2.7 3 0 5 3 3.5 6.3-2 3.6-8 7.2-8 7.2z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconChat({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={S} aria-hidden>
      <path
        d="M5 6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-5l-4 3v-3H8a3 3 0 0 1-3-3V6z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconMapPin({ className = "h-3 w-3" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={S} aria-hidden>
      <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10z" strokeLinejoin="round" />
      <circle cx="12" cy="11" r="2" />
    </svg>
  );
}

export function IconChevronEnd({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={S} aria-hidden>
      <path d="M14 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Soft halo behind hero check — no confetti */
export function IconSuccessHalo({ className = "h-28 w-28" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" aria-hidden>
      <circle cx="60" cy="60" r="54" stroke="currentColor" strokeOpacity={0.08} strokeWidth={1} />
      <circle cx="60" cy="60" r="44" stroke="currentColor" strokeOpacity={0.12} strokeWidth={1} />
    </svg>
  );
}
