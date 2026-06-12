import { motion } from "framer-motion";
import type { ArrayVisualState } from "../../domain/types";

/** An array as a row of cells with index labels, named pointers that glide
 *  between cells, and optional highlighted cells. */
export function ArrayVisual({ title, items, pointers = {}, highlighted = [] }: ArrayVisualState) {
  return (
    <div className="visual-block">
      {title && <div className="visual-title">{title}</div>}
      <div className="array-row">
        {items.map((value, i) => {
          const pointerNames = Object.entries(pointers)
            .filter(([, idx]) => idx === i)
            .map(([name]) => name);
          return (
            <div className="array-col" key={i}>
              <motion.div
                className={`array-cell${highlighted.includes(i) ? " cell-highlighted" : ""}`}
                animate={{ scale: highlighted.includes(i) ? 1.08 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
              >
                {value}
              </motion.div>
              <div className="array-index">{i}</div>
              <div className="pointer-slot">
                {pointerNames.map((name) => (
                  <motion.div
                    key={name}
                    layoutId={`pointer-${name}`}
                    className="pointer"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  >
                    ▲ {name}
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
