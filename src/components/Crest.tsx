export default function Crest({ size = 46 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="23" cy="23" r="22" fill="#163D73" stroke="#C9A84C" strokeWidth="1.8" />
      <circle cx="23" cy="23" r="17.5" fill="none" stroke="#C9A84C" strokeWidth=".8" strokeDasharray="2 2" />
      <circle cx="23" cy="20" r="5" fill="none" stroke="#E8ECF5" strokeWidth="1.8" />
      <circle cx="23" cy="20" r="2" fill="#C9A84C" />
      <rect x="22.2" y="12.5" width="1.6" height="3" rx=".8" fill="#E8ECF5" />
      <rect x="22.2" y="24.5" width="1.6" height="3" rx=".8" fill="#E8ECF5" />
      <rect x="14.5" y="19.2" width="3" height="1.6" rx=".8" fill="#E8ECF5" />
      <rect x="28.5" y="19.2" width="3" height="1.6" rx=".8" fill="#E8ECF5" />
      <rect x="16.2" y="14.2" width="3" height="1.6" rx=".8" fill="#E8ECF5" transform="rotate(45 16.2 14.2)" />
      <rect x="27.2" y="14.2" width="3" height="1.6" rx=".8" fill="#E8ECF5" transform="rotate(-45 27.2 14.2)" />
      <rect x="16.2" y="25.2" width="3" height="1.6" rx=".8" fill="#E8ECF5" transform="rotate(-45 16.2 25.2)" />
      <rect x="27.2" y="25.2" width="3" height="1.6" rx=".8" fill="#E8ECF5" transform="rotate(45 27.2 25.2)" />
      <rect x="16" y="28" width="14" height="8.5" rx="1" fill="#2A5CA8" />
      <line x1="23" y1="28" x2="23" y2="36.5" stroke="#C9A84C" strokeWidth="1" />
      <line x1="17" y1="30" x2="22" y2="30" stroke="#E8ECF5" strokeWidth=".9" />
      <line x1="17" y1="32" x2="22" y2="32" stroke="#E8ECF5" strokeWidth=".9" />
      <line x1="17" y1="34" x2="22" y2="34" stroke="#E8ECF5" strokeWidth=".9" />
      <line x1="24" y1="30" x2="29" y2="30" stroke="#E8ECF5" strokeWidth=".9" />
      <line x1="24" y1="32" x2="29" y2="32" stroke="#E8ECF5" strokeWidth=".9" />
      <line x1="24" y1="34" x2="29" y2="34" stroke="#E8ECF5" strokeWidth=".9" />
    </svg>
  );
}
