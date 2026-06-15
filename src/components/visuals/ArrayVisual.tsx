import { motion } from "framer-motion";
import type { ArrayVisualState } from "../../domain/types";

/** An array as a row of cells with index labels, named pointers that glide
 *  between cells, highlighted cells, and dimmed (discarded) cells. */
export function ArrayVisual({
  title,
  items,
  pointers = {},
  highlighted = [],
  dimmed = [],
}: ArrayVisualState) {
  return (
    <div className="visual-block">
      {title && <div className="visual-title">{title}</div>}
      <div className="array-row">
        {items.map((value, i) => {
          const pointerNames = Object.entries(pointers)
            .filter(([, idx]) => idx === i)
            .map(([name]) => name);
          const cellClass = [
            "array-cell",
            highlighted.includes(i) ? "cell-highlighted" : "",
            dimmed.includes(i) ? "cell-dimmed" : "",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <div className="array-col" key={i}>
              <div className="pointer-slot-top">
                {pointerNames.map((name) => (
                  <motion.div
                    key={name}
                    layoutId={`pointer-${name}`}
                    className="pointer"
                    animate={{ y: [0, 5, 0] }}
                    transition={{
                      y: { duration: 0.85, repeat: Infinity, ease: "easeInOut" },
                      layout: { type: "spring", stiffness: 350, damping: 28 },
                    }}
                  >
                    <span className="pointer-label">{name}</span>
                    <span className="pointer-arrow">▼</span>
                  </motion.div>
                ))}
              </div>
              <motion.div
                className={cellClass}
                animate={{
                  scale: highlighted.includes(i) ? 1.08 : 1,
                  opacity: dimmed.includes(i) ? 0.3 : 1,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
              >
                {value}
              </motion.div>
              <div className="array-index">{i}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
