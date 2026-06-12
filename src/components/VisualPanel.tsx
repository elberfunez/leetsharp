import type { VisualState } from "../domain/types";
import { ArrayVisual } from "./visuals/ArrayVisual";
import { DictVisual } from "./visuals/DictVisual";

interface Props {
  visuals: VisualState[];
}

/** Dispatches each visual in the current step to its renderer.
 *  Adding a new visual type = add a renderer + a case here. */
export function VisualPanel({ visuals }: Props) {
  return (
    <div className="visual-panel">
      {visuals.map((visual, i) => {
        switch (visual.type) {
          case "array":
            return <ArrayVisual key={i} {...visual} />;
          case "dict":
            return <DictVisual key={i} {...visual} />;
        }
      })}
    </div>
  );
}
