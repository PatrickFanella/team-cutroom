# Contributing to Cutroom

Thanks for your interest in contributing to Cutroom! This document covers how to get started.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Git

### Setup

```bash
# Clone the repo
git clone https://github.com/openwork-hackathon/team-cutroom.git
cd team-cutroom

# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env.local
# Edit .env.local with your API keys

# Push database schema
pnpm db:push

# Run dev server
pnpm dev
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run with coverage
pnpm test:coverage

# Type check
pnpm typecheck

# Lint
pnpm lint
```

## Project Structure

```
cutroom/
├── src/
│   ├── app/              # Next.js app router
│   │   ├── api/          # API routes
│   │   └── pipelines/    # Pipeline pages
│   ├── components/       # React components
│   │   ├── ui/           # Base UI components
│   │   └── pipeline/     # Pipeline-specific components
│   └── lib/
│       ├── api/          # API client hooks
│       ├── db/           # Prisma client
│       ├── pipeline/     # Pipeline state machine
│       ├── stages/       # Stage handlers
│       └── token/        # Token integration
├── remotion/             # Video composition
├── scripts/              # CLI scripts
├── prisma/               # Database schema
├── docs/                 # Documentation
└── public/               # Static assets
```

## Development Workflow

### Branch Naming

Use descriptive branch names:

```
feat/your-name/feature-description
fix/your-name/bug-description
docs/your-name/what-changed
```

### Commit Messages

Follow conventional commits:

```
feat: add new stage handler for research
fix: handle empty script sections
docs: update API documentation
chore: update dependencies
test: add tests for publish stage
```

### Pull Requests

1. Create a feature branch from `main`
2. Make your changes
3. Ensure tests pass: `pnpm test`
4. Ensure types check: `pnpm typecheck`
5. Push and open a PR
6. Tag relevant reviewers

### PR Template

```markdown
## What

Brief description of changes.

## Why

Why this change is needed.

## How

How it was implemented (if non-obvious).

## Testing

How to test the changes.

## Checklist

- [ ] Tests pass
- [ ] Types check
- [ ] Documentation updated (if needed)
```

## Adding a New Stage

1. Create the stage handler in `src/lib/stages/`:

```typescript
// src/lib/stages/newstage.ts
import { StageHandler, StageContext, StageResult } from './types'

export const newStage: StageHandler = {
  name: 'NEWSTAGE',
  
  validate(input: unknown) {
    // Validate input
    return { valid: true }
  },
  
  async execute(context: StageContext): Promise<StageResult> {
    // Implement stage logic
    return {
      success: true,
      output: { /* stage output */ },
    }
  },
}
```

2. Register in `src/lib/stages/index.ts`:

```typescript
import { newStage } from './newstage'

export const STAGE_HANDLERS: Record<StageName, StageHandler> = {
  // ...existing stages
  NEWSTAGE: newStage,
}
```

3. Add tests in `src/lib/stages/newstage.test.ts`

4. Update Prisma schema if needed (`prisma/schema.prisma`)

5. Update stage types in `src/lib/stages/types.ts`

## Code Style

- Use TypeScript for all new code
- Use functional components for React
- Use Zod for runtime validation
- Prefer `async/await` over callbacks
- Add JSDoc comments for public APIs
- Keep files focused and under 300 lines

## Testing Guidelines

- Write tests for all new features
- Test both success and error cases
- Mock external APIs
- Use descriptive test names

```typescript
describe('StageHandler', () => {
  describe('validate', () => {
    it('accepts valid input', () => { ... })
    it('rejects missing required fields', () => { ... })
  })
  
  describe('execute', () => {
    it('returns success with correct output', async () => { ... })
    it('handles API errors gracefully', async () => { ... })
  })
})
```

## Need Help?

- Check existing issues for similar problems
- Open a new issue with reproduction steps
- Ask in the team Discord

## License

By contributing, you agree that your contributions will be licensed under the project's license.
