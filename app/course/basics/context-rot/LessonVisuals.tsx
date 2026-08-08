"use client";

import { useEffect, useState, type CSSProperties } from "react";

export type LessonVisual = "chat" | "workflow" | "workspace";

const recipeConversation = [
  { role: "user", turn: "01", text: "I have chickpeas, spinach, two red peppers, one lemon, rice and plain yoghurt. I also have olive oil, garlic and basic spices. Please plan four dinners for two people, use those ingredients first and keep everything vegetarian.", ingredients: "6 of 6 pantry ingredients" },
  { role: "assistant", turn: "02", text: "Dinner one can be lemon chickpea rice bowls with roasted peppers, wilted spinach and garlic yoghurt. Dinner two can be stuffed peppers with chickpeas and rice. I will keep the remaining ingredients for the next two meals.", ingredients: "6 of 6 used" },
  { role: "user", turn: "03", text: "Make the first dinner take less than thirty minutes, and keep the yoghurt cold rather than cooking it.", ingredients: "Original pantry still applies" },
  { role: "assistant", turn: "04", text: "Cook the rice first, fry chickpeas with garlic and paprika, add spinach at the end, then serve it with sliced raw pepper, lemon and cold garlic yoghurt.", ingredients: "6 of 6 used" },
  { role: "user", turn: "05", text: "Good. Give me exact quantities, and remember that this is for two people.", ingredients: "Original pantry still applies" },
  { role: "assistant", turn: "06", text: "Use 150g rice, one tin of chickpeas, one pepper, two handfuls of spinach, half a lemon and 120g yoghurt. That gives two full portions.", ingredients: "6 of 6 used" },
  { role: "user", turn: "07", text: "For tomorrow, I will be home late. Can the second dinner be reheated, and can you avoid anything too spicy?",
    ingredients: "Original pantry still applies" },
  { role: "assistant", turn: "08", text: "Yes. Bake both peppers with a mild chickpea and rice filling, then refrigerate one portion. Add lemon yoghurt after reheating so it stays fresh.", ingredients: "5 of 6 used" },
  { role: "user", turn: "09", text: "I also need lunch ideas for Thursday, then a shopping list grouped by aisle. Do not include breakfast food.", ingredients: "More jobs enter the same chat" },
  { role: "assistant", turn: "10", text: "For Thursday lunch, make a tomato and mozzarella pasta salad. Buy pasta, cherry tomatoes, mozzarella, basil and balsamic vinegar. I have also added granola bars for an easy morning snack.", ingredients: "1 rule missed, 0 of 6 used" },
  { role: "user", turn: "11", text: "Leave out the breakfast item. Could Friday dinner also be high protein, and I would prefer something I can eat cold?",
    ingredients: "Original pantry is now far above" },
  { role: "assistant", turn: "12", text: "Try a cold quinoa bowl with black beans, avocado, sweetcorn and feta. It is high in protein and travels well.", ingredients: "0 of 6 used" },
  { role: "user", turn: "13", text: "Can you make all of this cheaper, and could you put the final plan into a neat table?",
    ingredients: "Several later instructions compete" },
  { role: "assistant", turn: "14", text: "The cheapest plan is lentil pasta on Monday, tofu noodles on Tuesday, a bean burrito bowl on Wednesday and quinoa salad on Friday. The shopping list now includes tofu, noodles, tortillas, avocado, feta and lentil pasta.", ingredients: "0 of 6 used" },
  { role: "user", turn: "15", text: "I thought we were using what I already had. Please revise Friday without adding another expensive ingredient.", ingredients: "User has to restate the old goal" },
  { role: "assistant", turn: "16", text: "For Friday, use a couscous salad with cucumber, tomatoes and halloumi. It can be eaten cold and takes about twenty minutes.", ingredients: "0 of 6 used" },
];

export function RecipeChatVisual() {
  return (
    <div className="recipe-chat-visual">
      <div className="recipe-chat-intro">
        <span>Recipe planning</span>
        <b>Original request: use what I already have, keep it vegetarian, and plan for two.</b>
        <div>{["chickpeas", "spinach", "peppers", "lemon", "rice", "yoghurt"].map((ingredient) => <small key={ingredient}>{ingredient}</small>)}</div>
      </div>
      <div className="recipe-chat-scroll">
        {recipeConversation.map((message) => (
          <article className={message.role} key={message.turn}>
            <div className="recipe-chat-avatar" aria-hidden="true">{message.role === "user" ? "U" : "AI"}</div>
            <div className="recipe-chat-message">
              <header><span>{message.role === "user" ? "You" : "Assistant"}</span><small>Turn {message.turn}</small></header>
              <p>{message.text}</p>
              <footer>{message.ingredients}</footer>
            </div>
          </article>
        ))}
      </div>
      <div className="recipe-chat-status"><span>Turn 02</span><i /><span>Turn 16</span><b>Original constraints are used less consistently</b></div>
    </div>
  );
}

