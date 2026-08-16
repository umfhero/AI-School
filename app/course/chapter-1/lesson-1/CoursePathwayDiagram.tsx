import LessonDiagram from "../../LessonDiagram";

const chapters = [
  {
    number: "01",
    phase: "FOUNDATION",
    title: "Use AI on the web",
    mobileTitle: ["Use AI on", "the web"],
    topics: ["AI basics", "Clear requests", "Sources and files", "Checking and privacy"],
    outcome: "Complete one checked web task",
    colour: "#6650e6",
    surface: "#fbf5ab",
  },
  {
    number: "02",
    phase: "FOUNDATION",
    title: "Understand models and AI products",
    mobileTitle: ["Understand models", "and AI products"],
    topics: ["Provider companies", "Model types", "Closed and open weights", "Speed, cost and reasoning"],
    outcome: "Choose a model for the work",
    colour: "#b56f26",
    surface: "#fff0c7",
  },
  {
    number: "03",
    phase: "CONTROL",
    title: "Manage prompts and context",
    mobileTitle: ["Manage prompts", "and context"],
    topics: ["Prompt structure", "Tokens and windows", "Context clearing", "Memory and retrieval"],
    outcome: "Build a clean context pack",
    colour: "#8b62c7",
    surface: "#eee8ff",
  },
  {
    number: "04",
    phase: "CONTROL",
    title: "Build AI workflows",
    mobileTitle: ["Build AI", "workflows"],
    topics: ["Inputs and outputs", "Steps and branches", "Tools and approvals", "State and handovers"],
    outcome: "Run a visible, repeatable process",
    colour: "#3976b9",
    surface: "#e5f1ff",
  },
  {
    number: "05",
    phase: "CONTROL",
    title: "Narrow outputs and actions",
    mobileTitle: ["Narrow outputs", "and actions"],
    topics: ["Generation controls", "Schemas and constraints", "Validation and retries", "Repeatability tests"],
    outcome: "Set the allowed variation and failures",
    colour: "#6650e6",
    surface: "#ebe7ff",
  },
  {
    number: "06",
    phase: "BUILD",
    title: "Set up a project workspace",
    mobileTitle: ["Set up a project", "workspace"],
    topics: ["Project brief", "Files and handovers", "Git and recovery", "Permissions and tests"],
    outcome: "Create a recoverable project home",
    colour: "#b65477",
    surface: "#fbe7ee",
  },
  {
    number: "07",
    phase: "BUILD",
    title: "Work with one agent",
    mobileTitle: ["Work with", "one agent"],
    topics: ["The agent loop", "Agent briefs", "Inspect, plan and change", "Review and handover"],
    outcome: "Supervise one contained change",
    colour: "#98731f",
    surface: "#e8edff",
  },
  {
    number: "08",
    phase: "BUILD",
    title: "Create skills and connect tools",
    mobileTitle: ["Create skills", "and connect tools"],
    topics: ["Specifications", "Templates and skills", "MCP and tool contracts", "Versioning and tests"],
    outcome: "Reuse a checked capability",
    colour: "#317c5d",
    surface: "#e3f5e9",
  },
  {
    number: "09",
    phase: "ORCHESTRATE",
    title: "Orchestrate models and agents",
    mobileTitle: ["Orchestrate models", "and agents"],
    topics: ["Model routing", "Models prompting models", "Subagents and isolation", "Monitoring and merging"],
    outcome: "Coordinate work without losing control",
    colour: "#327c9c",
    surface: "#e2f3f8",
  },
  {
    number: "10",
    phase: "OPERATE",
    title: "Ship, monitor and maintain",
    mobileTitle: ["Ship, monitor", "and maintain"],
    topics: ["Deploy and roll back", "Logs, traces and cost", "Live evaluation", "Security and maintenance"],
    outcome: "Operate the complete system",
    colour: "#995078",
    surface: "#f8e6f0",
  },
];

function DesktopChapter({ chapter, y }: { chapter: typeof chapters[number]; y: number }) {
  return <g className="pathway-chapter" transform={`translate(0 ${y})`}>
    <path className="pathway-connector" d="M48 58 H94" />
    <rect className="pathway-checkpoint" x="38" y="48" width="16" height="16" fill={chapter.surface} />
    <rect x="43" y="53" width="6" height="6" fill={chapter.colour} />
    <rect className="pathway-card" x="96" y="1" width="902" height="116" fill={chapter.surface} />
    <rect x="96" y="1" width="10" height="116" fill={chapter.colour} />
    <text className="pathway-card-label" x="128" y="26" fill={chapter.colour}>CHAPTER {chapter.number}  /  {chapter.phase}</text>
    <text className="pathway-card-title" x="128" y="55">{chapter.title}</text>
    <text className="pathway-card-outcome" x="128" y="88">YOU LEAVE WITH</text>
    <text className="pathway-card-outcome-copy" x="128" y="105">{chapter.outcome}</text>
    <path className="pathway-card-divider" d="M500 18 V100" />
    <text className="pathway-card-covers" x="528" y="27">THIS CHAPTER COVERS</text>
    {chapter.topics.map((topic, index) => {
      const x = index % 2 === 0 ? 528 : 762;
      const topicY = index < 2 ? 57 : 91;
      return <g key={topic}>
        <rect x={x} y={topicY - 9} width="8" height="8" fill={chapter.colour} />
        <text className="pathway-card-topic" x={x + 17} y={topicY}>{topic}</text>
      </g>;
    })}
  </g>;
}

