import "./SignatureGrid.css";
import type { FC } from "react";
import { Button, Col, Row } from "react-bootstrap";
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

const GRID_COLUMNS = { xs: 2, sm: 3, md: 4, lg: 3, xl: 4 } as const;

export const SignatureGrid: FC<Props> = ({
  signatures,
  canDelete,
  disabled,
  onOpen,
  onDelete,
  onReset,
}) => (
  <div className="grid">
    {signatures.length > 0 && (
      <Row {...GRID_COLUMNS} className="grid__row">
        {signatures.map((item) => (
          <Col key={item.id} className="grid__col">
            <SignatureTile
              {...item}
              onClick={() => onOpen(item.id)}
              actions={
                canDelete && item.is_creator === 1 ? (
                  <DeleteSignatureButton onDelete={() => onDelete(item.id)} disabled={disabled} />
                ) : null
              }
            />
          </Col>
        ))}
      </Row>
    )}

    {!signatures.length && !disabled && (
      <div className="empty-state">
        <p>Ничего не найдено по заданному фильтру</p>
        <Button variant="secondary" size="sm" onClick={onReset}>Сбросить фильтр</Button>
      </div>
    )}
  </div>
);
