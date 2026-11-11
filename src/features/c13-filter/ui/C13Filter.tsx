import "./C13Filter.css";
import type { FC } from "react";
import { Button, Form } from "react-bootstrap";
import { C13_MAX, C13_MIN } from "../../../entities/isotopic-signature";

interface Props {
  c13Value: string;
  title: string;
  setC13Value: (value: string) => void;
  setTitle: (value: string) => void;
  onApply: () => void;
  onReset: () => void;
  isApplied: boolean;
  disabled: boolean;
}

export const C13Filter: FC<Props> = ({
  c13Value,
  title,
  setC13Value,
  setTitle,
  onApply,
  onReset,
  isApplied,
  disabled,
}) => (
  <Form
    className="filter-box"
    onSubmit={(event) => {
      event.preventDefault();
      onApply();
    }}
  >
    <Form.Control
      type="search"
      placeholder="Поиск по названию"
      aria-label="Поиск по названию"
      maxLength={255}
      value={title}
      onChange={(event) => setTitle(event.target.value)}
      className="filter-title-input"
    />

    <div className="filter-box__header">
      <Form.Label htmlFor="c13_num" className="filter-box__label mb-0">
        Фильтр по углероду (δ¹³C):
      </Form.Label>
      <div className="filter-number-wrap">
        <span className="filter-prefix">до</span>
        <Form.Control
          id="c13_num"
          type="number"
          step={0.1}
          min={C13_MIN}
          max={C13_MAX}
          value={c13Value}
          onChange={(event) => setC13Value(event.target.value)}
          className="filter-number-input"
        />
        <span className="filter-unit">‰</span>
      </div>
    </div>

    <div className="filter-slider-wrap">
      <span className="slider-boundary">{C13_MIN} ‰</span>
      <Form.Range
        min={C13_MIN}
        max={C13_MAX}
        step={0.5}
        value={c13Value === "" ? C13_MAX : c13Value}
        onChange={(event) => setC13Value(event.target.value)}
        className="filter-range"
        aria-label="Максимальное значение δ¹³C"
      />
      <span className="slider-boundary">{C13_MAX} ‰</span>
    </div>

    <div className="filter-box__actions">
      <Button type="submit" variant="primary" size="sm" disabled={disabled}>
        Применить
      </Button>
      {isApplied && (
        <Button type="button" variant="secondary" size="sm" onClick={onReset} disabled={disabled}>
          Сбросить
        </Button>
      )}
    </div>
  </Form>
);
