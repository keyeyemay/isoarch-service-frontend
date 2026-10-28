import "../../../shared/ui/roundIconButton.css";
import "./SignatureSlide.css";
import type { FC } from "react";
import { formatDelta } from "../../../entities/isotopic-signature";
import { ExpandableDescription } from "../../../features/expand-description";
import { NextSignatureButton } from "../../../features/next-signature";
import { DEFAULT_IMAGE, DEFAULT_VIDEO } from "../../../shared/config/media";
import { useFallbackSrc } from "../../../shared/lib/useFallbackSrc";
import { HeartIcon } from "../../../shared/ui/icons";

interface Props {
  title: string;
  description: string | null;
  delta_c13: number | null;
  delta_n15: number | null;
  image_url: string;
  video_url: string;
  likes_count: number;
  onNext: () => void;
}

// Родитель передаёт key={id}: при смене сигнатуры состояние fallback сбрасывается
export const SignatureSlide: FC<Props> = ({
  title,
  description,
  delta_c13,
  delta_n15,
  image_url,
  video_url,
  likes_count,
  onNext,
}) => {
  const video = useFallbackSrc(video_url, DEFAULT_VIDEO);

  return (
    <>
      <video
        className="feed__video"
        src={video.src}
        poster={image_url || DEFAULT_IMAGE}
        onError={video.onError}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="feed__gradient" />

      <div className="feed__overlay">
        <div className="feed__row">
          <div className="feed__info">
            <h1 className="feed__title">{title}</h1>
            {description && <ExpandableDescription text={description} />}
          </div>

          <div className="feed__actions">
            <div className="feed__param-chip" title="Углерод δ¹³C">
              <span className="feed__param-name">δ¹³C</span>
              <span className="feed__param-val">{formatDelta(delta_c13)}</span>
            </div>
            <div className="feed__param-chip" title="Азот δ¹⁵N">
              <span className="feed__param-name">δ¹⁵N</span>
              <span className="feed__param-val">{formatDelta(delta_n15)}</span>
            </div>

            <div className="feed-icon-btn" title="Лайки">
              <span className="feed-icon-btn__circle">
                <HeartIcon />
              </span>
              <span className="like-action__count">{likes_count}</span>
            </div>

            <NextSignatureButton onClick={onNext} />
          </div>
        </div>
      </div>
    </>
  );
};
