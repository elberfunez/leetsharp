import { problems } from "../problems";

/** A node on the roadmap. Positions are in canvas px (center of the box).
 *  `category` ties an active node to its problems; locked nodes omit it. */
interface RoadmapNode {
  id: string;
  label: string;
  x: number;
  y: number;
  category?: string;
}

const CANVAS_W = 920;
const CANVAS_H = 1080;
const NODE_W = 150;
const NODE_H = 52;

const NODES: RoadmapNode[] = [
  { id: "arrays", label: "Arrays & Hashing", x: 460, y: 40, category: "Arrays & Hashing" },
  { id: "twoptr", label: "Two Pointers", x: 330, y: 170, category: "Two Pointers" },
  { id: "stack", label: "Stack", x: 600, y: 170, category: "Stack" },
  { id: "binsearch", label: "Binary Search", x: 200, y: 310, category: "Binary Search" },
  { id: "sliding", label: "Sliding Window", x: 460, y: 310, category: "Sliding Window" },
  { id: "linked", label: "Linked List", x: 720, y: 310, category: "Linked List" },
  { id: "trees", label: "Trees", x: 400, y: 450, category: "Trees" },
  { id: "tries", label: "Tries", x: 190, y: 590, category: "Tries" },
  { id: "heap", label: "Heap / Priority Queue", x: 450, y: 590, category: "Heap / Priority Queue" },
  { id: "backtrack", label: "Backtracking", x: 720, y: 590, category: "Backtracking" },
  { id: "graphs", label: "Graphs", x: 450, y: 720, category: "Graphs" },
  { id: "dp1d", label: "1-D Dynamic Prog.", x: 720, y: 720, category: "1-D Dynamic Programming" },
  { id: "advgraphs", label: "Advanced Graphs", x: 300, y: 850, category: "Advanced Graphs" },
  { id: "dp2d", label: "2-D Dynamic Prog.", x: 560, y: 850, category: "2-D Dynamic Programming" },
  { id: "greedy", label: "Greedy", x: 800, y: 850, category: "Greedy" },
  { id: "mathgeo", label: "Math & Geometry", x: 300, y: 980, category: "Math & Geometry" },
  { id: "bits", label: "Bit Manipulation", x: 560, y: 980, category: "Bit Manipulation" },
  { id: "intervals", label: "Intervals", x: 800, y: 980, category: "Intervals" },
];

const EDGES: [from: string, to: string][] = [
  ["arrays", "twoptr"],
  ["arrays", "stack"],
  ["twoptr", "binsearch"],
  ["twoptr", "sliding"],
  ["twoptr", "linked"],
  ["binsearch", "trees"],
  ["sliding", "trees"],
  ["linked", "trees"],
  ["trees", "tries"],
  ["trees", "heap"],
  ["trees", "backtrack"],
  ["heap", "graphs"],
  ["backtrack", "graphs"],
  ["backtrack", "dp1d"],
  ["graphs", "advgraphs"],
  ["graphs", "dp2d"],
  ["dp1d", "dp2d"],
  ["dp1d", "greedy"],
  ["advgraphs", "mathgeo"],
  ["dp2d", "bits"],
  ["greedy", "intervals"],
];

const byId = (id: string) => NODES.find((n) => n.id === id)!;

/** Cubic-bezier from the bottom of the parent to the top of the child. */
function edgePath(from: RoadmapNode, to: RoadmapNode): string {
  const x1 = from.x;
  const y1 = from.y + NODE_H / 2;
  const x2 = to.x;
  const y2 = to.y - NODE_H / 2;
  const midY = (y1 + y2) / 2;
  return `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
}

interface Props {
  onSelect: (category: string) => void;
}

/** NeetCode-style roadmap: categories as connected nodes. Active nodes (those
 *  with problems) are colored and clickable; locked ones are dimmed. */
export function RoadmapView({ onSelect }: Props) {
  const countFor = (category?: string) =>
    category ? problems.filter((p) => p.category === category).length : 0;

  return (
    <div className="roadmap-scroll">
      <div className="roadmap-canvas" style={{ width: CANVAS_W, height: CANVAS_H }}>
        <svg className="roadmap-svg" viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} fill="none">
          {EDGES.map(([from, to]) => (
            <path
              key={`${from}-${to}`}
              d={edgePath(byId(from), byId(to))}
              className="roadmap-edge"
            />
          ))}
        </svg>

        {NODES.map((node) => {
          const count = countFor(node.category);
          const active = count > 0;
          return (
            <button
              key={node.id}
              className={`roadmap-node${active ? " roadmap-node-active" : " roadmap-node-locked"}`}
              style={{ left: node.x - NODE_W / 2, top: node.y - NODE_H / 2, width: NODE_W, height: NODE_H }}
              onClick={() => active && node.category && onSelect(node.category)}
              disabled={!active}
            >
              <span className="roadmap-node-label">{node.label}</span>
              <span className="roadmap-progress">
                <span
                  className="roadmap-progress-fill"
                  style={{ width: active ? "100%" : "0%" }}
                />
              </span>
              {active && <span className="roadmap-node-count">{count}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
