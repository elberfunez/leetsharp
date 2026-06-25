import { motion } from "framer-motion";
import type { TreeVisualNode, TreeVisualState } from "../../domain/types";

const NODE = 44; // node diameter (matches .tree-node in CSS)
const H_GAP = 24; // horizontal gap between adjacent columns
const V_GAP = 40; // vertical gap between rows
const COL = NODE + H_GAP; // column pitch
const ROW = NODE + V_GAP; // row pitch

interface Placed {
  node: TreeVisualNode;
  x: number; // center x
  y: number; // center y
}

/** Tidy binary-tree layout. Each node gets a unique column from its in-order
 *  rank and a row from its depth, so parents always sit between their two
 *  children and edges never cross — even for unbalanced / single-child trees. */
function layout(root: TreeVisualNode) {
  const placed: Placed[] = [];
  let col = 0;
  let maxDepth = 0;

  function walk(node: TreeVisualNode, depth: number) {
    if (node.left) walk(node.left, depth + 1);
    placed.push({ node, x: col * COL + NODE / 2, y: depth * ROW + NODE / 2 });
    col += 1;
    maxDepth = Math.max(maxDepth, depth);
    if (node.right) walk(node.right, depth + 1);
  }
  walk(root, 0);

  return {
    placed,
    width: col * COL - H_GAP,
    height: (maxDepth + 1) * ROW - V_GAP,
  };
}

interface Edge {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  key: string;
}

/** A binary tree drawn with a tidy layout. Highlighted nodes pulse; visited
 *  nodes dim out; annotations show small badges (e.g. depth). */
export function TreeVisual({
  title,
  root,
  highlighted = [],
  visited = [],
  annotations = {},
}: TreeVisualState) {
  const { placed, width, height } = layout(root);
  const center = new Map(placed.map(p => [p.node.id, p]));

  const edges: Edge[] = [];
  for (const { node, x, y } of placed) {
    for (const child of [node.left, node.right]) {
      if (!child) continue;
      const c = center.get(child.id);
      if (!c) continue;
      edges.push({ x1: x, y1: y, x2: c.x, y2: c.y, key: `${node.id}-${child.id}` });
    }
  }

  return (
    <div className="visual-block">
      {title && <div className="visual-title">{title}</div>}
      <div className="tree-root">
        <div className="tree-canvas" style={{ width, height }}>
          {/* SVG is first in the DOM so it renders behind the node circles */}
          <svg
            aria-hidden
            width={width}
            height={height}
            style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}
          >
            {edges.map(e => (
              <motion.line
                key={e.key}
                x1={e.x1}
                y1={e.y1}
                x2={e.x2}
                y2={e.y2}
                stroke="var(--border)"
                strokeWidth={1.5}
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
              />
            ))}
          </svg>
          {placed.map(({ node, x, y }) => {
            const isHighlighted = highlighted.includes(node.id);
            const isVisited = visited.includes(node.id);
            const badge = annotations[node.id];
            return (
              <motion.div
                key={node.id}
                className={`tree-node${isHighlighted ? " tree-node-active" : ""}${
                  isVisited ? " tree-node-visited" : ""
                }`}
                style={{ position: "absolute", left: x - NODE / 2, top: y - NODE / 2 }}
                animate={{ scale: isHighlighted ? 1.12 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
              >
                {node.value}
                {badge && <span className="tree-badge">{badge}</span>}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
