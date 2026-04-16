/** Decoración tipo “radar” / anillos concéntricos junto al borde del mockup. */
export default function LoginRadarDecor() {
  return (
    <svg className="tc-login-radar" viewBox="0 0 220 220" aria-hidden>
      <circle cx="110" cy="110" r="105" fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="1" strokeDasharray="10 8" />
      <circle cx="110" cy="110" r="82" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1" strokeDasharray="6 10" />
      <circle cx="110" cy="110" r="58" fill="none" stroke="rgba(0,0,0,0.09)" strokeWidth="1" strokeDasharray="4 8" />
      <circle cx="110" cy="110" r="34" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
      <line x1="110" y1="5" x2="110" y2="215" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
      <line x1="5" y1="110" x2="215" y2="110" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
    </svg>
  );
}
