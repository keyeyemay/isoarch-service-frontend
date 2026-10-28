import "./SignatureGrid.css";
import type { FC } from "react";
import { Button } from "react-bootstrap";
import { SignatureTile, type IsotopicSignature } from "../../../entities/isotopic-signature";

interface Props {
  signatures: IsotopicSignature[];
  onOpen: (id: number) => void;
  onReset: () => void;
}

export const SignatureGrid: FC<Props> = ({ signatures, onOpen, onReset }) => (
  <div className="grid">
    {signatures.map((item) => (
      <SignatureTile key={item.id} {...item} onClick={() => onOpen(item.id)} />
    ))}

    {!signatures.length && (
      <div className="empty-state">
        <p>Ничего не найдено по заданному фильтру</p>
        <Button variant="secondary" size="sm" onClick={onReset}>Сбросить фильтр</Button>
      </div>
    )}
  </div>
);
