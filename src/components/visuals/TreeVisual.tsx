import { motion } from "framer-motion";
import type { TreeVisualNode, TreeVisualState } from "../../domain/types";

interface NodeProps {
  node: TreeVisualNode;
  highlighted: string[];
  visited: string[];
  annotations: Record<string, string>;
}

function Node({ node, highlighted, visited, annotations }: NodeProps) {
  const isHighlighted = highlighted.includes(node.id);
  const isVisited = visited.includes(node.id);
  const badge = annotations[node.id];
  return (
    <div className="tree-branch">
      <motion.div
        className={`tree-node${isHighlighted ? " tree-node-active" : ""}${
          isVisited ? " tree-node-visited" : ""
        }`}
        animate={{ scale: isHighlighted ? 1.12 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
      >
        {node.value}
        {badge && <span className="tree-badge">{badge}</span>}
      </motion.div>
      {(node.left || node.right) && (
        <div className="tree-children">
          {node.left ? (
            <Node node={node.left} highlighted={highlighted} visited={visited} annotations={annotations} />
          ) : (
            <div className="tree-spacer" />
          )}
          {node.right ? (
            <Node node={node.right} highlighted={highlighted} visited={visited} annotations={annotations} />
          ) : (
            <div className="tree-spacer" />
          )}
        </div>
      )}
    </div>
  );
}

/** A binary tree as nested rows. Highlighted nodes are the ones being
 *  processed this step; visited nodes dim out; annotations show small
 *  badges (e.g. the depth at which a node was seen). */
export function TreeVisual({
  title,
  root,
  highlighted = [],
  visited = [],
  annotations = {},
}: TreeVisualState) {
  return (
    <div className="visual-block">
      {title && <div className="visual-title">{title}</div>}
      <div className="tree-root">
        <Node node={root} highlighted={highlighted} visited={visited} annotations={annotations} />
      </div>
    </div>
  );
}
