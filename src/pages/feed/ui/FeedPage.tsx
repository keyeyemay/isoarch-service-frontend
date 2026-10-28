import "./FeedPage.css";
import { useEffect, type FC } from "react";
import { Button, Spinner } from "react-bootstrap";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import {
  getIsotopicSignatures,
  type SignaturesOutletContext,
} from "../../../entities/isotopic-signature";
import { ROUTES } from "../../../shared/config/routes";
import { SignatureSlide } from "../../../widgets/signature-slide";

export const FeedPage: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // Список общий с плиткой: порядок «Следующий» совпадает с порядком карточек
  const { signatures, setSignatures } = useOutletContext<SignaturesOutletContext>();

  // Лента открыта по прямой ссылке, плитку ещё не загружали -> берём весь mock
  useEffect(() => {
    if (!signatures.length) {
      getIsotopicSignatures().then(setSignatures);
    }
  }, [signatures.length, setSignatures]);

  // Без id в адресе показываем первую сигнатуру списка
  const index = id ? signatures.findIndex((item) => String(item.id) === id) : 0;
  const signature = signatures[index];

  // Переход к следующему элементу списка (не id + 1), после последнего — снова первый
  const handleNext = () => {
    const next = signatures[(index + 1) % signatures.length];
    navigate(`${ROUTES.FEED}/${next.id}`);
  };

  return (
    <main className="feed">
      {signature ? (
        <SignatureSlide key={signature.id} {...signature} onNext={handleNext} />
      ) : (
        <div className="feed__empty">
          {signatures.length ? (
            <>
              <p>Сигнатура не найдена</p>
              <Button variant="secondary" size="sm" onClick={() => navigate(ROUTES.TILES)}>
                К плитке
              </Button>
            </>
          ) : (
            <Spinner animation="border" />
          )}
        </div>
      )}
    </main>
  );
};
