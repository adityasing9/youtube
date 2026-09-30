import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Background } from "./components/Background";
import { BrandLogo } from "./components/BrandLogo";

export const NotDistractShorts: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // -------------------------------------------------------------
  // SCENE 1: The Hook (0 - 110 frames, ~3.6s)
  // -------------------------------------------------------------
  const hookOpacity = interpolate(frame, [0, 15, 95, 110], [0, 1, 1, 0]);
  const hookScale = spring({ frame, fps, from: 0.8, to: 1, config: { damping: 12 } });

  const pill1X = spring({ frame: frame - 10, fps, from: -100, to: 0 });
  const pill2X = spring({ frame: frame - 20, fps, from: 100, to: 0 });
  const pill3Y = spring({ frame: frame - 30, fps, from: 80, to: 0 });

  // -------------------------------------------------------------
  // SCENE 2: The Solution (100 - 230 frames, ~4.3s)
  // -------------------------------------------------------------
  const introOpacity = interpolate(frame, [105, 120, 215, 230], [0, 1, 1, 0]);
  const introScale = spring({ frame: frame - 105, fps, from: 0.85, to: 1, config: { damping: 14 } });

  const steps = ["Search", "Watch", "Focus", "Finish", "Leave"];
  const stepStart = 135;

  // -------------------------------------------------------------
  // SCENE 3: The 4 Pillars (220 - 370 frames, ~5s)
  // -------------------------------------------------------------
  const featOpacity = interpolate(frame, [225, 240, 355, 370], [0, 1, 1, 0]);

  const featureCards = [
    { num: "01", icon: "🔍", title: "Search-First", text: "Zero home feeds or endless scroll" },
    { num: "02", icon: "🛡️", title: "Focus Mode", text: "No sidebars, comments, or shorts" },
    { num: "03", icon: "⏱️", title: "Focus Timer", text: "25 min Pomodoro with audio chime" },
    { num: "04", icon: "⚠️", title: "Distraction Shield", text: "Prompts you if you try to leave" },
  ];

  // -------------------------------------------------------------
  // SCENE 4: CTA & Outro (360 - 540 frames, ~6s)
  // -------------------------------------------------------------
  const outroOpacity = interpolate(frame, [365, 380], [0, 1]);
  const outroScale = spring({ frame: frame - 365, fps, from: 0.9, to: 1, config: { damping: 12 } });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#090a0f",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: "#ffffff",
        overflow: "hidden",
      }}
    >
      <Background />

      {/* ========================================================
          SCENE 1: HOOK (0 - 110 frames)
          ======================================================== */}
      {frame < 115 && (
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: hookOpacity,
            padding: "0 60px",
            textAlign: "center",
          }}
        >
          {/* Top Alert Badge */}
          <div
            style={{
              background: "rgba(239, 68, 68, 0.2)",
              border: "2px solid #ef4444",
              borderRadius: 999,
              padding: "14px 32px",
              color: "#ef4444",
              fontSize: 26,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 40,
            }}
          >
            🛑 Stop Watching YouTube Like This
          </div>

          <h1
            style={{
              fontSize: 76,
              fontWeight: 900,
              lineHeight: 1.15,
              margin: "0 0 50px",
              transform: `scale(${hookScale})`,
              letterSpacing: "-0.03em",
            }}
          >
            Opened YouTube for <span style={{ color: "#94a3b8" }}>1 tutorial...</span>
            <br />
            <br />
            lost <span style={{ color: "#ef4444" }}>2 hours</span> to the algorithm?
          </h1>

          {/* Floating distraction tags */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%", maxWidth: 640 }}>
            <div
              style={{
                transform: `translateX(${pill1X}px)`,
                background: "rgba(18, 21, 32, 0.9)",
                border: "1px solid rgba(239, 68, 68, 0.4)",
                padding: "16px 28px",
                borderRadius: 999,
                fontSize: 26,
                fontWeight: 700,
                color: "#ef4444",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
              }}
            >
              ✕ Endless Recommendation Feed
            </div>
            <div
              style={{
                transform: `translateX(${pill2X}px)`,
                background: "rgba(18, 21, 32, 0.9)",
                border: "1px solid rgba(245, 158, 11, 0.4)",
                padding: "16px 28px",
                borderRadius: 999,
                fontSize: 26,
                fontWeight: 700,
                color: "#f59e0b",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
              }}
            >
              ✕ Addictive Shorts Rabbit Holes
            </div>
            <div
              style={{
                transform: `translateY(${pill3Y}px)`,
                background: "rgba(18, 21, 32, 0.9)",
                border: "1px solid rgba(148, 163, 184, 0.3)",
                padding: "16px 28px",
                borderRadius: 999,
                fontSize: 26,
                fontWeight: 600,
                color: "#94a3b8",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
              }}
            >
              ✕ Distracting Comments & Autoplay
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ========================================================
          SCENE 2: THE REVEAL & PHILOSOPHY (100 - 230 frames)
          ======================================================== */}
      {frame >= 100 && frame < 235 && (
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: introOpacity,
            padding: "0 60px",
            textAlign: "center",
          }}
        >
          <div style={{ transform: `scale(${introScale})`, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <BrandLogo size={180} delay={105} />

            <h1
              style={{
                fontSize: 84,
                fontWeight: 900,
                margin: "32px 0 10px",
                letterSpacing: "-0.03em",
                background: "linear-gradient(135deg, #ffffff 40%, #cbd5e1)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              NotDistract
            </h1>

            <p style={{ fontSize: 34, fontWeight: 700, color: "#ef4444", margin: "0 0 50px" }}>
              YouTube without the distraction.
            </p>

            {/* Philosophy Vertical Stack */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%", maxWidth: 500 }}>
              {steps.map((s, idx) => {
                const sDelay = stepStart + idx * 8;
                const sSpring = spring({ frame: frame - sDelay, fps, from: 0.8, to: 1 });
                const sOp = interpolate(frame, [sDelay, sDelay + 6], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });

                return (
                  <div
                    key={s}
                    style={{
                      transform: `scale(${sSpring})`,
                      opacity: sOp,
                      background: idx === 2 ? "rgba(239, 68, 68, 0.2)" : "rgba(18, 21, 32, 0.85)",
                      border: idx === 2 ? "2px solid #ef4444" : "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: 18,
                      padding: "16px",
                      fontSize: 30,
                      fontWeight: 800,
                      color: idx === 2 ? "#ef4444" : "#f8fafc",
                    }}
                  >
                    {idx + 1}. {s}
                  </div>
                );
              })}
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ========================================================
          SCENE 3: 4 SIGNATURE PILLARS (220 - 370 frames)
          ======================================================== */}
      {frame >= 220 && frame < 375 && (
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: featOpacity,
            padding: "0 50px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Intentional Design
            </span>
            <h2 style={{ fontSize: 58, fontWeight: 900, margin: "8px 0 0", letterSpacing: "-0.02em" }}>
              How it works
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%", maxWidth: 680 }}>
            {featureCards.map((feat, idx) => {
              const cardDelay = 235 + idx * 12;
              const cardSpring = spring({ frame: frame - cardDelay, fps, from: 0.85, to: 1 });
              const cardOp = interpolate(frame, [cardDelay, cardDelay + 10], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });

              return (
                <div
                  key={feat.title}
                  style={{
                    transform: `scale(${cardSpring})`,
                    opacity: cardOp,
                    background: "rgba(18, 21, 32, 0.9)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: 22,
                    padding: "22px 26px",
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 42,
                      width: 72,
                      height: 72,
                      borderRadius: 18,
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {feat.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 30, fontWeight: 800, color: "#f8fafc", margin: "0 0 6px" }}>
                      {feat.title}
                    </h3>
                    <p style={{ fontSize: 20, color: "#94a3b8", margin: 0, lineHeight: 1.4 }}>
                      {feat.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      )}

      {/* ========================================================
          SCENE 4: CTA & OUTRO (360 - 510 frames)
          ======================================================== */}
      {frame >= 360 && (
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: outroOpacity,
            padding: "0 50px",
            textAlign: "center",
          }}
        >
          <div style={{ transform: `scale(${outroScale})`, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <BrandLogo size={150} delay={365} />

            <h1
              style={{
                fontSize: 66,
                fontWeight: 900,
                margin: "30px 0 14px",
                letterSpacing: "-0.03em",
                lineHeight: 1.15,
              }}
            >
              Take back control of your attention.
            </h1>

            <p style={{ fontSize: 28, color: "#94a3b8", margin: "0 0 40px" }}>
              100% Free • Open Source • No Ads
            </p>

            {/* Badges */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 44, width: "100%", maxWidth: 480 }}>
              <div style={{ background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: 999, padding: "12px 24px", fontSize: 22, fontWeight: 700 }}>
                ⚡ 0 Runtime Dependencies
              </div>
              <div style={{ background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: 999, padding: "12px 24px", fontSize: 22, fontWeight: 700 }}>
                🔒 100% Local Browser Privacy
              </div>
              <div style={{ background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: 999, padding: "12px 24px", fontSize: 22, fontWeight: 700 }}>
                📦 PWA (Installable on Mobile)
              </div>
            </div>

            {/* Action Card */}
            <div
              style={{
                background: "linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(18, 21, 32, 0.95) 100%)",
                border: "2px solid #ef4444",
                borderRadius: 24,
                padding: "24px 44px",
                boxShadow: "0 15px 50px rgba(239, 68, 68, 0.2)",
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 800, color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
                Try It Live
              </div>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#ffffff", letterSpacing: "-0.01em" }}>
                adityasing9.github.io/youtube
              </div>
            </div>

            <div style={{ marginTop: 40, fontSize: 20, color: "#64748b" }}>
              Created by Aditya Sing • Open Source
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
