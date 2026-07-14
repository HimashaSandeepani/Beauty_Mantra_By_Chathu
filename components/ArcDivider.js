export default function ArcDivider() {
  return (
    <div className="bm-arc-divider" aria-hidden="true">
      <svg viewBox="0 0 140 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M2 26C2 12 20 2 70 2C120 2 138 12 138 26"
          stroke="#B7863E"
          strokeWidth="1.2"
        />
        <circle cx="70" cy="24" r="2" fill="#B7863E" />
      </svg>
    </div>
  );
}
