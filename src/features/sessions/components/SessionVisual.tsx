import { useRef } from "react";

function createSinePath(
  amplitude: number,
  wavelength: number,
  phase: number,
  start = -1400,
  end = 480,
) {
  const points: string[] = [];
  for (let x = start; x <= end; x += 4) {
    const y = 36 + amplitude * Math.sin(((x + phase) * Math.PI * 2) / wavelength);
    points.push(`${x === start ? "M" : "L"}${x} ${y.toFixed(2)}`);
  }
  return points.join(" ");
}

const PRIMARY_WAVE = createSinePath(13, 55, 0);
const SECONDARY_WAVE = createSinePath(9, 60, 18);
const PRIMARY_WAVE_VISIBLE = createSinePath(13, 55, 0, 0, 300);
const SECONDARY_WAVE_VISIBLE = createSinePath(9, 60, 18, 0, 300);

export function SessionWave({ animated = false }: { animated?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const motionRef = useRef<HTMLSpanElement>(null);
  const shiftRef = useRef(0);

  function advanceWave() {
    const container = containerRef.current;
    const motion = motionRef.current;
    if (!container || !motion) return;

    const sharedPeriod = container.clientWidth * (660 / 300);
    let current = shiftRef.current;

    if (current + 26 >= sharedPeriod) {
      current -= sharedPeriod;
      motion.style.transition = "none";
      motion.style.transform = `translate3d(${current}px, 0, 0)`;
      void motion.offsetWidth;
      motion.style.removeProperty("transition");
    }

    shiftRef.current = current + 26;
    motion.style.transform = `translate3d(${shiftRef.current}px, 0, 0)`;
  }

  return (
    <div
      aria-hidden="true"
      className={`session-wave ${animated ? "session-wave--animated" : ""}`}
      onPointerEnter={advanceWave}
      ref={containerRef}
    >
      <span className="session-wave__motion" ref={motionRef}>
        <svg preserveAspectRatio="none" viewBox="0 0 300 72">
          <g className="session-wave__reservoir">
            <path
              className="session-wave__line session-wave__line--primary"
              d={PRIMARY_WAVE}
              pathLength="1"
              vectorEffect="non-scaling-stroke"
            />
            <path
              className="session-wave__line session-wave__line--secondary"
              d={SECONDARY_WAVE}
              pathLength="1"
              vectorEffect="non-scaling-stroke"
            />
          </g>
          {animated && (
            <g className="session-wave__draw">
              <path
                className="session-wave__line session-wave__line--primary"
                d={PRIMARY_WAVE_VISIBLE}
                pathLength="1"
                vectorEffect="non-scaling-stroke"
              />
              <path
                className="session-wave__line session-wave__line--secondary"
                d={SECONDARY_WAVE_VISIBLE}
                pathLength="1"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          )}
        </svg>
      </span>
    </div>
  );
}
