import "./AppLayout.css";
import type { FC } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useSignaturesLoading } from "../entities/isotopic-signature";
import { ROUTES } from "../shared/config/routes";
import { LoadingOverlay } from "../shared/ui/LoadingOverlay";
import { TabBar } from "../widgets/tab-bar";

export const AppLayout: FC = () => {
  const location = useLocation();
  const loading = useSignaturesLoading();

  return (
    <div className="app-shell">
      <Outlet />
      <TabBar onVideo={location.pathname.startsWith(ROUTES.FEED)} />
      {loading && <LoadingOverlay />}
    </div>
  );
};
