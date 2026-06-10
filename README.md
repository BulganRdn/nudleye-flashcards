# Nudleye

Nudleye is a Next.js flashcard learning application built around the loop: see, remember, review.

## Stack

- Next.js 15 App Router
- React 19 and TypeScript
- Prisma ORM
- PostgreSQL in production
- NextAuth
- Tailwind CSS 4
- TanStack Query, Radix UI, and Framer Motion

## Local setup

Install dependencies:

```bash
pnpm install
```

Copy `.env.example` to `.env` and add PostgreSQL and authentication values. Then initialize the database:

```bash
pnpm db:migrate:deploy
pnpm dev
```

## Vercel and Neon deployment

Create a Neon project in the Singapore region when available. Add these variables to Vercel:

```text
DATABASE_URL
DATABASE_URL_UNPOOLED
NEXTAUTH_SECRET
NEXTAUTH_URL
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```

Use Neon's pooled connection for `DATABASE_URL` and direct connection for `DATABASE_URL_UNPOOLED`. Set `NEXTAUTH_URL` to the final HTTPS deployment URL. Google variables are optional.

Vercel runs `pnpm vercel-build`, which generates Prisma Client, applies pending migrations, and builds Next.js.

## Demo content

To replace all existing decks with ten shared Korean vocabulary decks assigned across registered users:

```bash
pnpm db:seed:korean
```

This command permanently deletes existing decks, cards, and deck progress before inserting the demo content.

## Verification

```bash
pnpm build
```
