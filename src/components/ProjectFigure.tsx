import type { Project } from '../data'
import styles from './ProjectFigure.module.css'

/** One-line captions for the project schematics. */
export const figureCaption: Record<Project['figure'], string> = {
  pipeline: 'How it works: orders become draft quotations; invoices wait for an accountant’s approval.',
  leaderboard: 'The task: road features in, a risk score out.',
  embedding: 'The model: question and answer → Transformer embedding → predicted misconception.',
  agent: 'The workflow: CVs by email → analysis → score → decision → reply.',
  tracking: 'The task: player positions, frame by frame, turned into features.',
  packing: 'One puzzle, n = 5: a grid needs side 3; turning one square by 45° fits all five in about 2.707.',
}

/** Schematic SVG for each project: the structure of the problem, no real data. */
export function ProjectFigure({ kind }: { kind: Project['figure'] }) {
  // The tabular-task figure is a single row, so it gets a shorter frame.
  const viewBox = kind === 'leaderboard' ? '0 76 640 260' : '0 0 640 400'
  return (
    <svg className={styles.svg} viewBox={viewBox} aria-hidden="true" focusable="false">
      {kind === 'pipeline' && <Pipeline />}
      {kind === 'leaderboard' && <Leaderboard />}
      {kind === 'embedding' && <Embedding />}
      {kind === 'agent' && <Agent />}
      {kind === 'tracking' && <Tracking />}
      {kind === 'packing' && <Packing />}
    </svg>
  )
}

/* Pipeline */

// Two lanes from one inbox: orders become draft quotations, invoices wait for approval.
const SRC = { x: 20, y: 171, w: 104, h: 58 }
const LANE_W = 136
const LANE_GAP = 28
const laneX = (i: number) => 152 + i * (LANE_W + LANE_GAP)
const LANE_H = 58

type LaneNode = { title: string; sub: string; kind: 'agent' | 'node' | 'human' | 'end' }

const lanes: { label: string; y: number; nodes: LaneNode[] }[] = [
  {
    label: 'smart ordering',
    y: 96,
    nodes: [
      { title: 'Qwen Plus', sub: 'text LLM', kind: 'agent' },
      { title: 'Quotation', sub: 'draft, automatic', kind: 'end' },
      { title: 'Salesperson', sub: 'prices it', kind: 'human' },
    ],
  },
  {
    label: 'smart billing',
    y: 246,
    nodes: [
      { title: 'Kimi K3', sub: 'vision LLM', kind: 'agent' },
      { title: 'Accountant', sub: 'approves first', kind: 'human' },
      { title: 'Vendor bill', sub: 'after approval', kind: 'end' },
    ],
  },
]

function Pipeline() {
  const kindClass = { agent: styles.nodeAgent, node: styles.node, human: styles.nodeHuman, end: styles.nodeEnd }
  const srcMidY = SRC.y + SRC.h / 2
  return (
    <g>
      <defs>
        <marker id="fig-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0.5 L7.5,4 L0,7.5" className={styles.arrowHead} />
        </marker>
      </defs>

      {/* The shared inbox */}
      <rect className={styles.node} x={SRC.x} y={SRC.y} width={SRC.w} height={SRC.h} rx={2} />
      <text className={styles.nodeLabel} x={SRC.x + SRC.w / 2} y={SRC.y + 24} textAnchor="middle">
        Email
      </text>
      <text className={`${styles.labelMuted} ${styles.small}`} x={SRC.x + SRC.w / 2} y={SRC.y + 44} textAnchor="middle">
        IMAP, daily
      </text>

      {lanes.map((lane) => {
        const midY = lane.y + LANE_H / 2
        return (
          <g key={lane.label}>
            <text className={`${styles.labelMuted} ${styles.small}`} x={laneX(0)} y={lane.y - 14}>
              {lane.label}
            </text>
            <path
              className={styles.connectorPath}
              d={`M${SRC.x + SRC.w + 2},${srcMidY} C${SRC.x + SRC.w + 16},${srcMidY} ${laneX(0) - 20},${midY} ${laneX(0) - 4},${midY}`}
              markerEnd="url(#fig-arrow)"
            />
            {lane.nodes.map((node, i) => {
              const x = laneX(i)
              return (
                <g key={node.title}>
                  {i > 0 && (
                    <line
                      className={styles.connector}
                      x1={laneX(i - 1) + LANE_W + 2}
                      x2={x - 4}
                      y1={midY}
                      y2={midY}
                      markerEnd="url(#fig-arrow)"
                    />
                  )}
                  <rect className={kindClass[node.kind]} x={x} y={lane.y} width={LANE_W} height={LANE_H} rx={2} />
                  <text className={styles.nodeLabel} x={x + LANE_W / 2} y={lane.y + 24} textAnchor="middle">
                    {node.title}
                  </text>
                  <text
                    className={`${node.kind === 'human' ? styles.labelAccent : styles.labelMuted} ${styles.small}`}
                    x={x + LANE_W / 2}
                    y={lane.y + 44}
                    textAnchor="middle"
                  >
                    {node.sub}
                  </text>
                </g>
              )
            })}
          </g>
        )
      })}

      {/* Key */}
      <g transform="translate(152 352)">
        <rect className={styles.nodeAgent} x={0} y={-11} width={22} height={14} rx={2} />
        <text className={`${styles.labelMuted} ${styles.small}`} x={30} y={1}>
          LLM extraction
        </text>
        <rect className={styles.nodeHuman} x={164} y={-11} width={22} height={14} rx={2} />
        <text className={`${styles.labelMuted} ${styles.small}`} x={194} y={1}>
          a person decides
        </text>
      </g>
    </g>
  )
}