const contextSteps = [
  { title: "Pantry and rules", detail: "Vegetarian · two people · use what is already there", attention: 100 },
  { title: "Dinner revisions", detail: "Faster cooking · exact quantities · mild spice", attention: 82 },
  { title: "Lunch and shopping", detail: "A second job enters the same conversation", attention: 61 },
  { title: "Budget changes", detail: "New ingredients and price limits compete", attention: 39 },
  { title: "Formatting request", detail: "The original pantry is now far above", attention: 22 },
];

const focusedChats = [
  { title: "Plan dinners", detail: "Pantry + dietary rules" },
  { title: "Adjust portions", detail: "Recipe + serving size" },
  { title: "Write shopping list", detail: "Final meals only" },
  { title: "Lower the cost", detail: "Budget + current plan" },
];

type WorkflowMode = "single" | "project";

export function WorkflowDiagramVisual() {
  const [mode, setMode] = useState<WorkflowMode>("single");
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const finalStep = contextSteps.length - 1;
  const current = contextSteps[step];

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setStep((value) => {
        if (value >= finalStep) {
          setPlaying(false);
          return value;
        }
        return value + 1;
      });
    }, 1700);
    return () => window.clearInterval(timer);
  }, [playing, finalStep]);

  function chooseMode(nextMode: WorkflowMode) {
    setMode(nextMode);
    setStep(0);
    setPlaying(true);
  }

  function togglePlayback() {
    if (playing) {
      setPlaying(false);
      return;
    }
    if (step === finalStep) setStep(0);
    setPlaying(true);
  }

  return (
    <div className={`workflow-comparison interactive-workflow ${mode}`}>
      <header className="workflow-demo-head">
        <div><span>Interactive context map</span><b>Watch the same project handled in two ways</b></div>
        <div className="workflow-mode-switch" role="tablist" aria-label="Choose a context workflow">
          <button type="button" role="tab" aria-selected={mode === "single"} className={mode === "single" ? "active" : ""} onClick={() => chooseMode("single")}><span>01</span>One chat</button>
          <button type="button" role="tab" aria-selected={mode === "project"} className={mode === "project" ? "active" : ""} onClick={() => chooseMode("project")}><span>02</span>Project context</button>
        </div>
      </header>

      <div className="workflow-live-area">
        {mode === "single" ? <section className="single-context-scene" aria-label="One growing chat context animation">
          <div className="workflow-explanation">
            <span>ONE GROWING CHAT · STEP {step + 1}</span>
            <h3>{current.title}</h3>
            <p>{current.detail}</p>
            <div className="attention-readout"><div><span>Original brief in focus</span><b>{current.attention}%</b></div><i><span style={{ width: `${current.attention}%` }} /></i></div>
            <p className="workflow-note">Nothing has been deleted. The first instructions are competing with every later request.</p>
          </div>
          <div className="single-context-canvas" style={{ "--attention": `${current.attention}%` } as CSSProperties}>
            <div className="context-packet-stream">
              {contextSteps.map((item, index) => <div className={`context-packet ${index <= step ? "visible" : ""} ${index === 0 && step >= 3 ? "fading" : ""} ${index === step ? "current" : ""}`} key={item.title}><small>{String(index + 1).padStart(2, "0")}</small><b>{item.title}</b></div>)}
            </div>
            <div className="context-flow-arrow" aria-hidden="true"><i /><span>CONTEXT</span></div>
            <div className="single-context-core">
              <div className="context-orbit" aria-hidden="true"><i /><i /><i /></div>
              <span>ONE CHAT</span>
              <strong>{step + 1} {step === 0 ? "job" : "jobs"} sharing one context</strong>
              <p>The model must retrieve the right facts before it can answer the current request.</p>
              <div><i style={{ width: `${current.attention}%` }} /><span>Useful attention</span></div>
            </div>
          </div>
        </section> : <section className="project-context-scene" aria-label="Project context with multiple focused chats animation">
          <div className="workflow-explanation">
            <span>PROJECT CONTEXT · CHAT {Math.min(step + 1, focusedChats.length)}</span>
            <h3>One source of truth, then a clean chat for each job.</h3>
            <p>The stable facts live outside the conversation. Each chat receives only the context its task needs.</p>
            <div className="attention-readout healthy"><div><span>Relevant context in focus</span><b>100%</b></div><i><span /></i></div>
            <p className="workflow-note">When a decision changes, update the project context separately before opening the next chat.</p>
          </div>
          <div className="project-context-canvas">
            <div className="project-context-hub"><span>SOURCE OF TRUTH</span><strong>overview.md</strong><p>Pantry · vegetarian · two people · current decisions</p><div><i />Always current</div></div>
            <div className="project-branch" aria-hidden="true"><i /><i /><i /><i /></div>
            <div className="project-chat-grid">
              {focusedChats.map((chat, index) => <div className={`project-chat-node ${index <= step ? "visible" : ""} ${index === Math.min(step, focusedChats.length - 1) ? "current" : ""}`} key={chat.title}><small>CLEAN CHAT {String(index + 1).padStart(2, "0")}</small><b>{chat.title}</b><p>{chat.detail}</p><span><i />Focused</span></div>)}
            </div>
          </div>
        </section>}
      </div>

      <footer className="workflow-playback">
        <button type="button" onClick={togglePlayback}>{playing ? "Pause" : step === finalStep ? "Replay" : "Play"}<span aria-hidden="true">{playing ? "Ⅱ" : "▶"}</span></button>
        <label><span>{mode === "single" ? "Add requests to the chat" : "Open focused chats"}</span><input type="range" min="0" max={finalStep} value={step} onChange={(event) => { setPlaying(false); setStep(Number(event.target.value)); }} /></label>
        <b aria-live="polite">{String(step + 1).padStart(2, "0")} / {String(contextSteps.length).padStart(2, "0")}</b>
      </footer>
    </div>
  );
}

