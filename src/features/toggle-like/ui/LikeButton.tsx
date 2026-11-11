import "../../../shared/ui/roundIconButton.css";
import "./LikeButton.css";
import type { FC } from "react";
import { HeartIcon } from "../../../shared/ui/icons";

interface Props {
  liked: boolean;
  likesCount: number;
  onToggle: () => void;
  disabled: boolean;
}

export const LikeButton: FC<Props> = ({ liked, likesCount, onToggle, disabled }) => (
  <button
    type="button"
    className={`feed-icon-btn like-btn ${liked ? "like-btn--liked" : ""}`}
    title={liked ? "Убрать лайк" : "Нравится"}
    aria-label={liked ? "Убрать лайк" : "Нравится"}
    aria-pressed={liked}
    onClick={onToggle}
    disabled={disabled}
  >
    <span className="feed-icon-btn__circle">
      <HeartIcon />
    </span>
    <span className="like-action__count">{likesCount}</span>
  </button>
);
