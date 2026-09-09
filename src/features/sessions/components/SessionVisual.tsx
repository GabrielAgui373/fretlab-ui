import { useEffect, useRef } from "react";

function createSinePath(
  amplitude: number,
  wavelength: number,
  phase: number,
  start = -420,
  end = 720,
) {
  const points: string[] = [];
  for (let x = start; x <= end; x += 2) {
    const y = 36 + amplitude * Math.sin(((x + phase) * Math.PI * 2) / wavelength);
    points.push(`${x === start ? "M" : "L"}${x} ${y.toFixed(2)}`);
  }
  return points.join(" ");
}

const PRIMARY_WAVE = createSinePath(20, 104, 0);
const SECONDARY_WAVE = createSinePath(13, 104, 30);
const WAVE_LAYERS = [
  { name: "primary", path: PRIMARY_WAVE },
  { name: "secondary", path: SECONDARY_WAVE },
] as const;
const WAVE_HOVER_SHIFT = 36;
const WAVE_LENGTH = 104;

export function SessionWave({ animated = false }: { animated?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const motionRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const shiftRef = useRef(0);
  const isMovingRef = useRef(false);

  function setPositionWithoutTransition(position: number) {
    const container = containerRef.current;
    if (!container) return;

    motionRefs.current.forEach((motion) => {
      if (!motion) return;
      motion.style.transition = "none";
      motion.style.transform = `translate3d(${position}px, 0, 0)`;
    });
    void container.offsetWidth;
    motionRefs.current.forEach((motion) => motion?.style.removeProperty("transition"));
  }

  function advanceWave() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (isMovingRef.current) return;

    const container = containerRef.current;
    if (!container) return;

    const period = container.clientWidth * (WAVE_LENGTH / 300);
    let current = shiftRef.current;

    if (current + WAVE_HOVER_SHIFT >= period) {
      current -= period;
      setPositionWithoutTransition(current);
    }

    const next = current + WAVE_HOVER_SHIFT;
    shiftRef.current = next;
    isMovingRef.current = true;
    motionRefs.current.forEach((motion) => {
      if (motion) motion.style.transform = `translate3d(${next}px, 0, 0)`;
    });
  }

  function finishWaveMotion() {
    isMovingRef.current = false;
  }

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      shiftRef.current = 0;
      isMovingRef.current = false;
      setPositionWithoutTransition(0);
    });
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-hidden="true"
      className="session-wave"
      onPointerEnter={animated ? advanceWave : undefined}
      ref={containerRef}
    >
      {WAVE_LAYERS.map(({ name, path }, index) => (
        <span
          className={`session-wave__motion session-wave__motion--${name}`}
          key={name}
          onTransitionEnd={name === "secondary" ? finishWaveMotion : undefined}
          ref={(element) => {
            motionRefs.current[index] = element;
          }}
        >
          <svg focusable="false" preserveAspectRatio="none" viewBox="0 0 300 72">
            <path
              className={`session-wave__line session-wave__line--${name}`}
              d={path}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </span>
      ))}
    </div>
  );
}
