import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BrandLogo } from "../components/BrandLogo";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance animations
  const titleOpacity = interpolate(frame, [15, 35], [0, 1]);
  const titleY = spring({ frame: frame - 15, fps, from: 30, to: 0 });

  const taglineOpacity = interpolate(frame, [30, 50], [0, 1]);

  // Philosophy sequence items
  const steps = ["Search", "Watch", "Focus", "Finish", "Leave"];
  const philosophyStartFrame = 55;

  const exitOpacity = interpolate(frame, [105, 125], [1, 0]);
  const exitScale = interpolate(frame, [105, 125], [1, 1.05]);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: exitOpacity,
        transform: `scale(${exitScale})`,
        padding: "0 60px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Brand Icon */}
      <BrandLogo size={140} delay={5} />

      {/* Brand Title */}
      <h1
        style={{
          fontSize: 84,
          fontWeight: 900,
          color: "#ffffff",
          letterSpacing: "-0.03em",
          margin: "24px 0 8px",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          background: "linear-gradient(135deg, #ffffff 40%, #cbd5e1)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        NotDistract
      </h1>

      {/* Tagline */}
      <p
        style={{
          fontSize: 32,
          fontWeight: 600,
          color: "#ef4444",
          margin: 0,
          opacity: taglineOpacity,
          letterSpacing: "-0.01em",
        }}
      >
        YouTube without the distraction.
      </p>

      {/* 5-Step Philosophy Pill */}
      <div
        style={{
          marginTop: 48,
          display: "flex",
          alignItems: "center",
          gap: 16,
          background: "rgba(18, 21, 32, 0.9)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "16px 36px",
          borderRadius: 999,
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.6)",
        }}
      >
        {steps.map((step, idx) => {
          const stepDelay = philosophyStartFrame + idx * 8;
          const stepSpring = spring({
            frame: frame - stepDelay,
            fps,
            from: 0,
            to: 1,
            config: { damping: 12 },
          });

          return (
            <React.Fragment key={step}>
              <span
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: idx === 2 ? "#ef4444" : "#f8fafc",
                  transform: `scale(${stepSpring})`,
                  opacity: stepSpring,
                  letterSpacing: "0.02em",
                }}
              >
                {step}
              </span>
              {idx < steps.length - 1 && (
                <span
                  style={{
                    color: "#ef4444",
                    fontSize: 24,
                    opacity: interpolate(frame, [stepDelay + 4, stepDelay + 10], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }),
                  }}
                >
                  ➔
                </span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
