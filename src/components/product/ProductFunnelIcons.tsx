/** أيقونات SVG للـ PDP (بدون emoji) */
export function IconLeaf({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3c-4 4-6 8-6 12a6 6 0 0012 0c0-4-2-8-6-12z"
      />
      <path strokeLinecap="round" d="M12 3v18" />
    </svg>
  );
}

export function IconClock({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M12 7v5l3 2" />
    </svg>
  );
}

export function IconBox({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8l8-4 8 4v8l-8 4-8-4V8z" />
      <path strokeLinecap="round" d="M12 4v16M4 8l8 4 8-4" />
    </svg>
  );
}

export function IconDroplet({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 2.5c3 4 5 7 5 10a5 5 0 01-10 0c0-3 2-6 5-10z"
      />
    </svg>
  );
}

export function IconSparkles({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" d="M12 4l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" />
      <path strokeLinecap="round" d="M6 18l.5 2 2 .5-2 .5L6 23M18 6l.5 2 2 .5-2 .5L18 11" />
    </svg>
  );
}

export function IconStethoscope({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 4v8a6 6 0 0012 0V4M6 4h4M14 4h4" />
      <circle cx="18" cy="18" r="3" />
      <path strokeLinecap="round" d="M18 15v-1a3 3 0 00-3-3h-1" />
    </svg>
  );
}

export function IconCard({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path strokeLinecap="round" d="M3 10h18" />
    </svg>
  );
}

export function IconPhone({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 3h3l1 4-2 1a11 11 0 005 5l1-2 4 1v3a2 2 0 01-2 2A15 15 0 018 5a2 2 0 012-2z"
      />
    </svg>
  );
}

export function IconTruck({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h11v8H3V7z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4l3 3v2h-7v-5z" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}

export function IconCheckCircle({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12l2.5 2.5L16 9" />
    </svg>
  );
}
