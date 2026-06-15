import React from "react";
import { Composition } from "remotion";
import { ChallengeOverview } from "./challenge-overview/ChallengeOverview";
import {
  ChallengeExplainer,
  type ChallengeVideoData,
} from "./challenge-videos/ChallengeExplainer";

declare const require: (path: string) => { videoChallenges: ChallengeVideoData[] };

const { videoChallenges } = require("./challenge-videos/videoData.cjs");

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ChallengeOverview"
        component={ChallengeOverview}
        durationInFrames={420}
        fps={30}
        width={1920}
        height={1080}
      />
      {videoChallenges.map((challenge) => (
        <Composition
          id={`ChallengeVideo-${challenge.id}`}
          key={challenge.id}
          component={ChallengeExplainer}
          durationInFrames={challenge.durationInFrames ?? 270}
          fps={challenge.fps ?? 30}
          width={1920}
          height={1080}
          defaultProps={{ data: challenge }}
        />
      ))}
    </>
  );
};
