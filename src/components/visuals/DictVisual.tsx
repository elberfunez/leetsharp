import { AnimatePresence, motion } from "framer-motion";
import type { DictVisualState } from "../../domain/types";

/** A dictionary as key→value pills. New entries animate in; the key being
 *  read or written this step is emphasized. */
export function DictVisual({ title, entries, activeKey }: DictVisualState) {
  return (
    <div className="visual-block">
      {title && <div className="visual-title">{title}</div>}
      <div className="dict-row">
        <AnimatePresence>
          {entries.length === 0 && (
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
          {entries.map(([key, value]) => (
            <motion.div
              key={String(key)}
              className={`dict-entry${key === activeKey ? " dict-entry-active" : ""}`}
              initial={{ opacity: 0, scale: 0.7, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <span className="dict-key">{key}</span>
              <span className="dict-arrow">→</span>
              <span className="dict-value">{value}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