/* Tabular prediction task */

function Leaderboard() {
  const cols = 6
  const rows = 6
  const cw = 34
  const ch = 20
  const gap = 4
  // Centred in its 640 × 260 frame (y 76–336).
  const tx0 = 72
  const ty0 = 128
  // Fixed, decorative shading for the feature cells; not data.
  const shade = (r: number, c: number) => 0.08 + 0.5 * Math.abs(Math.sin(r * 1.7 + c * 2.3))
  const risk = [0.62, 0.28, 0.81, 0.45, 0.15, 0.53]
  const tableRight = tx0 + cols * (cw + gap) + 30
  const modelX = tableRight + 26
  const outX = modelX + 112
  const midY = ty0 + (rows * (ch + gap)) / 2 - 2

  return (
    <g>
      <defs>
        <marker id="lb-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0.5 L7.5,4 L0,7.5" className={styles.arrowHead} />
        </marker>
      </defs>

      {/* Feature table */}
      {Array.from({ length: cols }, (_, c) => (
        <text key={c} className={`${styles.labelMuted} ${styles.small}`} x={tx0 + c * (cw + gap) + cw / 2} y={ty0 - 12} textAnchor="middle">
          {`x${c + 1}`}
        </text>
      ))}
      <text className={`${styles.labelMuted} ${styles.small}`} x={tx0 + cols * (cw + gap) + 12} y={ty0 - 12} textAnchor="middle">
        …
      </text>
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => (
          <rect
            key={`${r}-${c}`}
            className={styles.featureCell}
            x={tx0 + c * (cw + gap)}
            y={ty0 + r * (ch + gap)}
            width={cw}
            height={ch}
            style={{ fillOpacity: shade(r, c) }}
          />
        )),
      )}
      <text className={styles.labelMuted} x={tx0} y={ty0 + rows * (ch + gap) + 22}>
        road segments × features
      </text>

      {/* Model */}
      <line className={styles.connector} x1={tableRight} x2={modelX - 4} y1={midY} y2={midY} markerEnd="url(#lb-arrow)" />
      <rect className={styles.modelBox} x={modelX} y={midY - 26} width={86} height={52} rx={2} />
      <text className={styles.nodeLabel} x={modelX + 43} y={midY + 5} textAnchor="middle">
        model
      </text>
      <line className={styles.connector} x1={modelX + 88} x2={outX - 6} y1={midY} y2={midY} markerEnd="url(#lb-arrow)" />

      {/* Predicted risk */}
      <text className={`${styles.labelAccent} ${styles.small}`} x={outX} y={ty0 - 12}>
        risk ∈ [0, 1]
      </text>
      {risk.map((v, r) => (
        <g key={r}>
          <rect className={styles.riskTrack} x={outX} y={ty0 + r * (ch + gap) + 6} width={100} height={8} />
          <rect className={styles.riskBar} x={outX} y={ty0 + r * (ch + gap) + 6} width={100 * v} height={8} />
        </g>
      ))}

    </g>
  )
}

/* Text → Transformer embedding → network → label */

/** Fixed shading for the embedding cells: illustrative, not taken from any model. */
const EMBED = [0.85, 0.3, 0.6, 0.15, 0.95, 0.45, 0.7, 0.2, 0.55, 0.9, 0.35, 0.65]
const NET = [4, 5, 3]

