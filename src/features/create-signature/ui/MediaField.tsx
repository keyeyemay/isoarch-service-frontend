import "./MediaUpload.css";
import "./MediaField.css";
import type { ChangeEvent, FC } from "react";
import { Form } from "react-bootstrap";
import { useFallbackSrc } from "../../../shared/lib/useFallbackSrc";

type MediaKind = "image" | "video";

interface PreviewProps {
  kind: MediaKind;
  src: string;
  fallback: string;
  alt: string;
}

const MediaPreview: FC<PreviewProps> = ({ kind, src, fallback, alt }) => {
  const media = useFallbackSrc(src, fallback);

  return (
    <div className="upload-card__preview">
      {kind === "image" ? (
        <img src={media.src} alt={alt} onError={media.onError} />
      ) : (
        <video src={media.src} onError={media.onError} autoPlay muted loop playsInline />
      )}
    </div>
  );
};

interface Props {
  kind: MediaKind;
  controlId: string;
  label: string;
  hint: string;
  accept: string;
  src: string;
  fallback: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const MediaField: FC<Props> = ({ kind, controlId, label, hint, accept, src, fallback, onChange }) => (
  <div className="media-field form-card">
    <MediaPreview key={src} kind={kind} src={src} fallback={fallback} alt={label} />

    <Form.Group controlId={controlId} className="field media-field__control">
      <Form.Label className="field__label">{label} *</Form.Label>
      <Form.Control
        className="field__input"
        type="file"
        required
        accept={accept}
        onChange={onChange}
      />
      <span className="media-field__hint">{hint}</span>
    </Form.Group>
  </div>
);
