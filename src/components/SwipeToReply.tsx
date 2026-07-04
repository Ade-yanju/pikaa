"use client";

import { useRef, useState, type ReactNode } from "react";
import { CornerUpLeft } from "lucide-react";

const THRESHOLD = 52;
const MAX = 72;

// Wraps a chat bubble; swiping it right (touch) triggers a reply.
export default function SwipeToReply({
  onReply,
  children,
  className = "",
}: {
  onReply: () => void;
  children: ReactNode;
  className?: string;
}) {
  const [dx, setDx] = useState(0);
  const startX = useRef(0);
  const startY = useRef(0);
  const active = useRef(false);
  const axis = useRef<null | "h" | "v">(null);

  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    startX.current = t.clientX;
    startY.current = t.clientY;
    active.current = true;
    axis.current = null;
  }
  function onTouchMove(e: React.TouchEvent) {
    if (!active.current) return;
    const t = e.touches[0];
    const rawX = t.clientX - startX.current;
    const rawY = t.clientY - startY.current;
    if (axis.current === null && (Math.abs(rawX) > 6 || Math.abs(rawY) > 6)) {
      axis.current = Math.abs(rawX) > Math.abs(rawY) ? "h" : "v";
    }
    if (axis.current !== "h") return;
    setDx(Math.max(0, Math.min(rawX, MAX)));
  }
  function onTouchEnd() {
    if (dx > THRESHOLD) onReply();
    setDx(0);
    active.current = false;
    axis.current = null;
  }

  return (
    <div className={`relative ${className}`}>
      <div
        className="absolute -left-6 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ opacity: Math.min(dx / THRESHOLD, 1) }}
      >
        <CornerUpLeft className="w-4 h-4 text-emerald-400" />
      </div>
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          transform: `translateX(${dx}px)`,
          transition: active.current ? "none" : "transform .18s ease-out",
        }}
      >
        {children}
      </div>
    </div>
  );
}
