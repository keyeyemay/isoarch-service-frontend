import "./TabBar.css";
import type { FC, ReactNode } from "react";
import { Nav } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { useIsAuthenticated } from "../../../entities/user";
import { useLogout } from "../../../features/auth";
import { LOGOUT_LABEL, ROUTES, ROUTE_LABELS, type RouteKeyType } from "../../../shared/config/routes";
import { AddIcon, FeedIcon, LoginIcon, LogoutIcon, TilesIcon } from "../../../shared/ui/icons";
import { LoadingOverlay } from "../../../shared/ui/LoadingOverlay";

interface Props {
  onVideo: boolean;
}

const TabLink: FC<{ route: RouteKeyType; icon: ReactNode }> = ({ route, icon }) => (
  <Nav.Link as={NavLink} to={ROUTES[route]} end={route === "TILES"}>
    {icon}
    {ROUTE_LABELS[route]}
  </Nav.Link>
);

export const TabBar: FC<Props> = ({ onVideo }) => {
  const isAuthenticated = useIsAuthenticated();
  const { logout, loading } = useLogout();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.TILES);
  };

  return (
    <Nav as="nav" className={`tab-bar ${onVideo ? "tab-bar--on-video" : ""}`}>
      {loading && <LoadingOverlay />}

      <TabLink route="FEED" icon={<FeedIcon />} />

      {isAuthenticated ? (
        <TabLink route="ADD" icon={<AddIcon />} />
      ) : (
        <Nav.Link as="span" disabled>
          <AddIcon />
          {ROUTE_LABELS.ADD}
        </Nav.Link>
      )}

      <TabLink route="TILES" icon={<TilesIcon />} />

      {isAuthenticated ? (
        <Nav.Link as="button" type="button" onClick={handleLogout} disabled={loading}>
          <LogoutIcon />
          {LOGOUT_LABEL}
        </Nav.Link>
      ) : (
        <TabLink route="LOGIN" icon={<LoginIcon />} />
      )}
    </Nav>
  );
};
