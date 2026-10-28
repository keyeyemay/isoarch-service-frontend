import "./TabBar.css";
import type { FC, ReactNode } from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { ROUTES, ROUTE_LABELS, type RouteKeyType } from "../../../shared/config/routes";
import { AddIcon, FeedIcon, LoginIcon, TilesIcon } from "../../../shared/ui/icons";

interface Tab {
  key: RouteKeyType;
  icon: ReactNode;
  enabled: boolean;
}

const TABS: Tab[] = [
  { key: "FEED", icon: <FeedIcon />, enabled: true },
  { key: "ADD", icon: <AddIcon />, enabled: false },
  { key: "TILES", icon: <TilesIcon />, enabled: true },
  { key: "LOGIN", icon: <LoginIcon />, enabled: false },
];

interface Props {
  onVideo: boolean;
}

export const TabBar: FC<Props> = ({ onVideo }) => (
  <Nav as="nav" className={`tab-bar ${onVideo ? "tab-bar--on-video" : ""}`}>
    {TABS.map(({ key, icon, enabled }) =>
      enabled ? (
        // NavLink сам добавляет класс active по текущему URL; "/" сравнивается точно (end)
        <Nav.Link key={key} as={NavLink} to={ROUTES[key]} end={key === "TILES"}>
          {icon}
          {ROUTE_LABELS[key]}
        </Nav.Link>
      ) : (
        <Nav.Link key={key} as="span" disabled>
          {icon}
          {ROUTE_LABELS[key]}
        </Nav.Link>
      ),
    )}
  </Nav>
);
