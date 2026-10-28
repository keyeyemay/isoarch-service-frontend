import type { FC } from "react";

// Outline-иконки из ЛР2 (templates/partials/_tabbar.html и др.)

export const FeedIcon: FC = () => (
  <svg viewBox="0 0 24 24"><path d="M4 5h16v14H4z" /><path d="M9 9l6 3-6 3z" /></svg>
);

export const AddIcon: FC = () => (
  <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
);

export const TilesIcon: FC = () => (
  <svg viewBox="0 0 24 24">
    <rect x="3" y="3" width="8" height="8" />
    <rect x="13" y="3" width="8" height="8" />
    <rect x="3" y="13" width="8" height="8" />
    <rect x="13" y="13" width="8" height="8" />
  </svg>
);

export const LoginIcon: FC = () => (
  <svg viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" /></svg>
);

export const HeartIcon: FC = () => (
  <svg viewBox="0 0 24 24">
    <path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 3 5 6.5 5 8.7 5 10.5 6.3 12 8c1.5-1.7 3.3-3 5.5-3 3.5 0 6 3.5 4 7.5C19 16.65 12 21 12 21z" />
  </svg>
);

export const ArrowDownIcon: FC = () => (
  <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
);

export const LogoIcon: FC = () => (
  <svg viewBox="0 0 14 19"><path d="M7 0L0 5v9l7 5 7-5V5L7 0z" /></svg>
);
