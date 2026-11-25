import "../../../shared/ui/form.css";
import "./DraftForm.css";
import { useState, type FC, type FormEvent } from "react";
import { Button, Form } from "react-bootstrap";
import type { NewSignatureData } from "../../../entities/isotopic-signature";
import { DEFAULT_IMAGE, DEFAULT_VIDEO } from "../../../shared/config/media";
import { useFilePreview } from "../../../shared/lib/useFilePreview";
import { MediaField } from "./MediaField";

interface Props {
  onCreate: (data: NewSignatureData) => void;
  disabled: boolean;
}

export const CreateDraftForm: FC<Props> = ({ onCreate, disabled }) => {
  const [title, setTitle] = useState("");
  const image = useFilePreview();
  const video = useFilePreview();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (title.trim() && image.file && video.file) {
      onCreate({ title: title.trim(), image: image.file, video: video.file });
    }
  };

  return (
    <Form className="draft-form draft-form--create" onSubmit={handleSubmit}>
      <div className="form-card">
        <Form.Group controlId="title" className="field">
          <Form.Label className="field__label">Название сигнатуры *</Form.Label>
          <Form.Control
            className="field__input"
            type="text"
            required
            maxLength={255}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Например: Погребение №15 (Бронза)"
          />
        </Form.Group>
      </div>

      <MediaField
        kind="image"
        controlId="image"
        label="Фото образца"
        hint="PNG, JPEG, WebP до 10 МиБ"
        accept="image/png,image/jpeg,image/webp"
        src={image.url}
        fallback={DEFAULT_IMAGE}
        onChange={image.onChange}
      />

      <MediaField
        kind="video"
        controlId="video"
        label="Видео анализа"
        hint="MP4 до 64 МиБ и 60 секунд"
        accept="video/mp4"
        src={video.url}
        fallback={DEFAULT_VIDEO}
        onChange={video.onChange}
      />

      <div className="action-area">
        <Button type="submit" variant="primary" disabled={disabled}>Далее</Button>
      </div>
    </Form>
  );
};