function MobileChapter({ chapter, y }: { chapter: typeof chapters[number]; y: number }) {
  return <g className="pathway-chapter" transform={`translate(0 ${y})`}>
    <path className="pathway-connector" d="M28 121 H53" />
    <rect className="pathway-checkpoint" x="20" y="113" width="14" height="14" fill={chapter.surface} />
    <rect x="24" y="117" width="6" height="6" fill={chapter.colour} />
    <rect className="pathway-card" x="55" y="1" width="338" height="242" fill={chapter.surface} />
    <rect x="55" y="1" width="9" height="242" fill={chapter.colour} />
    <text className="pathway-card-label" x="80" y="24" fill={chapter.colour}>CHAPTER {chapter.number}  /  {chapter.phase}</text>
    <text className="pathway-card-title pathway-card-title-mobile" x="80" y="50">
      <tspan x="80">{chapter.mobileTitle[0]}</tspan>
      <tspan x="80" dy="23">{chapter.mobileTitle[1]}</tspan>
    </text>
    <text className="pathway-card-covers" x="80" y="101">THIS CHAPTER COVERS</text>
    {chapter.topics.map((topic, index) => {
      const x = 80;
      const topicY = 127 + index * 23;
      return <g key={topic}>
        <rect x={x} y={topicY - 8} width="7" height="7" fill={chapter.colour} />
        <text className="pathway-card-topic pathway-card-topic-mobile" x={x + 15} y={topicY}>{topic}</text>
      </g>;
    })}
    <path className="pathway-card-divider pathway-card-divider-mobile" d="M80 211 H368" />
    <text className="pathway-card-outcome-copy pathway-card-outcome-mobile" x="80" y="231">{chapter.outcome}</text>
  </g>;
}

export default function CoursePathwayDiagram() {
  return <>
    <LessonDiagram
      tone="paper"
      eyebrow="YOUR COURSE MAP"
      meta="10 CHAPTERS"
      title="Ten chapters move from browser AI to an operated system."
      description="Read each chapter from top to bottom. The square signal travels in its own rail beside the cards, while every card names the concepts and the result you will carry into the next chapter."
    >
      <svg className="course-pathway-svg course-pathway-svg-desktop" viewBox="0 0 1040 1358" focusable="false" shapeRendering="crispEdges">
        <path id="pathway-rail-desktop" className="pathway-rail" d="M48 18 V1338" />
        {chapters.map((chapter, index) => <DesktopChapter key={chapter.number} chapter={chapter} y={16 + index * 132} />)}
        <rect className="course-path-runner" x="-7" y="-7" width="14" height="14" fill="#6650e6">
          <animateMotion dur="12s" repeatCount="indefinite"><mpath href="#pathway-rail-desktop" /></animateMotion>
        </rect>
        <rect className="course-path-runner course-path-runner-second" x="-5" y="-5" width="10" height="10" fill="#ffffff">
          <animateMotion dur="12s" begin="-6s" repeatCount="indefinite"><mpath href="#pathway-rail-desktop" /></animateMotion>
        </rect>
      </svg>

      <svg className="course-pathway-svg course-pathway-svg-mobile" viewBox="0 0 420 2595" focusable="false" shapeRendering="crispEdges">
        <path id="pathway-rail-mobile" className="pathway-rail" d="M28 18 V2572" />
        {chapters.map((chapter, index) => <MobileChapter key={chapter.number} chapter={chapter} y={14 + index * 257} />)}
        <rect className="course-path-runner" x="-6" y="-6" width="12" height="12" fill="#6650e6">
          <animateMotion dur="12s" repeatCount="indefinite"><mpath href="#pathway-rail-mobile" /></animateMotion>
        </rect>
      </svg>
    </LessonDiagram>
    <ol className="lesson-diagram-accessible">
      {chapters.map((chapter) => <li key={chapter.number}>Chapter {chapter.number}, {chapter.title}. Covers {chapter.topics.join(", ")}. Outcome: {chapter.outcome}.</li>)}
    </ol>
  </>;
}
