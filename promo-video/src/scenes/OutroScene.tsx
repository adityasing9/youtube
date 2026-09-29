import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BrandLogo } from "../components/BrandLogo";

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [10, 30], [0, 1]);
  const titleY = spring({ frame: frame - 10, fps, from: 20, to: 0 });

  const badges = [
    "⚡ 0 Dependencies",
    "🌐 Vanilla JS & Web APIs",
    "📦 PWA Offline Shell",
    "🔒 100% Local Privacy",
  ];

  const ctaScale = spring({
    frame: frame - 40,
    fps,
    from: 0.9,
    to: 1,
    config: { damping: 12 },
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 80px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <BrandLogo size={110} delay={0} />

      <h1
        style={{
          fontSize: 64,
          fontWeight: 900,
          color: "#ffffff",
          letterSpacing: "-0.03em",
          margin: "20px 0 8px",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        Take back control of your focus.
      </h1>

      <p
        style={{
          fontSize: 24,
          color: "#94a3b8",
          margin: "0 0 36px",
          opacity: titleOpacity,
        }}
      >
        Stop letting algorithms dictate your attention.
      </p>

      {/* Tech Highlights */}
      <div style={{ display: "flex", gap: 14, marginBottom: 44, flexWrap: "wrap", justifyContent: "center" }}>
        {badges.map((badge, idx) => {
          const badgeDelay = 20 + idx * 6;
          const badgeOpacity = interpolate(frame, [badgeDelay, badgeDelay + 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={badge}
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                padding: "10px 22px",
                borderRadius: 999,
                fontSize: 18,
                fontWeight: 600,
                color: "#f8fafc",
                opacity: badgeOpacity,
              }}
            >
              {badge}
            </div>
          );
        })}
      </div>

      {/* Call To Action Box */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `scale(${ctaScale})`,
          background: "linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(18, 21, 32, 0.8) 100%)",
          border: "1px solid rgba(239, 68, 68, 0.4)",
          borderRadius: 24,
          padding: "24px 48px",
          boxShadow: "0 15px 50px rgba(239, 68, 68, 0.15)",
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 700, color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
          Live Demo Available
        </div>
        <div style={{ fontSize: 32, fontWeight: 800, color: "#ffffff", letterSpacing: "-0.01em", marginBottom: 6 }}>
          adityasing9.github.io/youtube
        </div>
        <div style={{ fontSize: 18, color: "#94a3b8" }}>
          Open Source on GitHub: <strong style={{ color: "#ffffff" }}>adityasing9/youtube</strong>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 40, fontSize: 16, color: "#64748b" }}>
        Crafted by Aditya Sing • NotDistract V5
      </div>
    </AbsoluteFill>
  );
};
