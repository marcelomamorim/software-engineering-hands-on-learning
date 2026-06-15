import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import "./style.css";

const tracks = [
  {
    label: "Kafka",
    title: "replication, ISR, offsets",
    color: "#0f766e",
    items: ["subir cluster", "criar topic", "derrubar broker", "medir lag"],
  },
  {
    label: "DynamoDB",
    title: "access patterns primeiro",
    color: "#2563eb",
    items: ["PK/SK", "GSI", "conditional write", "hot partition"],
  },
  {
    label: "SQS",
    title: "worker resiliente",
    color: "#b45309",
    items: ["visibility timeout", "DLQ", "long polling", "idempotencia"],
  },
  {
    label: "System Design",
    title: "decisoes e trade-offs",
    color: "#7c3aed",
    items: ["NFRs", "algoritmo", "falhas", "observabilidade"],
  },
];

const phases = [
  "Escolha o desafio",
  "Suba o ambiente local",
  "Execute os passos",
  "Defina as decisoes tecnicas",
  "Marque o checklist",
  "Avalie o resultado",
];

function appear(frame: number, start: number, duration = 20) {
  return interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
}

const Header: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = appear(frame, 0);
  const y = interpolate(opacity, [0, 1], [-24, 0]);

  return (
    <div className="header" style={{ opacity, transform: `translateY(${y}px)` }}>
      <div>
        <p className="eyebrow">Engineering Learning Lab</p>
        <h1>Como cada desafio funciona</h1>
      </div>
      <div className="badge">System Design + Kafka + DynamoDB + SQS</div>
    </div>
  );
};

const ChallengeCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame: frame - 20, fps, config: { damping: 16 } });

  return (
    <div className="challenge-card" style={{ transform: `scale(${scale})` }}>
      <p className="card-kicker">exemplo visual</p>
      <h2>Rate limiter distribuido</h2>
      <p>
        O desafio deixa claro o algoritmo, a arquitetura, as falhas esperadas e
        os criterios de aceite.
      </p>
      <div className="decision-box">
        <strong>Algoritmo obrigatorio</strong>
        <span>Token Bucket + Redis Lua</span>
      </div>
    </div>
  );
};

const PhaseRail: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [70, 330], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div className="phase-panel">
      <div className="rail">
        <div className="rail-fill" style={{ width: `${progress * 100}%` }} />
      </div>
      <div className="phase-list">
        {phases.map((phase, index) => {
          const start = 70 + index * 42;
          const active = frame >= start;
          return (
            <div className={`phase ${active ? "active" : ""}`} key={phase}>
              <span>{index + 1}</span>
              <p>{phase}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TrackGrid: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div className="track-grid">
      {tracks.map((track, index) => {
        const opacity = appear(frame, 120 + index * 16);
        const y = interpolate(opacity, [0, 1], [30, 0]);
        return (
          <div
            className="track-card"
            key={track.label}
            style={{
              borderTopColor: track.color,
              opacity,
              transform: `translateY(${y}px)`,
            }}
          >
            <div className="track-head">
              <strong style={{ color: track.color }}>{track.label}</strong>
              <span>{track.title}</span>
            </div>
            <ul>
              {track.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

const Evaluation: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = appear(frame, 300);
  const checks = ["ambiente ok", "passos completos", "decisoes defendidas"];

  return (
    <div className="evaluation" style={{ opacity }}>
      <div>
        <p className="eyebrow">avaliacao final</p>
        <h2>O desafio so fecha quando ha evidencia</h2>
      </div>
      <div className="checks">
        {checks.map((check, index) => (
          <div className="check" key={check}>
            <span>{frame > 318 + index * 18 ? "✓" : ""}</span>
            <p>{check}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ChallengeOverview: React.FC = () => {
  return (
    <AbsoluteFill className="scene">
      <div className="soft-grid" />
      <Header />
      <Sequence from={20}>
        <ChallengeCard />
      </Sequence>
      <Sequence from={70}>
        <PhaseRail />
      </Sequence>
      <Sequence from={120}>
        <TrackGrid />
      </Sequence>
      <Sequence from={300}>
        <Evaluation />
      </Sequence>
    </AbsoluteFill>
  );
};
