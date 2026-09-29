import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animations
  const title1Opacity = interpolate(frame, [0, 20], [0, 1]);
  const title1Y = spring({ frame, fps, from: 30, to: 0, config: { damping: 14 } });

  const title2Opacity = interpolate(frame, [35, 55], [0, 1]);
  const title2Y = spring({ frame: frame - 35, fps, from: 30, to: 0, config: { damping: 14 } });

  const pill1X = spring({ frame: frame - 15, fps, from: -80, to: 0 });
  const pill2X = spring({ frame: frame - 25, fps, from: 80, to: 0 });
  const pill3Y = spring({ frame: frame - 35, fps, from: 60, to: 0 });

  // Strikethrough / Fade out as scene transitions
  const exitOpacity = interpolate(frame, [85, 110], [1, 0]);
  const exitScale = interpolate(frame, [85, 110], [1, 0.95]);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: exitOpacity,
        transform: `scale(${exitScale})`,
        padding: "0 80px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Distraction floating badges */}
      <div style={{ position: "relative", width: "100%", maxWidth: 1000, height: 140, marginBottom: 40 }}>
        <div
          style={{
            position: "absolute",
            left: "8%",
            top: 10,
            transform: `translateX(${pill1X}px) rotate(-6deg)`,
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.4)",
            borderRadius: 999,
            padding: "10px 24px",
            color: "#ef4444",
            fontSize: 22,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span>✕ Endless Recommendations</span>
        </div>

        <div
          style={{
            position: "absolute",
            right: "10%",
            top: 25,
            transform: `translateX(${pill2X}px) rotate(4deg)`,
            background: "rgba(245, 158, 11, 0.15)",
            border: "1px solid rgba(245, 158, 11, 0.4)",
            borderRadius: 999,
            padding: "10px 24px",
            color: "#f59e0b",
            fontSize: 22,
            fontWeight: 700,
          }}
        >
          <span>✕ Addictive Shorts Feed</span>
        </div>

        <div
          style={{
            position: "absolute",
            left: "40%",
            bottom: 0,
            transform: `translateY(${pill3Y}px)`,
            background: "rgba(148, 163, 184, 0.12)",
            border: "1px solid rgba(148, 163, 184, 0.3)",
            borderRadius: 999,
            padding: "8px 20px",
            color: "#94a3b8",
            fontSize: 20,
            fontWeight: 600,
          }}
        >
          <span>✕ Toxic Comments & Sidebar Rabbit Holes</span>
        </div>
      </div>

      {/* Main Hook Question */}
      <div style={{ textAlign: "center" }}>
        <h2
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "#94a3b8",
            margin: 0,
            opacity: title1Opacity,
            transform: `translateY(${title1Y}px)`,
            letterSpacing: "-0.02em",
          }}
        >
          Ever opened YouTube to watch a 10-minute tutorial...
        </h2>

        <h1
          style={{
            fontSize: 68,
            fontWeight: 900,
            color: "#ffffff",
            margin: "24px 0 0",
            opacity: title2Opacity,
            transform: `translateY(${title2Y}px)`,
            letterSpacing: "-0.03em",
          }}
        >
          ...and lost <span style={{ color: "#ef4444" }}>2 hours</span> to the algorithm?
        </h1>
      </div>
    </AbsoluteFill>
  );
};
