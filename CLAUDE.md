# Iran Crisis

Interactive visualization of the Iran crisis propagation — timeline, map, and event tracking.

## Workflow

When the user approves a change ("I like it", "looks good", etc.), immediately:
1. Create a new branch off `main`
2. Commit the changes
3. Create a GitHub PR targeting `main`
4. Merge the PR
5. Switch back to `main` and pull

This keeps a clean history in GitHub of each design iteration.

## Conventions

- Component files use **kebab-case** (e.g., `crisis-map.tsx`)
- React component names use PascalCase as usual

## Routes

- `/` — Crisis propagation map (`crisis-map.tsx`)
