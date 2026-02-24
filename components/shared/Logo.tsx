export default function Logo({ size = 'default' }: { size?: 'default' | 'large' }) {
  const scale = size === 'large' ? 1.5 : 1;
  return (
    <svg
      width={140 * scale}
      height={32 * scale}
      viewBox="0 0 140 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Studio icon - play button in circle */}
      <circle cx="16" cy="16" r="13" stroke="url(#logoGrad)" strokeWidth="1.8" fill="none" />
      <path d="M13 10.5l9 5.5-9 5.5V10.5z" fill="url(#logoGrad)" />
      {/* MOTIONMINT text */}
      <text
        x="34"
        y="20"
        fill="white"
        fontSize="13"
        fontWeight="700"
        fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
        letterSpacing="0.5"
      >
        MOTIONMINT
      </text>
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
  );
}
