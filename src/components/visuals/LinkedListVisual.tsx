import { motion } from "framer-motion";
import { Fragment } from "react";
import type { LinkedListVisualState } from "../../domain/types";

/** A linked list as a fixed row of nodes. Nodes never move — the arrows in
 *  the gaps between them flip direction as next pointers are reassigned,
 *  which makes a reversal literally visible. Nodes whose next is null get
 *  a ∅ badge. Named pointers (prev/cur/next) glide between nodes. */
export function LinkedListVisual({
  title,
  values,
  next,
  pointers = {},
  highlighted = [],
}: LinkedListVisualState) {
  return (
    <div className="visual-block">
      {title && <div className="visual-title">{title}</div>}
      <div className="list-row">
        {values.map((value, i) => {
          const pointerNames = Object.entries(pointers)
            .filter(([, idx]) => idx === i)
            .map(([name]) => name);
          const pointsRight = next[i] === i + 1;
          const leftNeighborPointsBack = i + 1 < values.length && next[i + 1] === i;
          return (
            <Fragment key={i}>
              <div className="list-col">
                <motion.div
                  className={`list-node${highlighted.includes(i) ? " cell-highlighted" : ""}`}
                  animate={{ scale: highlighted.includes(i) ? 1.08 : 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                >
                  {value}
                  {next[i] === null && <span className="list-null-badge">∅</span>}
                </motion.div>
                <div className="pointer-slot">
                  {pointerNames.map((name) => (
                    <motion.div
                      key={name}
                      layoutId={`list-pointer-${name}`}
                      className="pointer"
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    >
                      ▲ {name}
                    </motion.div>
                  ))}
                </div>
              </div>
              {i + 1 < values.length && (
                <div className="list-gap">
                  <span className={`list-arrow${pointsRight ? " list-arrow-on" : ""}`}>→</span>
                  <span className={`list-arrow${leftNeighborPointsBack ? " list-arrow-on" : ""}`}>
                    ←
                  </span>
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
