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
 *  between nodes below (or above when pointerPosition="above").
 *  Nodes in `removed` animate down below the chain so the surviving
 *  path is visually unobstructed. */

const NODE_W = 66;
const NODE_H = 50;
const GAP = 50;
const ARC_RISE = 10;       // how far regular arcs bow above / below the node row
const CYCLE_ARC_RISE = 90; // shallower dip for cycle back-links
const POINTER_AREA = 56;   // room for pointer labels
const REMOVED_GAP = 28;    // extra vertical gap between chain and removed nodes

const nodeX = (i: number) => i * (NODE_W + GAP);

export function LinkedListVisual({
  title,
  values,
  next,
  pointers = {},
  highlighted = [],
  removed = [],
  pointerPosition = "below",
  cycleEdges = [],
  celebrate = false,
}: LinkedListVisualState) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (!celebrate) { setFlipped(false); return; }
    const id = setTimeout(() => setFlipped(true), 900);
    return () => clearTimeout(id);
  }, [celebrate]);

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

  const displayPointers: Record<string, number> = flipped
    ? Object.fromEntries(
        Object.entries(pointers).map(([name, origIdx]) => [
          name,
          flipOrder.indexOf(origIdx),
        ]).filter(([, newIdx]) => (newIdx as number) >= 0)
      )
    : pointers;

  const cycleSet = new Set(cycleEdges.map(([f, t]) => `${f}-${t}`));
  const removedSet = new Set(removed);
  const hasRemoved = removed.length > 0;

  // Layout
  const ABOVE_PAD = 38;
  const padTop = pointerPosition === "above" ? ABOVE_PAD : ARC_RISE + 12;
  const centerY = padTop + NODE_H / 2;
  const n = values.length;
  const svgW = n * NODE_W + (n - 1) * GAP;

  // When removed nodes are present (below mode only), add room beneath the pointer area.
  const removedTop = padTop + NODE_H + ARC_RISE + POINTER_AREA - 8;
  const svgH = pointerPosition === "above"
    ? padTop + NODE_H + CYCLE_ARC_RISE + 10
    : padTop + NODE_H + ARC_RISE + POINTER_AREA + (hasRemoved ? NODE_H + REMOVED_GAP : 0);

  // Arcs — skip any arc whose source or target is a removed node.
  const arcs = displayValues.flatMap((_, i) => {
    const t = displayNext[i];
    if (t === null || t === undefined) return [];
    if (removedSet.has(i) || removedSet.has(t)) return [];
    const isCycle = cycleSet.has(`${i}-${t}`);
    const forward = t > i;
    const rise = isCycle ? CYCLE_ARC_RISE : ARC_RISE;
    const sx = forward ? nodeX(i) + NODE_W : nodeX(i);
    const ex = forward ? nodeX(t) : nodeX(t) + NODE_W;
    const y = forward ? centerY - 8 : centerY + 8;
    const midX = (sx + ex) / 2;
    const ctrlY = forward ? centerY - rise : centerY + rise;
    const color = isCycle ? "var(--yellow)" : forward ? "var(--accent)" : "var(--green)";
    const markerId = isCycle ? "ll-head-cycle" : forward ? "ll-head-fwd" : "ll-head-bwd";
    return [{ key: isCycle ? `cycle-${i}` : forward ? `fwd-${i}` : `bwd-${i}`, d: `M ${sx} ${y} Q ${midX} ${ctrlY} ${ex} ${y}`, color, markerId }];
  });

  const pointerSlotTop = pointerPosition === "above"
    ? padTop - 4
    : padTop + NODE_H + ARC_RISE - 2;

  return (
    <div className="visual-block">
      {title && <div className="visual-title">{title}</div>}
      <div className="ll-scroll">
        <div className="ll-stage" style={{ width: svgW, height: svgH }}>
          <svg className="ll-arcs" width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
            <defs>
              <marker id="ll-head-fwd"   markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
                <path d="M0,0 L7,3 L0,6 Z" fill="var(--accent)" />
              </marker>
              <marker id="ll-head-bwd"   markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
                <path d="M0,0 L7,3 L0,6 Z" fill="var(--green)" />
              </marker>
              <marker id="ll-head-cycle" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
                <path d="M0,0 L7,3 L0,6 Z" fill="var(--yellow)" />
              </marker>
            </defs>
            <AnimatePresence>
              {arcs.map((arc) => (
                <motion.path
                  key={arc.key}
                  d={arc.d}
                  fill="none"
                  stroke={arc.color}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  markerEnd={`url(#${arc.markerId})`}
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
            const isRemoved = removedSet.has(i);
            const t = displayNext[i];
            const isNull = t === null || t === undefined;
            const reversed = !isNull && (t as number) < i;
            const pointerNames = Object.entries(displayPointers)
              .filter(([, idx]) => idx === i)
              .map(([name]) => name);
            const nodeTop = isRemoved ? removedTop : padTop;
            return (
              <div key={i}>
                <motion.div
                  className={`ll-node${highlighted.includes(i) ? " ll-node-hot" : ""}`}
                  style={{ left: nodeX(i), top: nodeTop, opacity: isRemoved ? 0.45 : 1 }}
                  animate={{
                    top: nodeTop,
                    opacity: isRemoved ? 0.45 : 1,
                    scale: highlighted.includes(i) ? 1.07 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 26 }}
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
                    style={{
                      left: nodeX(i),
                      top: pointerSlotTop,
                      width: NODE_W,
                      ...(pointerPosition === "above" && { transform: "translateY(-100%)" }),
                    }}
                  >
                    {pointerNames.map((name) => (
                      <motion.div
                        key={name}
                        layoutId={`ll-pointer-${name}`}
                        className="ll-pointer"
                        transition={{ type: "spring", stiffness: 350, damping: 28 }}
                      >
                        <span className="ll-pointer-caret">
                          {pointerPosition === "above" ? "▼" : "▲"}
                        </span>{" "}
                        {name}
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
