import "../../../shared/ui/roundIconButton.css";
import type { FC } from "react";
import { ArrowDownIcon } from "../../../shared/ui/icons";

interface Props {
  onClick: () => void;
}

export const NextSignatureButton: FC<Props> = ({ onClick }) => (
  <button
    type="button"
    className="feed-icon-btn"
    title="Следующая сигнатура"
    aria-label="Следующая сигнатура"
    onClick={onClick}
  >
    <span className="feed-icon-btn__circle feed-icon-btn__circle--accent">
      <ArrowDownIcon />
    </span>
  </button>
);
