import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const FeaturesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const features = [
    {
      step: "01",
      icon: "🔍",
      title: "Search-First Interface",
      desc: "Zero algorithmic home feeds. Search topics or paste any direct YouTube link/ID.",
    },
    {
      step: "02",
      icon: "🛡️",
      title: "Signature Focus Mode",
      desc: "Dedicated distraction-free player. No sidebars, related videos, comments, or shorts.",
    },
    {
      step: "03",
      icon: "⏱️",
      title: "Persistent Focus Timer",
      desc: "15/25/45m presets. Circular progress, refresh recovery, and pleasant Web Audio chimes.",
    },
    {
      step: "04",
      icon: "⚠️",
      title: "Distraction Shield",
      desc: "Gentle behavioral intervention safeguards your focus if you attempt to leave early.",
    },
  ];

  const headerOpacity = interpolate(frame, [0, 20], [0, 1]);
  const headerY = spring({ frame, fps, from: -20, to: 0 });

  const exitOpacity = interpolate(frame, [140, 160], [1, 0]);
  const exitScale = interpolate(frame, [140, 160], [1, 0.96]);

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
      {/* Header Badge & Title */}
      <div style={{ textAlign: "center", marginBottom: 40, opacity: headerOpacity, transform: `translateY(${headerY}px)` }}>
        <div
          style={{
            display: "inline-block",
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: 999,
            padding: "6px 20px",
            color: "#ef4444",
            fontSize: 16,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 12,
          }}
        >
          Built for Intentional Learning
        </div>
        <h2 style={{ fontSize: 50, fontWeight: 800, color: "#ffffff", margin: 0, letterSpacing: "-0.02em" }}>
          Everything you need. Nothing to distract you.
        </h2>
      </div>

      {/* 4 Feature Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 24,
          width: "100%",
          maxWidth: 1200,
        }}
      >
        {features.map((feat, idx) => {
          const cardDelay = 20 + idx * 12;
          const cardScale = spring({
            frame: frame - cardDelay,
            fps,
            from: 0.85,
            to: 1,
            config: { damping: 14 },
          });
          const cardOpacity = interpolate(frame, [cardDelay, cardDelay + 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={feat.title}
              style={{
                background: "rgba(18, 21, 32, 0.85)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 20,
                padding: "26px 30px",
                transform: `scale(${cardScale})`,
                opacity: cardOpacity,
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
                display: "flex",
                gap: 20,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  fontSize: 34,
                  width: 60,
                  height: 60,
                  borderRadius: 16,
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {feat.icon}
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#ef4444" }}>STEP {feat.step}</span>
                </div>
                <h3 style={{ fontSize: 24, fontWeight: 700, color: "#f8fafc", margin: "0 0 8px" }}>
                  {feat.title}
                </h3>
                <p style={{ fontSize: 16, color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>
                  {feat.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
