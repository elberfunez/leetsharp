import type { VisualState } from "../domain/types";
import { ArrayVisual } from "./visuals/ArrayVisual";
import { DictVisual } from "./visuals/DictVisual";
import { SetVisual } from "./visuals/SetVisual";
import { StackVisual } from "./visuals/StackVisual";
import { LinkedListVisual } from "./visuals/LinkedListVisual";
import { TreeVisual } from "./visuals/TreeVisual";

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
          case "set":
            return <SetVisual key={i} {...visual} />;
          case "stack":
            return <StackVisual key={i} {...visual} />;
          case "linkedlist":
            return <LinkedListVisual key={i} {...visual} />;
          case "tree":
            return <TreeVisual key={i} {...visual} />;
        }
      })}
    </div>
  );
}
