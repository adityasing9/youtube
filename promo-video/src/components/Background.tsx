import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export const Background: React.FC = () => {
  const frame = useCurrentFrame();

  const glowX = interpolate(frame, [0, 480], [-100, 100]);
  const glowY = interpolate(frame, [0, 240, 480], [-50, 50, -50]);
  const opacity = interpolate(frame, [0, 30], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#090a0f",
        overflow: "hidden",
      }}
    >
      {/* Ambient Radial Red Glow */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          right: "10%",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(239, 68, 68, 0.12) 0%, transparent 70%)",
          transform: `translate(${glowX}px, ${glowY}px)`,
          filter: "blur(40px)",
          opacity,
        }}
      />

      {/* Secondary Cool Glow */}
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "5%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(30, 41, 59, 0.4) 0%, transparent 70%)",
          filter: "blur(60px)",
          opacity,
        }}
      />

      {/* Subtle Grid Lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: 0.8,
        }}
      />
    </AbsoluteFill>
  );
};
