import type { FC } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AddPage } from "../pages/add";
import { FeedPage } from "../pages/feed";
import { LoginPage } from "../pages/login";
import { TilesPage } from "../pages/tiles";
import { ROUTES } from "../shared/config/routes";
import { AppLayout } from "./AppLayout";

export const App: FC = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<AppLayout />}>
        <Route path={ROUTES.TILES} element={<TilesPage />} />
        <Route path={ROUTES.FEED} element={<FeedPage />} />
        <Route path={`${ROUTES.FEED}/:id`} element={<FeedPage />} />
        <Route path={ROUTES.ADD} element={<AddPage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path="*" element={<Navigate to={ROUTES.TILES} replace />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
