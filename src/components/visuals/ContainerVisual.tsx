import { motion } from "framer-motion";
import type { ContainerVisualState } from "../../domain/types";

const SCENE_W = 260;
const SCENE_H = 110;
const WALL_W  = 10;
const MAX_SPAN = 7; // heights.length - 1

export function ContainerVisual({ title, heights, l, r }: ContainerVisualState) {
  const maxH      = Math.max(...heights);
  const waterH    = Math.min(heights[l], heights[r]);
  const leftH     = heights[l];
  const rightH    = heights[r];
  const span      = r - l;

  // Scale everything to scene dimensions
  const toY  = (h: number) => Math.round((h / maxH) * (SCENE_H - 8));
  const toX  = (idx: number) => Math.round(((idx - l) / MAX_SPAN) * (SCENE_W - WALL_W * 2));

  const lWallH = toY(leftH);
  const rWallH = toY(rightH);
  const waterPx = toY(waterH);
  const containerW = toX(r) - toX(l) + WALL_W;
  const lX = 0;
  const rX = containerW - WALL_W;
  const areaLabel = span > 0 ? `area = ${span} × ${waterH} = ${span * waterH}` : "";

  return (
    <div className="visual-block">
      {title && <div className="visual-title">{title}</div>}
      <div className="cnt2-scene" style={{ width: SCENE_W, height: SCENE_H }}>
        <svg
          width={SCENE_W}
          height={SCENE_H}
          style={{ position: "absolute", inset: 0, overflow: "visible" }}
        >
          {/* floor */}
          <line
            x1={lX} y1={SCENE_H - 1}
            x2={lX + containerW} y2={SCENE_H - 1}
            stroke="var(--border)" strokeWidth={1}
          />
        </svg>

        {/* left wall */}
        <motion.div
          className="cnt2-wall"
          style={{ left: lX, width: WALL_W }}
          animate={{ height: lWallH, bottom: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
        />

        {/* water fill */}
        <motion.div
          className="cnt2-water"
          style={{ left: lX + WALL_W, width: Math.max(0, rX - lX - WALL_W) }}
          animate={{ height: waterPx, bottom: 0, opacity: span > 0 ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 160, damping: 22 }}
        >
          <div className="cnt2-wave" />
        </motion.div>

        {/* right wall */}
        <motion.div
          className="cnt2-wall"
          style={{ left: rX, width: WALL_W }}
          animate={{ height: rWallH, bottom: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
        />
      </div>
      {areaLabel && (
        <div className="cnt2-label">{areaLabel}</div>
      )}
    </div>
  );
}
