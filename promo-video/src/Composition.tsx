import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Background } from "./components/Background";
import { ProblemScene } from "./scenes/ProblemScene";
import { IntroScene } from "./scenes/IntroScene";
import { FeaturesScene } from "./scenes/FeaturesScene";
import { OutroScene } from "./scenes/OutroScene";

export const NotDistractPromo: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Dynamic Background */}
      <Background />

      {/* Scene 1: The Problem (Frames 0 - 110) */}
      <Sequence from={0} durationInFrames={110} name="Problem">
        <ProblemScene />
      </Sequence>

      {/* Scene 2: Brand & Philosophy (Frames 100 - 230) */}
      <Sequence from={100} durationInFrames={130} name="Intro">
        <IntroScene />
      </Sequence>

      {/* Scene 3: Signature Features (Frames 220 - 370) */}
      <Sequence from={220} durationInFrames={150} name="Features">
        <FeaturesScene />
      </Sequence>

      {/* Scene 4: Tech Stack & Outro (Frames 360 - 480) */}
      <Sequence from={360} durationInFrames={120} name="Outro">
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
