"use client";

import { useState } from "react";

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

type WorkflowMode = "single" | "project";

export function WorkflowDiagramVisual() {
  const [mode, setMode] = useState<WorkflowMode>("single");

  return (
    <div className="web-context-comparison">
      <header className="web-comparison-head">
        <div><span>WEB CONTEXT WORKFLOW</span><b>Two ways to organise the same project</b></div>
        <div className="web-mode-switch" role="tablist" aria-label="Choose a context workflow">
          <button type="button" role="tab" aria-selected={mode === "single"} className={mode === "single" ? "active" : ""} onClick={() => setMode("single")}><span>01</span>One long chat</button>
          <button type="button" role="tab" aria-selected={mode === "project"} className={mode === "project" ? "active" : ""} onClick={() => setMode("project")}><span>02</span>Project chats</button>
        </div>
      </header>
      {mode === "single" ? <section className="chat-product-mock long-thread" aria-label="A large chat thread containing many unrelated requests">
        <div className="mock-browser-bar"><span><i /><i /><i /></span><b>chat.example.com</b><small>GPT chat</small></div>
        <div className="long-thread-layout">
          <aside className="chat-rail"><b>GPT</b><button type="button">+ New chat</button><small>RECENT</small><span className="selected">Weeknight meal plan</span><span>Portfolio copy</span><span>Holiday notes</span></aside>
          <div className="chat-thread">
            <header><div><span>GPT chat</span><b>Weeknight meal plan</b></div><small>48 messages</small></header>
            <div className="thread-scroll">
              <article className="thread-message you faded"><small>You · message 01</small><p>Use chickpeas, spinach, peppers, lemon, rice and yoghurt first. Vegetarian dinners for two.</p></article>
              <article className="thread-message ai"><small>GPT · message 18</small><p>Here are the revised portions for the second dinner, with mild spice and a cold yoghurt sauce.</p></article>
              <article className="thread-message you"><small>You · message 31</small><p>Now give me Thursday lunch ideas and a shopping list by aisle.</p></article>
              <article className="thread-message ai current"><small>GPT · message 48</small><p>For Friday, try quinoa with avocado and feta. I can also turn the plan into a table.</p></article>
            </div>
            <div className="mock-composer"><span>Message GPT about this project…</span><b>↑</b></div>
          </div>
        </div>
        <footer><span>Everything said before is still in this one thread.</span><b>Old brief competes with 47 later messages</b></footer>
      </section> : <section className="chat-product-mock project-chats" aria-label="A project with shared context and separate focused chats">
        <div className="mock-browser-bar"><span><i /><i /><i /></span><b>chat.example.com / projects / weeknight meals</b><small>GPT chat</small></div>
        <div className="project-chat-layout">
          <main>
            <div className="project-title"><small>PROJECTS /</small><h3>Weeknight meals</h3><span>⋮</span></div>
            <div className="project-composer"><span>Start a clean chat…</span><div><i>Chat</i><b>Send ↑</b></div></div>
            <p className="project-recents">Recent chats</p>
            <div className="project-chat-list"><article><i>◌</i><div><b>Plan Monday dinner</b><small>Uses project context · today</small></div><span>›</span></article><article><i>◌</i><div><b>Adjust portions for two</b><small>Uses project context · yesterday</small></div><span>›</span></article><article><i>◌</i><div><b>Write the shopping list</b><small>Uses project context · yesterday</small></div><span>›</span></article></div>
          </main>
          <aside className="project-context-panel"><header><b>Project context</b><span>+</span></header><p>Files attached to every new chat in this project.</p><div className="context-file"><span>MD</span><div><b>overview.md</b><small>Goal, ingredients, rules</small></div><i>✓</i></div><div className="context-file"><span>PDF</span><div><b>budget-notes.pdf</b><small>Optional reference</small></div><i>✓</i></div><footer><b>3% of project capacity used</b><i><span /></i></footer></aside>
        </div>
        <footer><span>Each chat starts clean.</span><b>It receives the project context, not the other chats</b></footer>
      </section>}
    </div>
  );
}

export function OverviewWorkspaceVisual() {
  return (
    <div className="coding-workspace-visual">
      <div className="visual-window-bar"><span><i /><i /><i /></span><b>weeknight-meals</b><small>Visual Studio Code</small></div>
      <div className="vscode-shell">
        <aside className="vscode-activity" aria-hidden="true"><b>▣</b><span>⌕</span><span>⑂</span><span>▹</span><span>▦</span></aside>
        <aside className="vscode-explorer"><header>EXPLORER <span>···</span></header><b>▾ WEEKnight-MEALS</b><div className="tree-active"><i>ⓜ</i> overview.md</div><div>⌄ <span>recipes</span></div><div className="tree-child">recipe-notes.md</div><div>⌄ <span>shopping</span></div><div className="tree-child">list.md</div><div>⌄ <span>src</span></div><div>.gitignore</div></aside>
        <section className="vscode-editor"><div className="vscode-tabs"><span className="active"><i>ⓜ</i> overview.md <b>×</b></span><span>recipe-notes.md</span></div><div className="vscode-breadcrumb">WEEKnight-MEALS <b>›</b> overview.md <b>›</b> Project context</div><article className="markdown-preview"><small>MARKDOWN PREVIEW</small><h1>Weeknight meals</h1><p className="preview-lede">The current project context for every coding task.</p><section><h2>Goal</h2><p>Plan affordable vegetarian dinners for two, using the ingredients already in the kitchen before buying more.</p></section><section><h2>Ingredients to use first</h2><div className="ingredient-tags"><span>Chickpeas</span><span>Spinach</span><span>2 peppers</span><span>Lemon</span><span>Rice</span><span>Plain yoghurt</span></div></section><section><h2>Rules</h2><ul><li>Keep the meals vegetarian and mild.</li><li>Make two portions at a time.</li><li>Update this file when a decision changes.</li></ul></section><section className="current-task"><span>Current task</span><b>Write a recipe for Monday dinner.</b></section></article><footer><span>Ln 1, Col 1</span><span>Spaces: 2</span><span>UTF-8</span><b>Markdown</b></footer></section>
      </div>
      <div className="workspace-foot"><span>overview.md is open in the project workspace</span><b>Every task begins from the current file</b></div>
    </div>
  );
}

export function LessonVisualContent({ visual }: { visual: LessonVisual }) {
  if (visual === "workflow") return <WorkflowDiagramVisual />;
  if (visual === "workspace") return <OverviewWorkspaceVisual />;
  return <RecipeChatVisual />;
}
