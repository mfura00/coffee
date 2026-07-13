import { Link } from 'react-router-dom';

const Logo = ({ size = 40 }) => (
  <Link to="/" className="logo">
    <svg width={size} height={size} viewBox="0 0 400 400" fill="none">
      <defs>
        <linearGradient id="lBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--logo-dark)"/>
          <stop offset="100%" stopColor="#2E7D32"/>
        </linearGradient>
        <linearGradient id="lBeanL" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4CAF50"/>
          <stop offset="100%" stopColor="#2E7D32"/>
        </linearGradient>
        <linearGradient id="lBeanR" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--logo-light)"/>
          <stop offset="100%" stopColor="var(--logo-dark)"/>
        </linearGradient>
        <linearGradient id="lSteam" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="var(--logo-accent)" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="var(--logo-accent)" stopOpacity="0.2"/>
        </linearGradient>
        <linearGradient id="lGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F3A847"/>
          <stop offset="100%" stopColor="var(--logo-light)"/>
        </linearGradient>
      </defs>
      <circle cx="200" cy="200" r="190" fill="url(#lBg)" stroke="var(--logo-accent)" strokeWidth="4"/>
      <circle cx="200" cy="200" r="175" fill="none" stroke="var(--logo-accent)" strokeWidth="1.5" strokeDasharray="6 6"/>
      <g transform="translate(200,210)">
        <path d="M-6,-65 C-30,-55 -50,-30 -48,0 C-46,30 -30,55 -6,65 C-12,40 -14,0 -12,-30 C-10,-50 -8,-60 -6,-65Z" fill="url(#lBeanL)" opacity="0.95"/>
        <path d="M6,-65 C30,-55 50,-30 48,0 C46,30 30,55 6,65 C12,40 14,0 12,-30 C10,-50 8,-60 6,-65Z" fill="url(#lGold)" opacity="0.95"/>
        <path d="M0,-65 C-2,-30 -2,30 0,65" stroke="var(--logo-dark)" strokeWidth="1.5" opacity="0.5"/>
      </g>
      <g opacity="0.7">
        <path d="M165,160 C150,130 140,100 155,70 C165,50 180,45 185,60 C190,75 185,90 175,95" stroke="url(#lSteam)" strokeWidth="5" fill="none" strokeLinecap="round"/>
        <path d="M235,160 C250,130 260,100 245,70 C235,50 220,45 215,60 C210,75 215,90 225,95" stroke="url(#lSteam)" strokeWidth="5" fill="none" strokeLinecap="round"/>
        <path d="M192,155 C195,125 190,95 200,65 C210,95 205,125 208,155" stroke="url(#lSteam)" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.5"/>
      </g>
      <circle cx="200" cy="55" r="7" fill="#4CAF50" opacity="0.6"/>
      <path d="M100,300 C100,290 140,285 200,285 C260,285 300,290 300,300 C300,310 260,315 200,315 C140,315 100,310 100,300Z" fill="var(--logo-dark)" stroke="var(--logo-accent)" strokeWidth="2"/>
      <text x="200" y="305" textAnchor="middle" fontFamily="Georgia,serif" fontSize="22" fontWeight="bold" fill="var(--logo-accent)" letterSpacing="6">BREW &amp; BEAN</text>
      <path d="M120,195 C110,185 105,175 110,170 C115,165 125,170 130,180 C135,190 130,200 120,195Z" fill="#4CAF50" opacity="0.5"/>
      <path d="M280,195 C290,185 295,175 290,170 C285,165 275,170 270,180 C265,190 270,200 280,195Z" fill="#4CAF50" opacity="0.5"/>
    </svg>
    <span className="logo-text">Brew & Bean</span>
  </Link>
);

export default Logo;
