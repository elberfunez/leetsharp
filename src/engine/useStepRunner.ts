import { useCallback, useEffect, useMemo, useState } from "react";
import type { Step } from "../domain/types";

/** Milliseconds between steps at 1x speed. */
const BASE_INTERVAL_MS = 1600;

export interface StepRunner {
  step: Step;
  index: number;
  total: number;
  playing: boolean;
  speed: number;
  isAtStart: boolean;
  isAtEnd: boolean;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
  togglePlay: () => void;
  setSpeed: (speed: number) => void;
  reset: () => void;
}

/**
 * Owns playback state for a step sequence: current index, play/pause, speed.
 * Pure orchestration — knows nothing about what a step renders.
 */
export function useStepRunner(steps: Step[]): StepRunner {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const total = steps.length;
  const isAtEnd = index >= total - 1;

  const goTo = useCallback(
    (i: number) => setIndex(Math.max(0, Math.min(i, total - 1))),
    [total]
  );

  const next = useCallback(() => {
    setIndex((i) => Math.min(i + 1, total - 1));
  }, [total]);

  const prev = useCallback(() => {
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setPlaying(false);
    setIndex(0);
  }, []);

  const togglePlay = useCallback(() => {
    setPlaying((p) => {
      // Pressing play at the end restarts from the beginning.
      if (!p && index >= total - 1) {
        setIndex(0);
      }
      return !p;
    });
  }, [index, total]);

  useEffect(() => {
    if (!playing) return;
    if (isAtEnd) {
      setPlaying(false);
      return;
    }
    const id = setInterval(next, BASE_INTERVAL_MS / speed);
    return () => clearInterval(id);
  }, [playing, speed, isAtEnd, next]);

  return useMemo(
    () => ({
      step: steps[index],
      index,
      total,
      playing,
      speed,
      isAtStart: index === 0,
      isAtEnd,
      next,
      prev,
      goTo,
      togglePlay,
      setSpeed,
      reset,
    }),
    [steps, index, total, playing, speed, isAtEnd, next, prev, goTo, togglePlay, reset]
  );
}
