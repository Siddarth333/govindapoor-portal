import { useEffect, useRef, useState } from "react";

/** Animates numeric portions of a value string when scrolled into view. */
export function Counter({ value }: { value: string }) {
  const numeric = Number(value.replace(/[^0-9.]/g, ""));
  const suffix = value.replace(/[0-9.,]/g, "");
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(Number.isFinite(numeric) && numeric > 0 ? 0 : null);

  useEffect(() => {
    if (display === null || !ref.current) return;
    const el = ref.current;
    const obs = new IntersectionObserver((entries) => {
      if (!entries[0]?.isIntersecting) return;
      obs.disconnect();
      const start = performance.now();
      const dur = 1400;
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(Math.round(numeric * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (display === null) return <span ref={ref}>{value}</span>;
  return (
    <span ref={ref}>
      {display.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}
