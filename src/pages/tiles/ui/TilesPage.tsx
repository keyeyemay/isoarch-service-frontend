import "./TilesPage.css";
import { useEffect, useState, type FC } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  getIsotopicSignatures,
  type IsotopicSignature,
  type SignaturesOutletContext,
} from "../../../entities/isotopic-signature";
import { C13Filter, C13_MAX, C13_MIN } from "../../../features/c13-filter";
import { ROUTES } from "../../../shared/config/routes";
import { SignatureGrid } from "../../../widgets/signature-grid";
import { TopNav } from "../../../widgets/top-nav";

export const TilesPage: FC = () => {
  // Массив сигнатур хранится на верхнем уровне страницы и сверху вниз уходит в карточки
  const [signatures, setSignatures] = useState<IsotopicSignature[]>([]);
  // Значение в полях фильтра и значение, по которому список отфильтрован сейчас
  const [c13Value, setC13Value] = useState(String(C13_MAX));
  const [appliedC13, setAppliedC13] = useState<number | null>(null);

  const { setSignatures: setFeedSignatures } = useOutletContext<SignaturesOutletContext>();
  const navigate = useNavigate();

  // Выполняется после отрисовки и при каждом применении фильтра
  useEffect(() => {
    getIsotopicSignatures(appliedC13 ?? undefined).then((list) => {
      setSignatures(list);
      // Лента листает тот же список и в том же порядке, что показан в плитке
      setFeedSignatures(list);
    });
  }, [appliedC13, setFeedSignatures]);

  const handleApply = () => {
    const value = Number(c13Value);
    if (c13Value === "" || Number.isNaN(value)) {
      return;
    }
    const clamped = Math.min(C13_MAX, Math.max(C13_MIN, value));
    setC13Value(String(clamped));
    setAppliedC13(clamped);
  };

  const handleReset = () => {
    setC13Value(String(C13_MAX));
    setAppliedC13(null);
  };

  const handleOpen = (id: number) => {
    navigate(`${ROUTES.FEED}/${id}`);
  };

  return (
    <>
      <TopNav />
      <main className="page-main">
        <div className="page-header">
          <h1 className="page-title">Изотопные сигнатуры</h1>
          <div className="page-title__bar" />
        </div>

        <C13Filter
          value={c13Value}
          setValue={setC13Value}
          onApply={handleApply}
          onReset={handleReset}
          isApplied={appliedC13 !== null}
        />

        <SignatureGrid signatures={signatures} onOpen={handleOpen} onReset={handleReset} />
      </main>
    </>
  );
};
