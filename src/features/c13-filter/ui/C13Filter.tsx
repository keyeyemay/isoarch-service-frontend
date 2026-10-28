import "./C13Filter.css";
import type { FC } from "react";
import { Button, Form } from "react-bootstrap";

export const C13_MIN = -25;
export const C13_MAX = -10;

interface Props {
  value: string;
  setValue: (value: string) => void;
  onApply: () => void;
  onReset: () => void;
  isApplied: boolean;
}

// Слайдер и числовое поле работают с одним значением value -> всегда синхронизированы
export const C13Filter: FC<Props> = ({ value, setValue, onApply, onReset, isApplied }) => (
  <Form
    className="filter-box"
    onSubmit={(event) => {
      event.preventDefault();
      onApply();
    }}
  >
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
          value={value}
          onChange={(event) => setValue(event.target.value)}
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
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="filter-range"
        aria-label="Максимальное значение δ¹³C"
      />
      <span className="slider-boundary">{C13_MAX} ‰</span>
    </div>

    <div className="filter-box__actions">
      <Button type="submit" variant="primary" size="sm">Применить</Button>
      {isApplied && (
        <Button type="button" variant="secondary" size="sm" onClick={onReset}>Сбросить</Button>
      )}
    </div>
  </Form>
);
