/**
 * PDP content flags — unverified social proof / certs stay off until real assets exist.
 * Set NEXT_PUBLIC_SHOW_SOCIAL_PROOF=true or NEXT_PUBLIC_SHOW_CERT_BADGES=true when verified.
 */
function envFlag(name: string): boolean {
  return process.env[name] === "true";
}

export const productPageFlags = {
  showSocialProof: envFlag("NEXT_PUBLIC_SHOW_SOCIAL_PROOF"),
  showCertBadges: envFlag("NEXT_PUBLIC_SHOW_CERT_BADGES"),
  /** 68% / 72% ritual overlay blocks — no real study behind them */
  showUnverifiedStatBlocks: false,
} as const;