function Embedding() {
  const cardX = 24
  const cards = [
    { label: 'Question', y: 112 },
    { label: 'Answer', y: 218 },
  ]
  const enc = { x: 196, y: 108, w: 76, h: 170 }
  const vecX = 314
  const cell = 12
  const vecY = 193 - (EMBED.length * cell) / 2
  const layerX = [384, 434, 484]
  const nodeY = (count: number, i: number) => 193 + (i - (count - 1) / 2) * 30
  const outX = 532
  const outputs = [0.86, 0.34, 0.18]
  return (
    <g>
      <defs>
        <marker id="emb-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0.5 L7.5,4 L0,7.5" className={styles.arrowHead} />
        </marker>
      </defs>

      {/* The question-answer pair */}
      {cards.map((c) => (
        <g key={c.label}>
          <rect className={styles.node} x={cardX} y={c.y} width={130} height={58} rx={2} />
          <text className={styles.nodeLabel} x={cardX + 12} y={c.y + 22}>
            {c.label}
          </text>
          <line className={styles.textLine} x1={cardX + 12} x2={cardX + 112} y1={c.y + 36} y2={c.y + 36} />
          <line className={styles.textLine} x1={cardX + 12} x2={cardX + 84} y1={c.y + 46} y2={c.y + 46} />
          <path
            className={styles.connectorPath}
            d={`M${cardX + 132},${c.y + 29} C${cardX + 152},${c.y + 29} ${enc.x - 22},193 ${enc.x - 4},193`}
            markerEnd="url(#emb-arrow)"
          />
        </g>
      ))}

      {/* Transformer encoder */}
      <rect className={styles.nodeAgent} x={enc.x} y={enc.y} width={enc.w} height={enc.h} rx={2} />
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          className={styles.layerLine}
          x1={enc.x + 12}
          x2={enc.x + enc.w - 12}
          y1={enc.y + 34 + i * 34}
          y2={enc.y + 34 + i * 34}
        />
      ))}
      <text className={`${styles.labelMuted} ${styles.small}`} x={enc.x + enc.w / 2} y={enc.y + enc.h + 24} textAnchor="middle">
        Transformer
      </text>
      <line className={styles.connector} x1={enc.x + enc.w + 2} x2={vecX - 6} y1={193} y2={193} markerEnd="url(#emb-arrow)" />

      {/* Embedding vector */}
      {EMBED.map((v, i) => (
        <rect key={i} className={styles.cell} x={vecX} y={vecY + i * cell} width={cell + 4} height={cell - 2} style={{ opacity: 0.25 + v * 0.75 }} />
      ))}
      <text className={`${styles.labelMuted} ${styles.small}`} x={vecX + 8} y={vecY - 14} textAnchor="middle">
        embedding
      </text>

      {/* Custom network */}
      {NET.slice(1).map((count, l) =>
        Array.from({ length: count }).flatMap((_, j) =>
          Array.from({ length: NET[l] }).map((__, i) => (
            <line
              key={`${l}-${i}-${j}`}
              className={styles.edge}
              x1={layerX[l]}
              y1={nodeY(NET[l], i)}
              x2={layerX[l + 1]}
              y2={nodeY(count, j)}
            />
          )),
        ),
      )}
      <line className={styles.connector} x1={vecX + cell + 6} x2={layerX[0] - 10} y1={193} y2={193} markerEnd="url(#emb-arrow)" />
      {NET.map((count, l) =>
        Array.from({ length: count }).map((_, i) => (
          <circle key={`${l}-${i}`} className={styles.neuron} cx={layerX[l]} cy={nodeY(count, i)} r={6} />
        )),
      )}
      <text className={`${styles.labelMuted} ${styles.small}`} x={layerX[1]} y={enc.y + enc.h + 24} textAnchor="middle">
        custom network
      </text>

      {/* Predicted misconception */}
      <line className={styles.connector} x1={layerX[2] + 10} x2={outX - 6} y1={193} y2={193} markerEnd="url(#emb-arrow)" />
      {outputs.map((p, i) => (
        <rect
          key={i}
          className={i === 0 ? styles.barAccent : styles.barMuted}
          x={outX}
          y={163 + i * 24}
          width={p * 84}
          height={12}
          rx={2}
        />
      ))}
      <text className={`${styles.labelAccent} ${styles.small}`} x={outX} y={enc.y + enc.h + 24}>
        misconception
      </text>
    </g>
  )
}

/* AI agents handling a hiring workflow */

const AGENT_STEPS = [
  { title: 'Inbox', sub: 'CVs by email' },
  { title: 'Analyse', sub: 'profile' },
  { title: 'Score', sub: 'suitability' },
  { title: 'Decide', sub: 'accept or reject' },
  { title: 'Reply', sub: 'email' },
]
const AW = 104
const AG = 16
/** The decision step carries the longest label, so it is drawn wider. */
const DECIDE_EXTRA = 34
const AX0 = (640 - (AGENT_STEPS.length * AW + (AGENT_STEPS.length - 1) * AG + 34)) / 2
const AY = 170

