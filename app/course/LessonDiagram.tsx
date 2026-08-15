import type { ReactNode } from "react";

type LessonDiagramProps = {
  children: ReactNode;
  description: string;
  eyebrow: string;
  title: string;
  tone?: "dark" | "paper";
};

export default function LessonDiagram({ children, description, eyebrow, title, tone = "dark" }: LessonDiagramProps) {
  return <figure className={`lesson-concept-diagram lesson-concept-diagram-${tone}`} role="img" aria-label={`${title} ${description}`}>
    <div className="lesson-concept-diagram-head">
      <span>{eyebrow}</span>
      <i aria-hidden="true" />
      <small>ANIMATED SVG</small>
    </div>
    <div className="lesson-concept-diagram-canvas" aria-hidden="true">{children}</div>
    <figcaption>
      <b>{title}</b>
      <p>{description}</p>
    </figcaption>
  </figure>;
}
