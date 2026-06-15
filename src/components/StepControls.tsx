import { SkipBack, ChevronLeft, Play, Pause, ChevronRight, SkipForward } from "lucide-react";
import type { StepRunner } from "../engine/useStepRunner";

const SPEEDS = [0.5, 1, 2];

export function StepControls({ runner }: { runner: StepRunner }) {
  return (
    <div className="step-controls">
      <div className="transport">
        <button
          className="transport-btn"
          onClick={() => runner.goTo(0)}
          disabled={runner.isAtStart}
          aria-label="Skip to start"
        >
          <SkipBack size={15} strokeWidth={2} />
        </button>
        <button
          className="transport-btn"
          onClick={runner.prev}
          disabled={runner.isAtStart}
          aria-label="Previous step"
        >
          <ChevronLeft size={16} strokeWidth={2} />
        </button>
        <button className="play-btn" onClick={runner.togglePlay} aria-label="Play or pause">
          {runner.playing
            ? <Pause size={18} strokeWidth={2} fill="currentColor" />
            : <Play size={18} strokeWidth={2} fill="currentColor" />}
        </button>
        <button
          className="transport-btn"
          onClick={runner.next}
          disabled={runner.isAtEnd}
          aria-label="Next step"
        >
          <ChevronRight size={16} strokeWidth={2} />
        </button>
        <button
          className="transport-btn"
          onClick={() => runner.goTo(runner.total - 1)}
          disabled={runner.isAtEnd}
          aria-label="Skip to end"
        >
          <SkipForward size={15} strokeWidth={2} />
        </button>
      </div>

      <span className="step-counter">{runner.index + 1} / {runner.total}</span>

      <input
        type="range"
        className="scrubber"
        min={0}
        max={runner.total - 1}
        value={runner.index}
        onChange={(e) => runner.goTo(Number(e.target.value))}
        aria-label="Step scrubber"
      />

      <div className="speeds">
        {SPEEDS.map((s) => (
          <button
            key={s}
            className={`speed-btn${runner.speed === s ? " speed-active" : ""}`}
            onClick={() => runner.setSpeed(s)}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
}
