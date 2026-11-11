import "./FeedPage.css";
import { useEffect, type FC } from "react";
import { Button } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getSignature,
  getSignaturesList,
  toggleLike,
  useCurrentSignature,
  useSignatures,
  useSignaturesError,
  useSignaturesLoading,
} from "../../../entities/isotopic-signature";
import { useIsAuthenticated } from "../../../entities/user";
import { ROUTES } from "../../../shared/config/routes";
import { useAppDispatch } from "../../../shared/lib/redux";
import { SignatureSlide } from "../../../widgets/signature-slide";

export const FeedPage: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const signatures = useSignatures();
  const current = useCurrentSignature();
  const loading = useSignaturesLoading();
  const error = useSignaturesError();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (!signatures.length) dispatch(getSignaturesList());
  }, [dispatch, signatures.length]);

  useEffect(() => {
    if (id) dispatch(getSignature(Number(id)));
  }, [dispatch, id]);

  useEffect(() => {
    if (!id && signatures.length) {
      navigate(`${ROUTES.FEED}/${signatures[0].id}`, { replace: true });
    }
  }, [id, signatures, navigate]);

  const signature = current && String(current.id) === id ? current : null;

  const handleNext = () => {
    if (!signatures.length) return;
    const index = signatures.findIndex((item) => String(item.id) === id);
    const next = signatures[(index + 1) % signatures.length];
    navigate(`${ROUTES.FEED}/${next.id}`);
  };

  const handleLike = () => {
    if (!signature) return;
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, { state: { from: location.pathname } });
      return;
    }
    dispatch(toggleLike({ id: signature.id, like: signature.is_liked ? 0 : 1 }));
  };

  return (
    <main className="feed">
      {signature ? (
        <SignatureSlide
          key={signature.id}
          {...signature}
          liked={isAuthenticated && signature.is_liked === 1}
          disabled={loading}
          onLike={handleLike}
          onNext={handleNext}
        />
      ) : (
        !loading && (
          <div className="feed__empty">
            <p>{error ?? (id ? "Сигнатура не найдена" : "Лента пуста")}</p>
            <Button variant="secondary" size="sm" onClick={() => navigate(ROUTES.TILES)}>
              К плитке
            </Button>
          </div>
        )
      )}
    </main>
  );
};