function Agent() {
  const x = (i: number) => AX0 + i * (AW + AG) + (i > 3 ? DECIDE_EXTRA : 0)
  const w = (i: number) => (i === 3 ? AW + DECIDE_EXTRA : AW)
  return (
    <g>
      <defs>
        <marker id="agent-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0.5 L7.5,4 L0,7.5" className={styles.arrowHead} />
        </marker>
      </defs>

      {/* Which steps the agents handle */}
      <path className={styles.bracket} d={`M${x(1)},${AY - 26} V${AY - 36} H${x(3) + w(3)} V${AY - 26}`} />
      <text className={`${styles.labelAccent} ${styles.small}`} x={(x(1) + x(3) + w(3)) / 2} y={AY - 46} textAnchor="middle">
        AI agents
      </text>

      {AGENT_STEPS.map((step, i) => {
        const agent = i >= 1 && i <= 3
        return (
          <g key={step.title}>
            {i > 0 && (
              <line
                className={styles.connector}
                x1={x(i - 1) + w(i - 1) + 2}
                x2={x(i) - 4}
                y1={AY + 29}
                y2={AY + 29}
                markerEnd="url(#agent-arrow)"
              />
            )}
            <rect className={agent ? styles.nodeAgent : styles.node} x={x(i)} y={AY} width={w(i)} height={58} rx={2} />
            <text className={styles.nodeLabel} x={x(i) + w(i) / 2} y={AY + 24} textAnchor="middle">
              {step.title}
            </text>
            <text className={`${styles.labelMuted} ${styles.small}`} x={x(i) + w(i) / 2} y={AY + 44} textAnchor="middle">
              {step.sub}
            </text>
          </g>
        )
      })}

    </g>
  )
}

/* Tracking frames on a pitch, aggregated into features */

/** Illustrative player paths (pitch units 0–1), not taken from any match. */
const PLAYERS: { team: 'a' | 'b'; path: [number, number][] }[] = [
  { team: 'a', path: [[0.18, 0.5], [0.22, 0.48], [0.27, 0.47]] },
  { team: 'a', path: [[0.32, 0.22], [0.37, 0.25], [0.42, 0.27]] },
  { team: 'a', path: [[0.34, 0.74], [0.39, 0.7], [0.44, 0.68]] },
  { team: 'a', path: [[0.5, 0.42], [0.55, 0.4], [0.6, 0.37]] },
  { team: 'a', path: [[0.58, 0.62], [0.63, 0.6], [0.68, 0.58]] },
  { team: 'b', path: [[0.82, 0.5], [0.79, 0.5], [0.76, 0.49]] },
  { team: 'b', path: [[0.66, 0.3], [0.63, 0.32], [0.6, 0.31]] },
  { team: 'b', path: [[0.7, 0.7], [0.67, 0.67], [0.64, 0.66]] },
  { team: 'b', path: [[0.54, 0.54], [0.53, 0.5], [0.52, 0.46]] },
]
const FEATURE_BARS = [0.82, 0.46, 0.68, 0.3, 0.9, 0.55, 0.38, 0.72]

