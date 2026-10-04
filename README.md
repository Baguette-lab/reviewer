# Pathwise — Interactive Nursing Mastery

Complete website source for shock, anemia, thyroid disorders, seizures, and HIV/AIDS. Runs locally in VS Code and on GitHub Pages without a backend, API key, or dependency installation.

## Run it in VS Code

1. Extract the ZIP. Open the **Pathwise-Interactive-Full-Code** folder in VS Code.
2. Install Node.js 18 or later if it is not already installed.
3. Open **Terminal → New Terminal**. Make sure you are in the folder containing `package.json`.
4. Run:

   ```sh
   npm start
   ```

   You can also run `node server.mjs`. There is no need to run `npm install`.

5. Open **http://localhost:5500** in your browser. Keep the terminal open while studying; press **Ctrl+C** to stop the server.
6. Select a lesson and choose **Visual Lab**. Start with the organ explorer: select a part, follow the numbered steps, and change a condition to see its mechanism. Read the Review, practice Flashcards, and complete Mastery before taking the topic quiz.

If port 5500 is busy, stop the other local server. Do not open `index.html` directly by double-clicking; the JavaScript modules need a local HTTP server.

## Upload to GitHub Pages

1. Open your GitHub repository and select **Add file → Upload files**.
2. Upload the **contents inside** the extracted folder. `index.html`, `app.mjs`, the other modules, and the `sources` folder must be at the repository root. Preserve the subfolders and relative filenames. The ZIP itself is not the website.
3. Commit the uploaded files to your `main` branch.
4. Go to **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select **main** and **/(root)**, and save.
5. Wait for GitHub Pages to finish publishing, then open the URL shown there.

For an existing Pages website, replace the old website files with these files and commit. Keep the existing branch/folder configuration if it already serves the repository root. GitHub Pages serves the HTML/CSS/JavaScript directly; it does not run `server.mjs`.

## What is included

- 32 lessons with detailed explanations, source-slide links, and clickable cause-and-effect maps. Select a step to see what happens and a memorization cue.
- **Heart and shock:** inspect chambers, valves, lung exchange, body circulation, coronary supply, and resistance-vessel tone. Follow the 12-step blood route, four valve/heart-sound phases, or five electrical-conduction steps. Compare seven circulation scenarios, compensatory responses, and qualitative vessel/volume changes. Optional direction animation respects reduced-motion settings. Existing cardiac-output and MAP calculators remain available.
- **Anemia:** explore kidneys/EPO, marrow, three blood-cell lines, red-cell shape, hemoglobin, vessels, tissue delivery, and cell removal. Compare seven patterns. Change Hb, saturation, and blood flow independently; the displayed formula calculates Hb-bound oxygen content and delivery with units. See why normal saturation can coexist with anemia.
- **Thyroid:** locate the gland in the neck, trace hypothalamus → pituitary → thyroid → body → negative feedback, and inspect the TSH receptor. Compare primary/central patterns and Graves antibody stimulation. Enlarge the gland separately from changing hormone function, and mark a treatment target.
- **Seizures:** inspect dendrites, cell body, axon, and synapse, then connect abnormal network activity to movement, sensation, awareness, and tone. Choose an event pattern and show focal-to-bilateral evolution. The brain and body diagrams stay still and do not flash. Existing event-phase and muscle-pattern schematics are also available.
- **HIV:** explore receptors, the cell membrane, RNA-to-DNA copying, nuclear integration, component production, assembly, and maturation inside a susceptible CD4 cell. Select a drug class to locate its target. Show an existing integrated template to understand why suppression does not eliminate all HIV. Compare the direction of effective combination ART.
- Every organ explorer includes normal-function and mechanism explanations, numbered manual steps, prediction reveals, linked references, and an **Inspect a part** selector. Keyboard users can Tab to a drawing structure and activate it with Enter or Space. Diagrams scroll horizontally on small screens. Exploration does not complete reviews, mastery checks, or quizzes.
- 192 memorization flashcards with direct prompts and precise answers. Flip to recall a fact, then mark Remembered or Forgot it; forgotten cards repeat. Supporting detail is optional.
- 640 relevant questions: 416 multiple choice (including 128 original patient cases), 96 short answer, 96 concept explanations, and 32 matching sets with three pairs each. Every response has supporting feedback or a model answer. Choose a fixed quiz type or a mixed round. Review unlocks each lesson's three-question mastery round; 3/3 completes mastery. All lessons in a topic unlock a quiz of up to 15 questions. At least 80% of complete questions unlocks the next topic (12/15 for a 15-question round). Matching-only topic rounds use the available lesson sets.
- **Situational cases:** select this quiz type in Practice, Topic quiz, or the exam builder. Four original patient cases per lesson cover symptoms, findings, labs, mechanisms, complications, and assessment. Patient presentations and findings appear separately. After submission, feedback shows the key clues and a specific explanation for every choice. Cases also appear in multiple-choice and mixed rounds.
- A failed topic quiz directs the learner to review and remaster missed lessons. Completing all five topics unlocks mixed exams of 10, 20, 30, or 50 questions. Matching-only exams offer at most 30 balanced sets. When too few fresh/due questions remain, choose a shorter exam or another format.
- Browser-local progress and unfinished attempts. Progress stays in that browser and website address; it does not sync between GitHub Pages, localhost, and other devices.
- The five original lesson slide PDFs in `sources/`.

