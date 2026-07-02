import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";

interface Props {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1.1,
  className,
}: Props) {
  const [display, setDisplay] = useState(0);
  const nodeRef = useRef(value);

  useEffect(() => {
    const controls = animate(nodeRef.current, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(v) {
        setDisplay(v);
      },
    });
    nodeRef.current = value;
    return () => controls.stop();
  }, [value, duration]);

  return (
    <span className={className}>
      {prefix}
      {display.toLocaleString("en-IN", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}
