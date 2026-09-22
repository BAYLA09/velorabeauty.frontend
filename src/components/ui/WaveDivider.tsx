type Props = {
  flip?: boolean;
  className?: string;
};

export function WaveDivider({ flip = false, className = "" }: Props) {
  return (
    <div
      className={`pointer-events-none leading-[0] ${flip ? "rotate-180" : ""} ${className}`}
      aria-hidden
    >
      <svg
        viewBox="0 0 1440 48"
        className="block h-8 w-full md:h-10"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,32 C360,64 720,0 1080,24 C1260,36 1380,40 1440,32 L1440,48 L0,48 Z"
        />
      </svg>
    </div>
  );
}