Numerical formulas are shown explicitly. The oxygen model uses 1.34 × Hb (g/dL) × saturation as a fraction for Hb-bound content (mL O₂/dL), then content × flow (L/min) × 10 dL/L for delivery (mL O₂/min). It excludes dissolved oxygen and does not predict tissue extraction or patient symptoms. The controls are independent teaching assumptions. Qualitative diagrams are labeled as simplified teaching models: symbolic cells are not blood-smear measurements, muscle traces are not EEG recordings, and HIV treatment curves do not predict an individual's timeline. Content is for learning, not clinical prescribing.

## Adaptive practice and question rotation

Choose **Practice** to train on reviewed, mastered lessons, or choose a quiz type in **Topic quiz**. The default mixed format combines choices, short answers, explanations, and matching.

- Fresh questions come first. Question and concept history remain saved even when the visible attempt history gets shorter.
- After a wrong response, a different question can revisit the same concept after two intervening questions. If that fixed format has no alternate on the exact concept, it can use a different question from the same lesson. Topic quiz changes preserve lesson coverage; exams retain their prepared balance.
- The next round also focuses on missed concepts. A recently correct exact question is excluded until a spaced review is due.
- An unresolved incorrect question becomes eligible after three other answers. Spaced recall becomes eligible after 24 other answers or 24 hours. If no fresh or due question remains, the app suggests another type rather than silently repeating everything.
- Short answers check accepted phrases. Explanations check authored key-idea rubrics, then show recognized/missing ideas and a model explanation. These local checks do not evaluate every nuance of natural language, and are not a general-purpose AI or human essay grade. Compare unrecognized wording carefully with the model.
- Matching uses one answer per row, without duplicate matches. A whole set counts as one question; all three pairs must fit. Feedback shows each selected and expected pair.
- Written drafts save as you type. Pause and resume preserve them. Existing course and flashcard progress is preserved in the same browser and website address.

## Files to edit

| File | Purpose |
| --- | --- |
| `index.html` | Entry page and stylesheet links |
| `style.css` | Main website layout and theme |
| `app.mjs` | Screens, navigation, event handlers, and study flow |
| `engine.mjs` | Progress, gating, quiz scoring, and exam logic |
| `adaptive.mjs` | Question history, adaptive selection, answer checks, and review spacing |
| `question-bank.mjs` | Concept-packet schema and question assembly |
| `questions-shock.mjs`, `questions-anemia.mjs`, `questions-thyroid.mjs`, `questions-seizures.mjs`, `questions-hiv.mjs` | Authored new questions, accepted phrases, explanation rubrics, and models |
| `case-bank.mjs` | Patient-case schema and stable lesson/concept mapping |
| `cases-shock.mjs`, `cases-anemia.mjs`, `cases-thyroid.mjs`, `cases-seizures.mjs`, `cases-hiv.mjs` | 128 original situational questions, findings, key clues, and choice-specific rationales |
| `concept-tags.mjs` | Links existing questions to the new concepts |
| `quiz-ui.mjs`, `quizzes.css` | Quiz format controls, written inputs, matching, and feedback |
| `data.mjs` and `course.mjs` | Course assembly and shock lessons |
| `anemia.mjs`, `thyroid.mjs`, `seizures.mjs`, `hiv.mjs` | Topic lessons and questions |
| `flashcards.mjs` | Memorization prompts, answers, and supporting detail |
| `visual-models.mjs` | Calculator formulas, simplified model states, and control limits |
| `visual-notes.mjs` | Explanations and memory cues for each lesson map |
| `visuals.mjs` | Interactive diagram, control, and map rendering |
| `visuals.css` | Existing Visual Lab comparison/map styling |
| `organ-explorer.mjs` | Anatomy controls, step navigation, inspectors, and prediction reveals |
| `organ-content.mjs` | Structure functions, process steps, mechanisms, and references |
| `organ-models.mjs` | Organ state limits, valve phases, oxygen formulas, and network extent |
| `organ-ui.mjs` | Accessible SVG hotspots and shared interface helpers |
| `organ-heart.mjs`, `organ-blood.mjs`, `organ-thyroid.mjs`, `organ-brain.mjs`, `organ-immune.mjs` | Original code-native organ drawings and topic explanations |
| `organs.css` | Anatomy layouts, selected parts, keyboard focus, and optional flow motion |
| `server.mjs` | Local development server |
| `tests/` | Course, formula, state, and UI interaction checks |

Add patient cases with `S(...)` in the appropriate `cases-*.mjs` file. Use a unique case ID and an existing concept slug from the same lesson in `questions-*.mjs`. Keep patient findings consistent with the intended answer, author all three distractor explanations, and preserve existing IDs so learner history remains valid.

When adding a lesson, give it a unique ID and keep its questions, flashcards, flow steps, and visual notes aligned with that lesson. Use its own topic's content for questions.

## Verify changes

Run `npm test` from this folder. The checks cover course completeness, mastery/quiz gates, scoring, remediation, formulas, all 32 lesson maps, the actual UI event handlers, and imported assets. Adaptive checks also cover all 640 questions, written-answer boundaries, matching, preserved quiz coverage, saved drafts, old-progress migration, and fresh/due rotation. Test output goes into `test-output/`; it is not required for hosting. Case checks also cover all 128 distinct scenarios, topic/lesson relevance, case-only filtering, fresh adaptive follow-ups, repeat avoidance, saved preferences, and exam feedback timing. Organ checks cover 391 explorer states, circulation order, valve timing, oxygen units and proportional changes, thyroid signal/size independence, focal spread, HIV targets/reservoirs, and unique accessible control IDs. UI checks include SVG keyboard activation and live sliders that retain the active controls. Ten code-native SVG examples were rendered and visually inspected. Native browser layout preview was unavailable in this environment; check the responsive website in your browser when editing styles.
