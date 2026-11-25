import "../../../shared/ui/page.css";
import type { FC } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useIsAuthenticated } from "../../../entities/user";
import { LoginForm } from "../../../features/auth";
import { ROUTES } from "../../../shared/config/routes";
import { TopNav } from "../../../widgets/top-nav";

export const LoginPage: FC = () => {
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const location = useLocation();
  const from: string = location.state?.from ?? ROUTES.TILES;

  if (isAuthenticated) return <Navigate to={ROUTES.TILES} replace />;

  return (
    <>
      <TopNav />
      <main className="page-main page-main--narrow">
        <div className="page-header">
          <h1 className="page-title">Вход</h1>
          <div className="page-title__bar" />
        </div>
        <p className="helper">
          Войдите, чтобы добавлять исследования, удалять свои записи и ставить лайки.
        </p>
        <LoginForm onSuccess={() => navigate(from, { replace: true })} />
      </main>
    </>
  );
};
