# Vermbar2

Temporary design-testing repository for the Vermittelbar production application. Used for iterating on design language and UI components with an agent-driven workflow, then porting finalized designs back to the production codebase.

## Workflow

When the user approves a change ("I like it", "looks good", etc.), immediately:
1. Create a new branch off `main`
2. Commit the changes
3. Create a GitHub PR targeting `main`
4. Merge the PR
5. Switch back to `main` and pull

This keeps a clean history in GitHub of each design iteration.

## Conventions

- Component files use **kebab-case** (e.g., `coach-app.tsx`, `participant-detail.tsx`)
- React component names use PascalCase as usual

## Routes

- `/` and `/jobs` — Job seeker landing page (`job-seeker-landing.tsx`)
- `/app` — Coach app dashboard (`coach-app.tsx`)
- `/app/teilnehmer` — Participant overview with list/bubble toggle (`participant-overview.tsx`)
- `/app/teilnehmer/:id` — Participant detail (`participant-detail.tsx`)
- `/app/gruppen` — Group overview (`group-overview.tsx`)
- `/app/gruppen/:id` — Group detail (`group-detail.tsx`)
- `/me/:id` — Participant self-view (design testing; production will be `/me` with session) (`participant-me.tsx`)
