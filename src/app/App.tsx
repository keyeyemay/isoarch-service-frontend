import type { FC } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { FeedPage } from "../pages/feed";
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
        {/* «Добавление» и «Вход» в ЛР5 недоступны */}
        <Route path="*" element={<Navigate to={ROUTES.TILES} replace />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
