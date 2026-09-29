import React from "react";
import { Composition } from "remotion";
import { NotDistractPromo } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 16:9 Landscape Video for YouTube & LinkedIn Desktop Feed */}
      <Composition
        id="NotDistractPromo"
        component={NotDistractPromo}
        durationInFrames={480}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* 1:1 Square Video for LinkedIn Mobile Carousel / Post */}
      <Composition
        id="NotDistractPromoSquare"
        component={NotDistractPromo}
        durationInFrames={480}
        fps={30}
        width={1080}
        height={1080}
      />
    </>
  );
};
