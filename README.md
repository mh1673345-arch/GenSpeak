# GenSpeak

The dictionary for how the internet talks. Slang, meme formats, AI vocabulary,
gaming language, forum history and platform culture, defined the way a
dictionary defines anything else: with an origin, a register, and evidence of
use.

## What is in it

- **579 entries** across 16 categories, each with a formal definition, an
  "explain like I am 10" rewrite, a real etymology, usage examples, related
  terms, tags and a usage index. Every cross-reference resolves.
- **Eight eras** of internet history at `/history`, from Usenet and dial-up
  boards to the model era, with a coinage-per-year chart built from the corpus.
- **Eleven culture scenes** at `/culture` covering the communities that
  actually produced this vocabulary, and what each one contributed.
- **A daily quiz** at `/quiz` — ten definitions, four choices each, distractors
  drawn from the same category so subject matter does not give it away.
- **Command palette search** (`Ctrl/Cmd + K`, or `/`) backed by a ranked API.
  Exact and prefix matches on the headword outrank text buried in a definition,
  with single-edit tolerance so "brianrot" still finds brainrot.
- **Browsable index** at `/dictionary` with live filtering, category chips, A-Z
  jumps, five sort orders and paging.
- **221 tag pages** cutting across categories, a trending board ranked by
  30-day change, submissions validated with Zod, and per-entry `DefinedTerm`
  structured data plus a generated sitemap, robots file, favicon and OG image.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

```bash
npm run build   # production build (~850 prerendered pages)
npm run lint    # eslint
```

## Project layout

```
src/
  app/
    page.tsx                 home
    dictionary/              browsable A-Z index
    term/[slug]/             entry pages (prerendered)
    category/[slug]/         16 category pages
    culture/[slug]/          11 culture scenes
    tag/[tag]/               cross-cutting tag pages
    history/  trending/  quiz/  about/  submit/  random/
    api/search/  api/submit/ route handlers
    icon.tsx  opengraph-image.tsx  sitemap.ts  robots.ts
  components/                UI, search palette, quiz, header/footer
  content/
    categories.ts            the 16 categories
    types.ts                 Term, RawTerm and the expander
    terms/                   the dictionary, one file per category
    eras.ts                  internet history timeline
    scenes.ts                culture deep-dives
  lib/
    dictionary.ts            query layer over the content
    quiz.ts                  question builder
    submissions.ts           submission validation + review queue
```

### Adding a term

Entries are authored in a compact form in `src/content/terms/<category>.ts`:

```ts
{
  slug: "rizz", term: "Rizz", pron: "riz", pos: "noun", cat: "slang",
  year: 2021, pop: 92, trend: -6, status: "mainstream",
  def: "Charisma applied specifically to romantic situations...",
  eli: "Being really good at talking to someone you like...",
  org: "Coined by streamer Kai Cenat and his circle around 2021...",
  ex: ["He has unspoken rizz.", "I tried to rizz her up and forgot how sentences work."],
  rel: ["ick", "situationship", "aura"], tags: ["dating", "charisma", "twitch"],
},
```

Append one object and every page, the search index, the quiz, the tag pages,
the history chart, the sitemap and the stats pick it up automatically. The
short keys are expanded to the full `Term` shape by `expandTerm` in
`src/content/types.ts`, so components are unaffected.

Related terms are auto-supplemented: where an entry declares fewer than four
resolvable relations, the query layer fills the rest from same-category entries
by tag overlap, so every entry has a useful "see also".

### Data layer

All reads go through [`src/lib/dictionary.ts`](src/lib/dictionary.ts), so moving
the content into Postgres later means changing that one module rather than the
pages. Prisma is installed and configured against `DATABASE_URL` but is not yet
wired into the app.

Submissions are appended to `.data/submissions.jsonl`. On read-only hosts the
write fails harmlessly and the submission is logged instead; swap
`saveSubmission` for a database insert when a persistent store exists.

## Tech

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, next-themes,
lucide-react, Zod.