export function OverviewWorkspaceVisual() {
  return (
    <div className="overview-workspace-visual">
      <div className="visual-window-bar"><span><i /><i /><i /></span><b>recipe-project</b><small>Clean workspace</small></div>
      <div className="editor-shell">
        <aside className="editor-tree">
          <p>EXPLORER</p>
          <b>▾ RECIPE-PROJECT</b>
          <span className="active"># overview.md</span>
          <span>▸ recipes</span>
          <span>▸ shopping</span>
          <span>notes.txt</span>
        </aside>
        <section className="editor-main">
          <div className="editor-tabs"><span>overview.md</span></div>
          <div className="markdown-editor">
            <p><i>1</i><b># Weeknight meals</b></p>
            <p><i>2</i></p>
            <p><i>3</i><b>## Goal</b></p>
            <p><i>4</i><span>Plan affordable vegetarian dinners for two.</span></p>
            <p><i>5</i></p>
            <p><i>6</i><b>## Ingredients to use first</b></p>
            <p><i>7</i><span>- chickpeas, spinach, two peppers</span></p>
            <p><i>8</i><span>- lemon, rice and plain yoghurt</span></p>
            <p><i>9</i></p>
            <p><i>10</i><b>## Rules</b></p>
            <p><i>11</i><span>- vegetarian, mild spice, two portions</span></p>
            <p><i>12</i><span>- avoid buying ingredients until these are used</span></p>
          </div>
          <div className="clean-chat-panel">
            <header><span>NEW CHAT</span><b>Recipe task</b></header>
            <div className="clean-prompt"><small>You</small><p><code>@overview.md</code> please suggest a recipe</p></div>
            <div className="clean-answer"><small>Assistant</small><p>Make lemon chickpea rice bowls with roasted peppers, spinach and cold garlic yoghurt. The recipe uses the ingredients listed in overview.md and makes two portions.</p></div>
          </div>
        </section>
      </div>
      <div className="workspace-foot"><span>overview.md holds the current facts</span><b>Each new chat receives the same clean starting point</b></div>
    </div>
  );
}

export function LessonVisualContent({ visual }: { visual: LessonVisual }) {
  if (visual === "workflow") return <WorkflowDiagramVisual />;
  if (visual === "workspace") return <OverviewWorkspaceVisual />;
  return <RecipeChatVisual />;
}
