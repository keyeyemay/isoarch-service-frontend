import "./SignatureGrid.css";
import type { FC } from "react";
import { Button } from "react-bootstrap";
import { SignatureTile, type IsotopicSignature } from "../../../entities/isotopic-signature";
import { DeleteSignatureButton } from "../../../features/delete-signature";

interface Props {
  signatures: IsotopicSignature[];
  canDelete: boolean;
  disabled: boolean;
  onOpen: (id: number) => void;
  onDelete: (id: number) => void;
  onReset: () => void;
}

export const SignatureGrid: FC<Props> = ({
  signatures,
  canDelete,
  disabled,
  onOpen,
  onDelete,
  onReset,
}) => (
  <div className="grid">
    {signatures.map((item) => (
      <SignatureTile
        key={item.id}
        {...item}
        onClick={() => onOpen(item.id)}
        actions={
          canDelete && item.is_creator === 1 ? (
            <DeleteSignatureButton onDelete={() => onDelete(item.id)} disabled={disabled} />
          ) : null
        }
      />
    ))}

    {!signatures.length && !disabled && (
      <div className="empty-state">
        <p>Ничего не найдено по заданному фильтру</p>
        <Button variant="secondary" size="sm" onClick={onReset}>Сбросить фильтр</Button>
      </div>
    )}
  </div>
);
