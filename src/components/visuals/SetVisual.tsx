import { AnimatePresence, motion } from "framer-motion";
import type { SetVisualState } from "../../domain/types";

/** A HashSet as a bag of chips. Items animate in/out as they're
 *  added and removed; the item being touched this step is emphasized. */
export function SetVisual({ title, items, activeItem }: SetVisualState) {
  return (
    <div className="visual-block">
      {title && <div className="visual-title">{title}</div>}
      <div className="dict-row">
        <AnimatePresence>
          {items.length === 0 && (
            <motion.div
              className="dict-empty"
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Empty
            </motion.div>
          )}
          {items.map((item) => (
            <motion.div
              key={String(item)}
              className={`set-item${item === activeItem ? " dict-entry-active" : ""}`}
              initial={{ opacity: 0, scale: 0.7, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {item}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
