import "../../../shared/ui/form.css";
import "./DraftForm.css";
import { useState, type FC, type FormEvent } from "react";
import { Button, Form } from "react-bootstrap";
import type { NewSignatureData } from "../../../entities/isotopic-signature";
import { useFilePreview } from "../../../shared/lib/useFilePreview";
import { MediaUpload } from "./MediaUpload";

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
    <Form className="draft-form" onSubmit={handleSubmit}>
      <MediaUpload key={`${image.url}|${video.url}`} imageSrc={image.url} videoSrc={video.url} />

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

        <Form.Group controlId="image" className="field">
          <Form.Label className="field__label">Фото: PNG, JPEG, WebP до 10 МиБ *</Form.Label>
          <Form.Control
            className="field__input"
            type="file"
            required
            accept="image/png,image/jpeg,image/webp"
            onChange={image.onChange}
          />
        </Form.Group>

        <Form.Group controlId="video" className="field">
          <Form.Label className="field__label">Видео: MP4 до 64 МиБ и 60 секунд *</Form.Label>
          <Form.Control
            className="field__input"
            type="file"
            required
            accept="video/mp4"
            onChange={video.onChange}
          />
        </Form.Group>
      </div>

      <div className="action-area">
        <Button type="submit" variant="primary" disabled={disabled}>Далее</Button>
      </div>
    </Form>
  );
};
