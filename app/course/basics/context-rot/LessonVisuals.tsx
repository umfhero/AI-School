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
      <div className="visual-window-bar"><span><i /><i /><i /></span><b>Recipe planning</b><small>Illustrative conversation</small></div>
      <div className="recipe-chat-intro">
        <span>Original instruction</span>
        <b>Use what I already have, keep it vegetarian, and plan for two.</b>
        <div>{["chickpeas", "spinach", "peppers", "lemon", "rice", "yoghurt"].map((ingredient) => <small key={ingredient}>{ingredient}</small>)}</div>
      </div>
      <div className="recipe-chat-scroll">
        {recipeConversation.map((message, index) => (
          <article className={`${message.role} ${index >= 9 ? "drifting" : ""}`} key={message.turn}>
            <header><span>{message.role === "user" ? "You" : "Assistant"}</span><small>Turn {message.turn}</small></header>
            <p>{message.text}</p>
            <footer>{message.ingredients}</footer>
          </article>
        ))}
      </div>
      <div className="recipe-chat-status"><span>Turn 02</span><i /><span>Turn 16</span><b>Original constraints are used less consistently</b></div>
    </div>
  );
}

export function WorkflowDiagramVisual() {
  return (
    <div className="workflow-comparison">
      <div className="diagram-heading"><span>Two ways to carry context</span><b>The same information, organised differently</b></div>
      <div className="workflow-columns">
        <section className="overloaded-flow">
          <header><span>01</span><h3>One growing chat</h3></header>
          <div className="context-stream">
            <div className="context-block old"><small>Turn 01</small><b>Ingredients and rules</b></div>
            <div className="context-arrow">↓</div>
            <div className="context-block ageing"><small>Turn 09</small><b>Lunch and shopping</b></div>
            <div className="context-arrow">↓</div>
            <div className="context-block"><small>Turn 14</small><b>Prices and formatting</b></div>
            <div className="context-arrow">↓</div>
            <div className="single-chat-box"><span>CHAT</span><b>Every job and every correction</b><p>Earlier facts remain in the input, but they sit among more competing material.</p></div>
          </div>
        </section>
        <section className="focused-flow">
          <header><span>02</span><h3>Saved context and clean chats</h3></header>
          <div className="truth-box"><span>SOURCE OF TRUTH</span><b>Project or overview.md</b><p>Ingredients, serving size, preferences and current decisions stay here.</p></div>
          <div className="branch-line" aria-hidden="true"><i /><i /><i /></div>
          <div className="focused-chat-list">
            <div><small>Clean chat 01</small><b>Plan four dinners</b><span>Only the relevant context</span></div>
            <div><small>Clean chat 02</small><b>Adjust the portions</b><span>Only the relevant context</span></div>
            <div><small>Clean chat 03</small><b>Write the shopping list</b><span>Only the relevant context</span></div>
          </div>
          <p className="context-update-note"><b>Update separately</b> When a decision changes, update the source of truth before starting the next job.</p>
        </section>
      </div>
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
