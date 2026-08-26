"use client";

import { useTilt } from "@/hooks/useTilt";
import { ReactNode } from "react";

export default function TiltCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const { ref, onMouseMove, onMouseLeave } = useTilt<HTMLDivElement>();

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`tilt-card card ${className}`}
    >
      {children}
    </div>
  );
}
