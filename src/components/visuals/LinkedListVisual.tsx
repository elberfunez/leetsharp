import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { LinkedListVisualState } from "../../domain/types";

/** A linked list drawn as classic [ value | next ] node boxes that never
 *  move. The next-pointers are real SVG arcs living in the gaps between
 *  nodes: a forward link bows over the TOP and points right, a reversed
 *  link bows under the BOTTOM and points left. When a node's next is
 *  reassigned the old arc retracts (the link "breaks") and the new arc
 *  draws itself in (the link "reconnects"), so a reversal sweeps visibly
 *  top-to-bottom across the row. Named pointers (prev/cur/next) glide
 *  between nodes below. */

const NODE_W = 66;
const NODE_H = 50;
const GAP = 50;
const ARC_RISE = 38; // how far arcs bow above / below the node row
const PAD_TOP = ARC_RISE + 12;
const POINTER_AREA = 56; // room below the bottom arcs for pointer labels

const nodeX = (i: number) => i * (NODE_W + GAP);
const centerY = PAD_TOP + NODE_H / 2;

export function LinkedListVisual({
  title,
  values,
  next,
  pointers = {},
  highlighted = [],
  celebrate = false,
}: LinkedListVisualState) {
  const [flipped, setFlipped] = useState(false);

  // When celebrate turns on, wait 900 ms then show the reversed reading order.
  // Reset if the prop turns off (user navigated away from the final step).
  useEffect(() => {
    if (!celebrate) { setFlipped(false); return; }
    const id = setTimeout(() => setFlipped(true), 900);
    return () => clearTimeout(id);
  }, [celebrate]);

  // In flipped mode we derive the natural reading order from the next-pointer
  // chain and display it left-to-right with simple forward arcs.
  const flipOrder: number[] = (() => {
    if (!flipped) return [];
    const inDegree = new Array(values.length).fill(0);
    next.forEach(t => { if (t !== null && t !== undefined) inDegree[t]++; });
    let cur: number | null = inDegree.findIndex(d => d === 0);
    const order: number[] = [];
    while (cur !== null && cur !== undefined && cur >= 0) {
      order.push(cur);
      cur = next[cur] ?? null;
    }
    return order;
  })();

  const displayValues = flipped ? flipOrder.map(i => values[i]) : values;
  const displayNext: (number | null)[] = flipped
    ? displayValues.map((_, i) => (i < displayValues.length - 1 ? i + 1 : null))
    : next;

  // Remap pointer indices to their new display positions when flipped.
  const displayPointers: Record<string, number> = flipped
    ? Object.fromEntries(
        Object.entries(pointers).map(([name, origIdx]) => [
          name,
          flipOrder.indexOf(origIdx),
        ]).filter(([, newIdx]) => (newIdx as number) >= 0)
      )
    : pointers;

  const n = values.length;
  const svgW = n * NODE_W + (n - 1) * GAP;
  const svgH = PAD_TOP + NODE_H + ARC_RISE + POINTER_AREA;

  // Build the set of arcs to draw this step, each with a stable key so
  // framer-motion can animate breaking (exit) and reconnecting (enter).
  const arcs = displayValues.flatMap((_, i) => {
    const t = displayNext[i];
    if (t === null || t === undefined) return [];
    const forward = t > i;
    const sx = forward ? nodeX(i) + NODE_W : nodeX(i);
    const ex = forward ? nodeX(t) : nodeX(t) + NODE_W;
    const y = forward ? centerY - 8 : centerY + 8;
    const midX = (sx + ex) / 2;
    const ctrlY = forward ? centerY - ARC_RISE : centerY + ARC_RISE;
    return [
      {
        key: forward ? `fwd-${i}` : `bwd-${i}`,
        d: `M ${sx} ${y} Q ${midX} ${ctrlY} ${ex} ${y}`,
        forward,
      },
    ];
  });

  return (
    <div className="visual-block">
      {title && <div className="visual-title">{title}</div>}
      <div className="ll-scroll">
        <div className="ll-stage" style={{ width: svgW, height: svgH }}>
          <svg className="ll-arcs" width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
            <defs>
              <marker
                id="ll-head-fwd"
                markerWidth="9"
                markerHeight="9"
                refX="7"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L7,3 L0,6 Z" fill="var(--accent)" />
              </marker>
              <marker
                id="ll-head-bwd"
                markerWidth="9"
                markerHeight="9"
                refX="7"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L7,3 L0,6 Z" fill="var(--green)" />
              </marker>
            </defs>
            <AnimatePresence>
              {arcs.map((arc) => (
                <motion.path
                  key={arc.key}
                  d={arc.d}
                  fill="none"
                  stroke={arc.forward ? "var(--accent)" : "var(--green)"}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  markerEnd={`url(#${arc.forward ? "ll-head-fwd" : "ll-head-bwd"})`}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ pathLength: 0, opacity: 0 }}
                  transition={{
                    pathLength: { duration: 0.45, ease: "easeOut" },
                    opacity: { duration: 0.2 },
                  }}
                />
              ))}
            </AnimatePresence>
          </svg>

          {displayValues.map((value, i) => {
            const t = displayNext[i];
            const isNull = t === null || t === undefined;
            const reversed = !isNull && (t as number) < i;
            const pointerNames = Object.entries(displayPointers)
              .filter(([, idx]) => idx === i)
              .map(([name]) => name);
            return (
              <div key={i}>
                <motion.div
                  className={`ll-node${highlighted.includes(i) ? " ll-node-hot" : ""}`}
                  style={{ left: nodeX(i), top: PAD_TOP }}
                  animate={{ scale: highlighted.includes(i) ? 1.07 : 1 }}
                  transition={{ type: "spring", stiffness: 380, damping: 22 }}
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={String(value)}
                      className="ll-val"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.25 }}
                    >
                      {value}
                    </motion.span>
                  </AnimatePresence>
                  <span className="ll-next">
                    {isNull ? (
                      <span className="ll-ground">∅</span>
                    ) : (
                      <span className={`ll-dot${reversed ? " ll-dot-rev" : ""}`} />
                    )}
                  </span>
                </motion.div>
                {pointerNames.length > 0 && (
                  <div
                    className="ll-pointer-slot"
                    style={{ left: nodeX(i), top: PAD_TOP + NODE_H + ARC_RISE - 2, width: NODE_W }}
                  >
                    {pointerNames.map((name) => (
                      <motion.div
                        key={name}
                        layoutId={`ll-pointer-${name}`}
                        className="ll-pointer"
                        transition={{ type: "spring", stiffness: 350, damping: 28 }}
                      >
                        <span className="ll-pointer-caret">▲</span> {name}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
