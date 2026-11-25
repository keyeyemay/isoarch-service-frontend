import "../../../shared/ui/page.css";
import "./TilesPage.css";
import { useEffect, type FC } from "react";
import { Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  applyFilterAction,
  deleteSignature,
  getSignaturesList,
  resetFilterAction,
  setC13InputAction,
  setTitleInputAction,
  useAppliedSignatureFilter,
  useSignatureFilter,
  useSignatures,
  useSignaturesError,
  useSignaturesIsMock,
  useSignaturesLoading,
} from "../../../entities/isotopic-signature";
import { useIsAuthenticated } from "../../../entities/user";
import { C13Filter } from "../../../features/c13-filter";
import { IS_MOCK_ONLY } from "../../../shared/config/api";
import { ROUTES } from "../../../shared/config/routes";
import { useAppDispatch } from "../../../shared/lib/redux";
import { SignatureGrid } from "../../../widgets/signature-grid";
import { TopNav } from "../../../widgets/top-nav";

export const TilesPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const signatures = useSignatures();
  const filter = useSignatureFilter();
  const appliedFilter = useAppliedSignatureFilter();
  const loading = useSignaturesLoading();
  const error = useSignaturesError();
  const isMock = useSignaturesIsMock();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    dispatch(getSignaturesList());
  }, [dispatch, isAuthenticated]);

  const handleApply = () => {
    dispatch(applyFilterAction());
    dispatch(getSignaturesList());
  };

  const handleReset = () => {
    dispatch(resetFilterAction());
    dispatch(getSignaturesList());
  };

  const handleOpen = (id: number) => {
    navigate(`${ROUTES.FEED}/${id}`);
  };

  const handleDelete = (id: number) => {
    dispatch(deleteSignature(id));
  };

  return (
    <>
      <TopNav />
      <main className="page-main">
        <div className="page-header">
          <h1 className="page-title">Изотопные сигнатуры</h1>
          <div className="page-title__bar" />
        </div>

        <div className="tiles-layout">
          <aside className="tiles-layout__filters">
            <C13Filter
              c13Value={filter.c13Max}
              title={filter.title}
              setC13Value={(value) => dispatch(setC13InputAction(value))}
              setTitle={(value) => dispatch(setTitleInputAction(value))}
              onApply={handleApply}
              onReset={handleReset}
              isApplied={appliedFilter.c13Max !== null || appliedFilter.title !== ""}
              disabled={loading}
            />

            {isMock && (
              <Alert variant="warning" className="page-alert">
                {IS_MOCK_ONLY
                  ? "Демо-версия на GitHub Pages — показаны mock-данные"
                  : "Сервер недоступен — показаны демонстрационные данные"}
              </Alert>
            )}
            {error && <Alert variant="danger" className="page-alert">{error}</Alert>}
          </aside>

          <section className="tiles-layout__grid" aria-label="Каталог сигнатур">
            <SignatureGrid
              signatures={signatures}
              canDelete={isAuthenticated}
              disabled={loading}
              onOpen={handleOpen}
              onDelete={handleDelete}
              onReset={handleReset}
            />
          </section>
        </div>
      </main>
    </>
  );
};