function Tracking() {
  const P = { x: 24, y: 92, w: 330, h: 216 }
  const px = (u: number) => P.x + u * P.w
  const py = (v: number) => P.y + v * P.h
  const fx = 452
  return (
    <g>
      <defs>
        <marker id="trk-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0.5 L7.5,4 L0,7.5" className={styles.arrowHead} />
        </marker>
      </defs>

      {/* Pitch */}
      <rect className={styles.pitch} x={P.x} y={P.y} width={P.w} height={P.h} rx={2} />
      <line className={styles.pitchLine} x1={px(0.5)} x2={px(0.5)} y1={P.y} y2={P.y + P.h} />
      <circle className={styles.pitchLine} cx={px(0.5)} cy={py(0.5)} r={28} fill="none" />
      <rect className={styles.pitchLine} x={P.x} y={py(0.28)} width={P.w * 0.14} height={P.h * 0.44} fill="none" />
      <rect className={styles.pitchLine} x={px(0.86)} y={py(0.28)} width={P.w * 0.14} height={P.h * 0.44} fill="none" />

      {/* Positions over successive frames: trail, then current position */}
      {PLAYERS.map((p, i) => {
        const [lx, ly] = p.path[p.path.length - 1]
        return (
          <g key={i}>
            <path className={styles.trail} d={p.path.map(([u, v], j) => `${j ? 'L' : 'M'}${px(u).toFixed(1)},${py(v).toFixed(1)}`).join('')} />
            <circle className={p.team === 'a' ? styles.playerA : styles.playerB} cx={px(lx)} cy={py(ly)} r={6} />
          </g>
        )
      })}
      <circle className={styles.ball} cx={px(0.57)} cy={py(0.45)} r={3.5} />
      <text className={`${styles.labelMuted} ${styles.small}`} x={P.x} y={P.y - 14}>
        tracking frames: x, y per player
      </text>

      {/* Aggregation */}
      <line className={styles.connector} x1={P.x + P.w + 10} x2={fx - 14} y1={200} y2={200} markerEnd="url(#trk-arrow)" />
      <text className={`${styles.labelMuted} ${styles.small}`} x={(P.x + P.w + fx) / 2} y={188} textAnchor="middle">
        aggregate
      </text>

      {/* Feature table: the first rows, a gap, then the last one */}
      {FEATURE_BARS.map((v, i) => {
        const last = i === FEATURE_BARS.length - 1
        const row = last ? i + 1 : i
        return (
          <g key={i}>
            <text className={`${styles.labelMuted} ${styles.small}`} x={fx} y={104 + row * 22 + 10}>
              {last ? 'f50' : `f${String(i + 1).padStart(2, '0')}`}
            </text>
            <rect className={i === 0 ? styles.barAccent : styles.barMuted} x={fx + 40} y={104 + row * 22} width={v * 120} height={11} rx={2} />
          </g>
        )
      })}
      <text className={`${styles.labelMuted} ${styles.small}`} x={fx + 40} y={104 + (FEATURE_BARS.length - 1) * 22 + 10}>
        …
      </text>
      <text className={`${styles.labelAccent} ${styles.small}`} x={fx} y={P.y - 14}>
        50 features
      </text>
    </g>
  )
}

/* Square packing: grid versus the best-known packing for n = 5 */

const PK_U = 64 // one unit square, in figure pixels
const PK_S = 2 + Math.SQRT1_2 // best-known container side for n = 5

function Packing() {
  const sq = (x: number, y: number, cls: string, key: string, rotate = 0) => (
    <rect
      key={key}
      className={cls}
      x={x - PK_U / 2}
      y={y - PK_U / 2}
      width={PK_U}
      height={PK_U}
      rx={2}
      transform={rotate ? `rotate(${rotate} ${x} ${y})` : undefined}
    />
  )
  // Left: the trivial grid packing, side 3. Right: four corner squares and one at 45°, side 2 + 1/√2.
  const gx = 72, gy = 92, bx = 392, by = gy + (3 - PK_S) * PK_U
  const grid = [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1]]
  const best = [[0.5, 0.5], [PK_S - 0.5, 0.5], [0.5, PK_S - 0.5], [PK_S - 0.5, PK_S - 0.5]]
  return (
    <g>
      <text className={`${styles.labelMuted} ${styles.small}`} x={gx} y={gy - 18}>
        grid packing
      </text>
      <rect className={styles.container} x={gx} y={gy} width={3 * PK_U} height={3 * PK_U} />
      {grid.map(([i, j], k) => sq(gx + (i + 0.5) * PK_U, gy + (j + 0.5) * PK_U, styles.unit, `g${k}`))}
      <text className={styles.label} x={gx} y={gy + 3 * PK_U + 30}>
        L = 3
      </text>
      <text className={`${styles.labelMuted} ${styles.small}`} x={gx} y={gy + 3 * PK_U + 52}>
        score 0.342
      </text>

      <text className={`${styles.labelAccent} ${styles.small}`} x={bx} y={by - 18}>
        best known
      </text>
      <rect className={styles.containerAccent} x={bx} y={by} width={PK_S * PK_U} height={PK_S * PK_U} />
      {best.map(([i, j], k) => sq(bx + i * PK_U, by + j * PK_U, styles.unit, `b${k}`))}
      {sq(bx + (PK_S / 2) * PK_U, by + (PK_S / 2) * PK_U, styles.unitAccent, 'tilted', 45)}
      <text className={styles.label} x={bx} y={gy + 3 * PK_U + 30}>
        L = 2 + 1/√2 ≈ 2.707
      </text>
      <text className={`${styles.labelMuted} ${styles.small}`} x={bx} y={gy + 3 * PK_U + 52}>
        score 0.211
      </text>

      <text className={`${styles.labelMuted} ${styles.small}`} x={320} y={378} textAnchor="middle">
        n = 5 unit squares · score(n) = L / √n − 1, lower is better
      </text>
    </g>
  )
}
