import LessonDiagram from "../../LessonDiagram";

const stages = [
  { number: "01", lines: ["Start with", "web AI"], result: "Give it a clear job", colour: "#c7ff24" },
  { number: "02", lines: ["Narrow and", "control results"], result: "Define what may pass", colour: "#f4a340" },
  { number: "03", lines: ["Keep a", "repeatable project"], result: "Save useful context", colour: "#ff6f91" },
  { number: "04", lines: ["Choose and", "measure models"], result: "Test with evidence", colour: "#7dd3fc" },
  { number: "05", lines: ["Enter a", "safe workspace"], result: "Protect every change", colour: "#a78bfa" },
  { number: "06", lines: ["Build with", "one agent"], result: "Supervise the loop", colour: "#fb7185" },
  { number: "07", lines: ["Reuse and", "scale the work"], result: "Add skills and tools", colour: "#facc15" },
  { number: "08", lines: ["Ship and", "maintain"], result: "Observe and improve", colour: "#4ade80" },
];

const desktopPositions = [
  [140, 126], [400, 126], [660, 126], [920, 126],
  [920, 354], [660, 354], [400, 354], [140, 354],
];

function DesktopStage({ stage, x, y }: { stage: typeof stages[number]; x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <rect className="course-path-node" x="-108" y="-55" width="216" height="110" rx="5" />
    <rect x="-108" y="-55" width="10" height="110" fill={stage.colour} />
    <text x="-84" y="-31" fill={stage.colour} fontSize="12" fontWeight="900" letterSpacing="1.4">CHAPTER {stage.number}</text>
    <text x="-84" y="-5" className="course-path-node-title"><tspan x="-84">{stage.lines[0]}</tspan><tspan x="-84" dy="21">{stage.lines[1]}</tspan></text>
    <text x="-84" y="40" className="course-path-node-result">{stage.result}</text>
  </g>;
}

function MobileStage({ stage, y }: { stage: typeof stages[number]; y: number }) {
  return <g transform={`translate(210 ${y})`}>
    <rect className="course-path-node" x="-172" y="-48" width="344" height="96" rx="5" />
    <rect x="-172" y="-48" width="10" height="96" fill={stage.colour} />
    <text x="-145" y="-23" fill={stage.colour} fontSize="12" fontWeight="900" letterSpacing="1.2">CHAPTER {stage.number}</text>
    <text x="-145" y="4" className="course-path-node-title"><tspan>{stage.lines.join(" ")}</tspan></text>
    <text x="-145" y="31" className="course-path-node-result">{stage.result}</text>
  </g>;
}

export default function CoursePathwayDiagram() {
  return <LessonDiagram
    eyebrow="COURSE PATHWAY"
    title="Eight chapters move from a web prompt to a maintained AI system."
    description="The moving marker follows the learner route. Every stage keeps the same control loop: define, supply context, constrain, run, check and record."
  >
    <svg className="course-pathway-svg course-pathway-svg-desktop" viewBox="0 0 1060 545" focusable="false">
      <path id="course-path-desktop" className="course-path-line" d="M140 126 H920 V354 H140" pathLength="100" />
      <g className="course-path-arrows">
        <path d="M270 114 l12 12 -12 12" />
        <path d="M530 114 l12 12 -12 12" />
        <path d="M790 114 l12 12 -12 12" />
        <path d="M932 232 l-12 12 -12 -12" />
        <path d="M790 342 l-12 12 12 12" />
        <path d="M530 342 l-12 12 12 12" />
        <path d="M270 342 l-12 12 12 12" />
      </g>
      {stages.map((stage, index) => <DesktopStage key={stage.number} stage={stage} x={desktopPositions[index][0]} y={desktopPositions[index][1]} />)}
      <circle className="course-path-pulse" r="8" fill="#c7ff24">
        <animateMotion dur="8s" repeatCount="indefinite"><mpath href="#course-path-desktop" /></animateMotion>
      </circle>
      <circle className="course-path-pulse course-path-pulse-second" r="5" fill="#ffffff">
        <animateMotion dur="8s" begin="-4s" repeatCount="indefinite"><mpath href="#course-path-desktop" /></animateMotion>
      </circle>
      <g transform="translate(530 485)" className="course-control-loop">
        <text y="-22" textAnchor="middle">THE CONTROL LOOP RETURNS IN EVERY CHAPTER</text>
        {['DEFINE','CONTEXT','CONSTRAIN','RUN','CHECK','RECORD'].map((label, index) => <g key={label} transform={`translate(${(index - 3) * 135 + 68} 0)`}>
          <rect x="-59" y="-13" width="118" height="28" rx="3" />
          <text y="5" textAnchor="middle">{label}</text>
        </g>)}
      </g>
    </svg>
    <svg className="course-pathway-svg course-pathway-svg-mobile" viewBox="0 0 420 1125" focusable="false">
      <path id="course-path-mobile" className="course-path-line" d="M210 72 V922" pathLength="100" />
      {stages.map((stage, index) => <MobileStage key={stage.number} stage={stage} y={72 + index * 122} />)}
      <circle className="course-path-pulse" r="8" fill="#c7ff24">
        <animateMotion dur="8s" repeatCount="indefinite"><mpath href="#course-path-mobile" /></animateMotion>
      </circle>
      <g transform="translate(210 1033)" className="course-control-loop course-control-loop-mobile">
        <text y="-49" textAnchor="middle">THE SAME CONTROL LOOP</text>
        {['DEFINE','CONTEXT','CONSTRAIN','RUN','CHECK','RECORD'].map((label, index) => <g key={label} transform={`translate(${index % 3 * 116 - 116} ${Math.floor(index / 3) * 42})`}>
          <rect x="-52" y="-14" width="104" height="28" rx="3" />
          <text y="5" textAnchor="middle">{label}</text>
        </g>)}
      </g>
    </svg>
  </LessonDiagram>;
}
