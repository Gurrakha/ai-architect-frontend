# AI Architect — Frontend

Next.js 15 (App Router) + TypeScript + Tailwind + shadcn-style components +
TanStack Query + React Flow, wired directly to the `openapi.json` contract
provided for the AI Architect backend.

## Live Project
Live Application:
 https://ai-architect-frontend.vercel.app/

Backend API Documentation:
 https://ai-architect-backend-0wnf.onrender.com/docs

---

## Setup

```bash
npm install
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_BASE_URL
npm run dev
```

This was written without the ability to `npm install` / build in the sandbox
it was authored in (no network access), so dependency versions in
`package.json` haven't been build-verified — check `npm install` output and
adjust pins if anything's out of date.

## How it's organized

- `lib/api/` — one module per backend resource (`projects`, `requirements`,
  `prd`, `architecture`, `database-design`, `api-design`, `roadmap`,
  `generations`), each calling the exact paths/methods/bodies in
  `openapi.json`. No invented endpoints or fields.
- `lib/api/types.ts` — TypeScript types transcribed from
  `components.schemas` in `openapi.json`.
- `lib/hooks/` — TanStack Query hooks around the API modules, plus the SSE
  hook (`use-generation-events.ts`).
- `lib/pipeline-stages.ts` — derives a per-stage pipeline view (pending /
  running / completed / waiting-for-input / failed) from real backend data.
- `lib/graph-layout.ts` — a small BFS layered layout for the two React Flow
  diagrams (architecture, database design), since neither response carries
  node coordinates and pulling in a layout library (e.g. dagre) wasn't
  necessary for graphs this size.
- `components/ui/` — shadcn-style primitives (button, card, dialog, tabs,
  etc.), hand-written to match shadcn conventions since the CLI couldn't be
  run in this sandbox.
- `components/artifacts/` — one document-style view per artifact, plus the
  two React Flow diagrams.
- `components/generation/` — the pipeline stepper, the clarification Q&A
  panel, and the "start generation" dialog.
- `app/projects/[projectId]/` — project workspace: overview, generation
  progress page, and one route per artifact.

## Known backend limitations

These aren't frontend shortcuts — they're gaps/quirks in the provided
backend contract that the frontend had to design around. Worth knowing
before shipping this:

1. **No `GET /projects/` (list).** `GET /projects/{id}` now exists and is
   used everywhere for real project data, but there's still no way to
   enumerate all projects. The dashboard's project list is backed by a
   small client-side registry (`lib/hooks/use-local-projects.ts`,
   localStorage) populated as projects are created/visited *in this
   browser* — it will not show projects created elsewhere or survive
   cleared storage. If a real list endpoint is added, swap this out for a
   direct query in `app/page.tsx`.

2. **SSE reports per artifact status - completed/running/failed**.

3. **Clarification answers are submitted all at once**.

4. **`GenerationCreate.workflow` has no declared enum.** `openapi.json` exposes `workflow` as a free-form string, while the current backend runs the same full generation pipeline regardless of the workflow value. The frontend therefore keeps the workflow field editable, with `full_pipeline` as the default. The Gemini model is no longer selected by the frontend; the backend uses its server-side `GEMINI_MODEL` configuration.

5. **`getLatestOrNull` treats any 404 from a `.../latest` endpoint as "not
   generated yet."** The 404 response isn't documented in `openapi.json`
   for those routes (only 200 and 422 are), so this is an assumption about
   how the backend behaves before an artifact exists — verify against the
   real backend and adjust `lib/api/client.ts` if it responds differently
   (e.g. 200 with a null body).
