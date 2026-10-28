import "./AppLayout.css";
import { useState, type FC } from "react";
import { Outlet, useLocation } from "react-router-dom";
import type {
  IsotopicSignature,
  SignaturesOutletContext,
} from "../entities/isotopic-signature";
import { ROUTES } from "../shared/config/routes";
import { TabBar } from "../widgets/tab-bar";

export const AppLayout: FC = () => {
  // Общий список для плитки и ленты; передаётся через Outlet context (не React Context)
  const [signatures, setSignatures] = useState<IsotopicSignature[]>([]);
  const location = useLocation();

  const context: SignaturesOutletContext = { signatures, setSignatures };

  return (
    <div className="app-shell">
      <Outlet context={context} />
      <TabBar onVideo={location.pathname.startsWith(ROUTES.FEED)} />
    </div>
  );
};
