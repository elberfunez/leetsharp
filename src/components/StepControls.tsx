import type { StepRunner } from "../engine/useStepRunner";

const SPEEDS = [0.5, 1, 2];

/** Transport bar: prev / play-pause / next, scrubber, speed. */
export function StepControls({ runner }: { runner: StepRunner }) {
  return (
    <div className="step-controls">
      <div className="transport">
        <button onClick={runner.prev} disabled={runner.isAtStart} aria-label="Previous step">
          ⏮
        </button>
        <button className="play-button" onClick={runner.togglePlay} aria-label="Play or pause">
          {runner.playing ? "⏸" : "▶"}
        </button>
        <button onClick={runner.next} disabled={runner.isAtEnd} aria-label="Next step">
          ⏭
        </button>
      </div>
      <input
        type="range"
        className="scrubber"
        min={0}
        max={runner.total - 1}
        value={runner.index}
        onChange={(e) => runner.goTo(Number(e.target.value))}
        aria-label="Step scrubber"
      />
      <div className="step-counter">
        {runner.index + 1} / {runner.total}
      </div>
      <div className="speeds">
        {SPEEDS.map((s) => (
          <button
            key={s}
            className={runner.speed === s ? "speed-active" : ""}
            onClick={() => runner.setSpeed(s)}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
}
