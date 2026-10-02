import type { VerificationStatus } from "../services/verification.service";

// ─────────────────────────────────────────────────────────────────
// Sizes
// ─────────────────────────────────────────────────────────────────
type BadgeSize = "xs" | "sm" | "md";

interface VerificationBadgeProps {
  /** Pass the VerificationStatus string, or a plain boolean (true = VERIFIED) */
  status?: VerificationStatus | boolean | null;
  /** Controls icon + text size */
  size?: BadgeSize;
  /** Show the status label text beside the icon */
  showLabel?: boolean;
  /** Extra Tailwind classes */
  className?: string;
}

const sizeMap: Record<BadgeSize, { icon: string; text: string; pill: string }> = {
  xs: { icon: "w-3 h-3", text: "text-[10px]", pill: "px-1.5 py-0.5 gap-1" },
  sm: { icon: "w-3.5 h-3.5", text: "text-[11px]", pill: "px-2 py-0.5 gap-1.5" },
  md: { icon: "w-4 h-4", text: "text-xs", pill: "px-2.5 py-1 gap-1.5" },
};

/**
 * A compact badge that communicates the user's identity-verification state.
 *
 * - VERIFIED   → teal checkmark shield
 * - PENDING    → amber clock
 * - REJECTED   → red X
 * - MANUAL_REVIEW → purple eye
 * - null/undefined → renders nothing
 */
const VerificationBadge = ({
  status,
  size = "sm",
  showLabel = false,
  className = "",
}: VerificationBadgeProps) => {
  // Normalise boolean shorthand
  const resolvedStatus: VerificationStatus | null =
    status === true
      ? "VERIFIED"
      : status === false || status == null
      ? null
      : (status as VerificationStatus);

  if (!resolvedStatus) return null;

  const s = sizeMap[size];

  const configs: Record<
    VerificationStatus,
    { bg: string; border: string; text: string; label: string; icon: JSX.Element }
  > = {
    VERIFIED: {
      bg: "bg-emerald-500/15",
      border: "border-emerald-500/40",
      text: "text-emerald-400",
      label: "Verified",
      icon: (
        <svg className={s.icon} viewBox="0 0 24 24" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3A5.25 5.25 0 0012 1.5zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5zM9.75 15a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    PENDING: {
      bg: "bg-amber-500/15",
      border: "border-amber-500/40",
      text: "text-amber-400",
      label: "Pending",
      icon: (
        <svg className={s.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    REJECTED: {
      bg: "bg-rose-500/15",
      border: "border-rose-500/40",
      text: "text-rose-400",
      label: "Rejected",
      icon: (
        <svg className={s.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    MANUAL_REVIEW: {
      bg: "bg-purple-500/15",
      border: "border-purple-500/40",
      text: "text-purple-400",
      label: "Under Review",
      icon: (
        <svg className={s.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      ),
    },
  };

  const cfg = configs[resolvedStatus];

  return (
    <span
      title={`Identity ${cfg.label}`}
      className={`inline-flex items-center rounded-full border font-semibold ${s.pill} ${cfg.bg} ${cfg.border} ${cfg.text} ${className}`}
    >
      {cfg.icon}
      {showLabel && <span className={s.text}>{cfg.label}</span>}
    </span>
  );
};

export default VerificationBadge;
