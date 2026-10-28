import "./SignatureTile.css";
import type { FC } from "react";
import { Card } from "react-bootstrap";
import { DEFAULT_IMAGE } from "../../../../shared/config/media";
import { useFallbackSrc } from "../../../../shared/lib/useFallbackSrc";
import { HeartIcon } from "../../../../shared/ui/icons";
import { formatDelta } from "../../lib/formatDelta";

interface Props {
  title: string;
  image_url: string;
  delta_c13: number | null;
  delta_n15: number | null;
  likes_count: number;
  onClick: () => void;
}

export const SignatureTile: FC<Props> = ({
  title,
  image_url,
  delta_c13,
  delta_n15,
  likes_count,
  onClick,
}) => {
  const image = useFallbackSrc(image_url, DEFAULT_IMAGE);

  return (
    <Card
      className="tile"
      role="link"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => event.key === "Enter" && onClick()}
    >
      <div className="tile__image-wrap">
        <Card.Img className="tile__image" src={image.src} alt={title} onError={image.onError} />
      </div>
      <Card.Body className="tile__body">
        <Card.Title as="p" className="tile__title">{title}</Card.Title>
        <div className="tile__params">
          <span className="tile__param-badge tile__param-badge--c13">δ¹³C: {formatDelta(delta_c13)}</span>
          <span className="tile__param-badge tile__param-badge--n15">δ¹⁵N: {formatDelta(delta_n15)}</span>
        </div>
      </Card.Body>
      <div className="tile__footer">
        <div className="tile__likes">
          <HeartIcon />
          <span>{likes_count}</span>
        </div>
      </div>
    </Card>
  );
};
