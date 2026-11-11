import "./LoadingOverlay.css";
import type { FC } from "react";
import { Spinner } from "react-bootstrap";

export const LoadingOverlay: FC = () => (
  <div className="loading-overlay" role="status" aria-live="polite">
    <Spinner animation="border" />
    <span className="visually-hidden">Загрузка…</span>
  </div>
);
