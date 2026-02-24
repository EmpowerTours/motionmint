export default function PitchLogo() {
  return (
    <svg width="160" height="40" viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="20" r="13" stroke="url(#pitchLogoGrad)" strokeWidth="1.8" fill="none" />
      <path d="M13 14l9 6-9 6V14z" fill="url(#pitchLogoGrad)" />
      <text x="34" y="24" fill="white" fontSize="14" fontWeight="700" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" letterSpacing="0.5">
        EMPOWERSTUDIO
      </text>
      <defs>
        <linearGradient id="pitchLogoGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
  );
}
