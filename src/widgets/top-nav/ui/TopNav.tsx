import "./TopNav.css";
import type { FC } from "react";
import { useUsername } from "../../../entities/user";
import { LogoIcon } from "../../../shared/ui/icons";

export const TopNav: FC = () => {
  const username = useUsername();

  return (
    <header className="top-nav">
      <div className="top-nav__logo">
        <LogoIcon />
        IsoArch
      </div>
      {username && (
        <span className="top-nav__user" title="Вы вошли как">
          {username}
        </span>
      )}
    </header>
  );
};
