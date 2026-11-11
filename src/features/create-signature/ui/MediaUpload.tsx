import "./MediaUpload.css";
import type { FC } from "react";
import { DEFAULT_IMAGE, DEFAULT_VIDEO } from "../../../shared/config/media";
import { useFallbackSrc } from "../../../shared/lib/useFallbackSrc";

interface Props {
  imageSrc: string;
  videoSrc: string;
}

export const MediaUpload: FC<Props> = ({ imageSrc, videoSrc }) => {
  const image = useFallbackSrc(imageSrc, DEFAULT_IMAGE);
  const video = useFallbackSrc(videoSrc, DEFAULT_VIDEO);

  return (
    <div className="media-upload">
      <div className="upload-card">
        <div className="upload-card__preview">
          <img src={image.src} alt="Фото образца" onError={image.onError} />
        </div>
        <span className="upload-card__label">Фото образца</span>
      </div>
      <div className="upload-card">
        <div className="upload-card__preview">
          <video src={video.src} onError={video.onError} autoPlay muted loop playsInline />
        </div>
        <span className="upload-card__label">Видео анализа (MP4, до 60 секунд)</span>
      </div>
    </div>
  );
};
