import "../../../shared/ui/form.css";
import "./DraftForm.css";
import { useState, type FC, type FormEvent, type ReactNode } from "react";
import { Button, Form } from "react-bootstrap";
import type { PublishSignatureData, SignatureDraft } from "../../../entities/isotopic-signature";
import { MediaUpload } from "./MediaUpload";

interface Props {
  draft: SignatureDraft;
  onPublish: (data: PublishSignatureData) => void;
  deleteAction: ReactNode;
  disabled: boolean;
}

const toInput = (value: number | null) => (value === null ? "" : String(value));

export const PublishDraftForm: FC<Props> = ({ draft, onPublish, deleteAction, disabled }) => {
  const [description, setDescription] = useState(draft.description ?? "");
  const [deltaN15, setDeltaN15] = useState(toInput(draft.delta_n15));
  const [deltaC13, setDeltaC13] = useState(toInput(draft.delta_c13));

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const delta_n15 = Number(deltaN15);
    const delta_c13 = Number(deltaC13);
    if (!description.trim() || deltaN15 === "" || deltaC13 === "") return;
    if (Number.isNaN(delta_n15) || Number.isNaN(delta_c13)) return;
    onPublish({ description: description.trim(), delta_n15, delta_c13 });
  };

  return (
    <Form className="draft-form" onSubmit={handleSubmit}>
      <MediaUpload imageSrc={draft.image_url} videoSrc={draft.video_url} />

      <div className="form-card">
        <Form.Group controlId="description" className="field">
          <Form.Label className="field__label">Краткое описание исследования *</Form.Label>
          <Form.Control
            as="textarea"
            className="field__input"
            rows={3}
            required
            maxLength={10000}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Рацион, условия погребения, выводы"
          />
        </Form.Group>

        <Form.Group controlId="delta_n15" className="field">
          <Form.Label className="field__label">δ¹⁵N (‰) — азот *</Form.Label>
          <Form.Control
            className="field__input"
            type="number"
            step={0.1}
            required
            value={deltaN15}
            onChange={(event) => setDeltaN15(event.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="delta_c13" className="field">
          <Form.Label className="field__label">δ¹³C (‰) — углерод *</Form.Label>
          <Form.Control
            className="field__input"
            type="number"
            step={0.1}
            required
            value={deltaC13}
            onChange={(event) => setDeltaC13(event.target.value)}
          />
        </Form.Group>
      </div>

      <div className="action-area">
        {deleteAction}
        <Button type="submit" variant="primary" disabled={disabled}>Опубликовать</Button>
      </div>
    </Form>
  );
};
