import { AnimatePresence, motion } from "framer-motion";
import type { StackVisualState } from "../../domain/types";

/** A LIFO stack drawn vertically — items push in and pop off the top. */
export function StackVisual({ title, items, topActive }: StackVisualState) {
  return (
    <div className="visual-block">
      {title && <div className="visual-title">{title}</div>}
      <div className="stack-column">
        <AnimatePresence>
          {items.length === 0 && (
            <motion.div
              className="stack-empty"
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Empty
            </motion.div>
          )}
          {[...items].reverse().map((value, fromTop) => {
            const index = items.length - 1 - fromTop;
            const isTop = index === items.length - 1;
            return (
              <motion.div
                key={`${index}-${value}`}
                className={`stack-item${isTop && topActive ? " stack-item-active" : ""}`}
                initial={{ opacity: 0, y: -16, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.85 }}
                transition={{ type: "spring", stiffness: 400, damping: 26 }}
              >
                {value}
                {isTop && <span className="stack-top-tag">top</span>}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
