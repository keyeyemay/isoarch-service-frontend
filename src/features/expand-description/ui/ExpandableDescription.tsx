import "./ExpandableDescription.css";
import { useState, type FC } from "react";

interface Props {
  text: string;
}

export const ExpandableDescription: FC<Props> = ({ text }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <p className={`feed__description ${expanded ? "" : "feed__description--collapsed"}`}>{text}</p>
      <button type="button" className="desc-toggle" onClick={() => setExpanded(!expanded)}>
        {expanded ? "Свернуть" : "Ещё"}
      </button>
    </>
  );
};
