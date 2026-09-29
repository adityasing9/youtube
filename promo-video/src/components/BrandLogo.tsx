import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

interface BrandLogoProps {
  size?: number;
  delay?: number;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 120, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 12,
      stiffness: 140,
    },
  });

  const rotation = spring({
    frame: frame - delay,
    fps,
    from: -20,
    to: 0,
    config: {
      damping: 15,
      stiffness: 100,
    },
  });

  return (
    <div
      style={{
        width: size,
        height: size,
        transform: `scale(${Math.max(0, scale)}) rotate(${rotation}deg)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg viewBox="0 0 512 512" width={size} height={size} fill="none">
        <rect width="512" height="512" rx="112" fill="#181c2b" />
        <rect width="504" height="504" x="4" y="4" rx="108" fill="none" stroke="#222838" strokeWidth="4" />
        <circle cx="256" cy="256" r="160" fill="none" stroke="#2c344a" strokeWidth="12" strokeDasharray="16 12" />

        {/* Reticle Brackets */}
        <path d="M 176 136 L 136 136 L 136 176" fill="none" stroke="#ef4444" strokeWidth="20" strokeLinecap="round" />
        <path d="M 336 136 L 376 136 L 376 176" fill="none" stroke="#ef4444" strokeWidth="20" strokeLinecap="round" />
        <path d="M 176 376 L 136 376 L 136 336" fill="none" stroke="#ef4444" strokeWidth="20" strokeLinecap="round" />
        <path d="M 336 376 L 376 376 L 376 336" fill="none" stroke="#ef4444" strokeWidth="20" strokeLinecap="round" />

        {/* Center Node */}
        <circle cx="256" cy="256" r="88" fill="#ef4444" />
        <polygon points="234,212 300,256 234,300" fill="#ffffff" />
      </svg>
    </div>
  );
};
