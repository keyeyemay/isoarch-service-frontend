import type { FC } from "react";
import { Button } from "react-bootstrap";
import { TrashIcon } from "../../../shared/ui/icons";

interface Props {
  onDelete: () => void;
  disabled: boolean;
  label?: string;
  confirmText?: string;
}

export const DeleteSignatureButton: FC<Props> = ({
  onDelete,
  disabled,
  label = "Удалить",
  confirmText = "Удалить сигнатуру? Она исчезнет из ленты и плитки.",
}) => (
  <Button
    type="button"
    variant="secondary"
    size="sm"
    disabled={disabled}
    onClick={() => {
      if (window.confirm(confirmText)) onDelete();
    }}
  >
    <TrashIcon />
    {label}
  </Button>
);
