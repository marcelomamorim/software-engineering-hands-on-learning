import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import "./challenge-video.css";

type DiagramNode = [
  id: string,
  label: string,
  kind: string,
  x: number,
  y: number,
];

type DiagramFlow = [from: string, to: string, label: string];

export type ChallengeVideoData = {
  id: string;
  area: string;
  title: string;
  accent: string;
  scenario: string;
  steps: string[];
  decisions: string[];
  durationInFrames?: number;
  fps?: number;
  visual?: {
    headline: string;
    detail: string;
    nodes: DiagramNode[];
    flows: DiagramFlow[];
    callouts: string[];
  };
  study?: {
    kicker: string;
    headline: string;
    chapters: {
      label: string;
      title: string;
      body: string;
      nodes: DiagramNode[];
      flows: DiagramFlow[];
      callouts: string[];
    }[];
  };
};

const fade = (frame: number, start: number, duration = 18) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const StudyExplainer: React.FC<{ data: ChallengeVideoData }> = ({ data }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const study = data.study;
  const chapters = study?.chapters ?? [];
  const introFrames = 160;
  const outroFrames = 140;
  const chapterFrames = Math.max(
    90,
    Math.floor((durationInFrames - introFrames - outroFrames) / chapters.length)
  );
  const rawIndex = Math.floor((frame - introFrames) / chapterFrames);
  const chapterIndex = clamp(rawIndex, 0, chapters.length - 1);
  const chapter = chapters[chapterIndex];
  const localFrame = frame - introFrames - chapterIndex * chapterFrames;
  const nodeById = new Map(chapter?.nodes.map((node) => [node[0], node]) ?? []);
  const progress = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const isIntro = frame < introFrames;
  const isOutro = frame > durationInFrames - outroFrames;

  return (
    <AbsoluteFill className="challenge-video study-video">
      <div className="grid-bg" />
      <header className="study-header">
        <div>
          <p style={{ color: data.accent }}>{data.area}</p>
          <h1>{data.title}</h1>
        </div>
        <div className="timebox">guia longo</div>
      </header>

      <div className="study-progress">
        <div style={{ width: `${progress * 100}%`, background: data.accent }} />
      </div>

      {isIntro ? (
        <section className="study-intro" style={{ opacity: fade(frame, 8, 26) }}>
          <span>{study?.kicker}</span>
          <h2>{study?.headline}</h2>
          <p>
            Antes dos labs, vamos construir o modelo mental: Kafka como log
            distribuido em servidores reais, com IPs, brokers, producers,
            consumers, replication, ISR, ordem de eventos e decisoes de system
            design em um fluxo de pedidos.
          </p>
        </section>
      ) : (
        <main className="study-main">
          <aside className="chapter-rail">
            {chapters.map((item, index) => (
              <div
                className={`chapter-pill ${index === chapterIndex ? "active" : ""}`}
                key={item.label}
                style={
                  {
                    "--accent": data.accent,
                    opacity: index <= chapterIndex ? 1 : 0.45,
                  } as React.CSSProperties
                }
              >
                <b>{String(index + 1).padStart(2, "0")}</b>
                <span>{item.label}</span>
              </div>
            ))}
          </aside>

          <section className="study-stage">
            <div className="study-copy">
              <span style={{ color: data.accent }}>{chapter?.label}</span>
              <h2>{isOutro ? "Fechamento: o que levar para os labs" : chapter?.title}</h2>
              <p>
                {isOutro
                  ? "Nos desafios, cada conceito vira evidencia: comando, metrica, ADR, replay, falha simulada ou decisao operacional. Explique sempre a ordem dos eventos, qual servidor lidera, quais replicas confirmaram, qual offset foi commitado e qual garantia ainda depende da aplicacao."
                  : chapter?.body}
              </p>
            </div>

            <div className="study-diagram">
              <svg className="flow-layer" viewBox="0 0 100 100">
                <defs>
                  <marker
                    id={`study-arrow-${data.id}`}
                    markerHeight="8"
                    markerWidth="8"
                    orient="auto"
                    refX="7"
                    refY="4"
                  >
                    <path d="M0,0 L8,4 L0,8 Z" fill={data.accent} />
                  </marker>
                </defs>
                {(chapter?.flows ?? []).map(([from, to, label], index) => {
                  const source = nodeById.get(from);
                  const target = nodeById.get(to);
                  if (!source || !target) {
                    return null;
                  }
                  const lineOpacity = fade(localFrame, 18 + index * 8, 20);
                  const midX = (source[3] + target[3]) / 2;
                  const midY = (source[4] + target[4]) / 2;
                  return (
                    <g key={`${from}-${to}-${label}`}>
                      <line
                        x1={source[3]}
                        y1={source[4]}
                        x2={target[3]}
                        y2={target[4]}
                        stroke={data.accent}
                        strokeDasharray="8 5"
                        strokeLinecap="round"
                        strokeWidth="0.78"
                        markerEnd={`url(#study-arrow-${data.id})`}
                        opacity={0.18 + lineOpacity * 0.64}
                      />
                      <text
                        x={midX}
                        y={midY - 2}
                        fill="#475467"
                        fontSize="2.35"
                        fontWeight="850"
                        opacity={lineOpacity}
                        textAnchor="middle"
                      >
                        {label}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {(chapter?.flows ?? []).map(([from, to, label], index) => {
                const source = nodeById.get(from);
                const target = nodeById.get(to);
                if (!source || !target) {
                  return null;
                }
                const start = 54 + index * 12;
                const packetProgress = interpolate(
                  localFrame % Math.max(chapterFrames - 20, 80),
                  [start, start + 42],
                  [0, 1],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.inOut(Easing.cubic),
                  }
                );
                const x = source[3] + (target[3] - source[3]) * packetProgress;
                const y = source[4] + (target[4] - source[4]) * packetProgress;
                const visible =
                  fade(localFrame, start - 8, 10) *
                  (1 - fade(localFrame, start + 42, 12));
                return (
                  <div
                    className="record-packet study-packet"
                    key={`${from}-${to}-${label}-study-packet`}
                    style={
                      {
                        "--accent": data.accent,
                        left: `${x}%`,
                        opacity: visible,
                        top: `${y}%`,
                      } as React.CSSProperties
                    }
                  />
                );
              })}

              {(chapter?.nodes ?? []).map(([id, label, kind, x, y], index) => (
                <div
                  className={`diagram-node study-node ${kind}`}
                  key={`${chapterIndex}-${id}`}
                  style={
                    {
                      "--accent": data.accent,
                      left: `${x}%`,
                      opacity: fade(localFrame, 8 + index * 5, 18),
                      top: `${y}%`,
                      transform: `translate(-50%, -50%) scale(${0.88 + fade(localFrame, 8 + index * 5, 18) * 0.12})`,
                    } as React.CSSProperties
                  }
                >
                  <b>{kind}</b>
                  {label.split("\n").map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </div>
              ))}
            </div>
          </section>

          <section className="study-callouts">
            {(isOutro
              ? data.decisions
              : chapter?.callouts ?? []
            ).map((callout, index) => (
              <div
                className="callout"
                key={callout}
                style={{
                  borderColor: data.accent,
                  opacity: fade(localFrame, 58 + index * 11, 18),
                }}
              >
                <b>{index + 1}</b>
                <p>{callout}</p>
              </div>
            ))}
          </section>
        </main>
      )}
    </AbsoluteFill>
  );
};

export const ChallengeExplainer: React.FC<{ data: ChallengeVideoData }> = ({
  data,
}) => {
  if (data.study) {
    return <StudyExplainer data={data} />;
  }

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const visual = data.visual;
  const nodeById = new Map(visual?.nodes.map((node) => [node[0], node]) ?? []);
  const cardScale = spring({
    frame: frame - 12,
    fps,
    config: { damping: 18, stiffness: 120 },
  });
  const progress = interpolate(frame, [80, 210], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="challenge-video">
      <div className="grid-bg" />
      <header className="video-header">
        <div>
          <p style={{ color: data.accent }}>{data.area}</p>
          <h1>{data.title}</h1>
        </div>
        <div className="timebox">lab visual</div>
      </header>

      <main className="video-main">
        <section
          className="scenario-card"
          style={{
            transform: `scale(${cardScale})`,
            borderTopColor: data.accent,
          }}
        >
          <span>{visual ? "Como funciona por dentro" : "Cenario"}</span>
          <p>{visual?.headline ?? data.scenario}</p>
          {visual ? <small>{visual.detail}</small> : null}
        </section>

        <section className={visual ? "diagram-card" : "steps-card"}>
          {visual ? (
            <>
              <div className="diagram-heading">
                <span>simulacao animada</span>
                <strong>record, controle e estado em movimento</strong>
              </div>
              <div className="diagram-stage">
                <svg className="flow-layer" viewBox="0 0 100 100">
                  <defs>
                    <marker
                      id={`arrow-${data.id}`}
                      markerHeight="8"
                      markerWidth="8"
                      orient="auto"
                      refX="7"
                      refY="4"
                    >
                      <path d="M0,0 L8,4 L0,8 Z" fill={data.accent} />
                    </marker>
                  </defs>
                  {visual.flows.map(([from, to, label], index) => {
                    const source = nodeById.get(from);
                    const target = nodeById.get(to);
                    if (!source || !target) {
                      return null;
                    }
                    const lineProgress = fade(frame, 58 + index * 8, 22);
                    const midX = (source[3] + target[3]) / 2;
                    const midY = (source[4] + target[4]) / 2;
                    return (
                      <g key={`${from}-${to}-${label}`}>
                        <line
                          x1={source[3]}
                          y1={source[4]}
                          x2={target[3]}
                          y2={target[4]}
                          stroke={data.accent}
                          strokeDasharray="7 5"
                          strokeLinecap="round"
                          strokeWidth="0.82"
                          markerEnd={`url(#arrow-${data.id})`}
                          opacity={0.18 + lineProgress * 0.6}
                        />
                        <text
                          x={midX}
                          y={midY - 2.2}
                          fill="#475467"
                          fontSize="2.45"
                          fontWeight="800"
                          opacity={lineProgress}
                          textAnchor="middle"
                        >
                          {label}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {visual.flows.map(([from, to, label], index) => {
                  const source = nodeById.get(from);
                  const target = nodeById.get(to);
                  if (!source || !target) {
                    return null;
                  }
                  const start = 92 + index * 14;
                  const packetProgress = interpolate(
                    frame,
                    [start, start + 38],
                    [0, 1],
                    {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                      easing: Easing.inOut(Easing.cubic),
                    }
                  );
                  const x = source[3] + (target[3] - source[3]) * packetProgress;
                  const y = source[4] + (target[4] - source[4]) * packetProgress;
                  const visible = fade(frame, start - 5, 10) * (1 - fade(frame, start + 38, 10));
                  return (
                    <div
                      className="record-packet"
                      key={`${from}-${to}-${label}-packet`}
                      style={{
                        "--accent": data.accent,
                        left: `${x}%`,
                        opacity: visible,
                        top: `${y}%`,
                      } as React.CSSProperties}
                    />
                  );
                })}

                {visual.nodes.map(([id, label, kind, x, y], index) => (
                  <div
                    className={`diagram-node ${kind}`}
                    key={id}
                    style={{
                      "--accent": data.accent,
                      left: `${x}%`,
                      opacity: fade(frame, 34 + index * 6),
                      top: `${y}%`,
                      transform: `translate(-50%, -50%) scale(${0.9 + fade(frame, 34 + index * 6) * 0.1})`,
                    } as React.CSSProperties}
                  >
                    <b>{kind}</b>
                    {label.split("\n").map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="mini-heading">
                <span>execucao</span>
                <strong>do ambiente ate a avaliacao</strong>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${progress * 100}%`, background: data.accent }}
                />
              </div>
              <div className="steps">
                {data.steps.map((step, index) => {
                  const active = frame > 78 + index * 26;
                  return (
                    <div className={`step ${active ? "active" : ""}`} key={step}>
                      <b style={{ background: active ? data.accent : "#d9dee7" }}>
                        {index + 1}
                      </b>
                      <p>{step}</p>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>
      </main>

      {visual ? (
        <section className="technical-strip">
          <div className="mini-heading">
            <span>pontos tecnicos</span>
            <strong>o que observar no lab</strong>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progress * 100}%`, background: data.accent }}
            />
          </div>
          <div className="callout-grid">
            {visual.callouts.map((callout, index) => (
              <div
                className="callout"
                key={callout}
                style={{
                  borderColor: data.accent,
                  opacity: fade(frame, 126 + index * 15),
                }}
              >
                <b>{index + 1}</b>
                <p>{callout}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <footer className="decision-footer" style={{ opacity: fade(frame, 205) }}>
        <div>
          <span>decisoes obrigatorias</span>
          <h2>O desafio exige trade-offs explicitos</h2>
        </div>
        <div className="decision-pills">
          {data.decisions.map((decision, index) => (
            <p
              key={decision}
              style={{
                borderColor: data.accent,
                opacity: fade(frame, 220 + index * 12),
              }}
            >
              {decision}
            </p>
          ))}
        </div>
      </footer>
    </AbsoluteFill>
  );
};
