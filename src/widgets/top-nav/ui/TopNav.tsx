import "./TopNav.css";
import type { FC } from "react";
import { LogoIcon } from "../../../shared/ui/icons";

export const TopNav: FC = () => (
  <header className="top-nav">
    <div className="top-nav__logo">
      <LogoIcon />
      IsoArch
    </div>
  </header>
);
