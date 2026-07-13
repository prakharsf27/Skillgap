# Skillgap — AI-Powered Job Readiness & Skill Gap Analysis Platform

An interactive SaaS application designed to help software engineer candidates measure their readiness for target tracks (frontend, backend, fullstack, AI/ML), parse and evaluate their resume (ATS score), conduct AI-simulated project interviews, run DSA tests, and close their skill gaps.

## Tech Stack
* **Framework**: Next.js 16 (App Router)
* **Styling**: Tailwind CSS & Framer Motion (for premium UI/UX/micro-animations)
* **AI/LLM**: Google Gemini API (`gemini-2.0-flash`) & Groq SDK (`llama-3.3-70b-versatile`)
* **Database & ORM**: Prisma ORM with SQLite (development) and PostgreSQL (production)

---

## Getting Started

### 1. Configure Environment Variables
Create a `.env.local` file in the root directory and define the following variables:
```bash
# AI Provider Keys
GEMINI_API_KEY="your-gemini-api-key"
GROQ_API_KEY="your-groq-api-key"

# Authentication Session Secret
JWT_SECRET="generate-a-secure-random-key"

# Database Connection (Optional in development - defaults to SQLite dev.db)
# DATABASE_URL="postgresql://user:password@host:port/dbname"
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Initialize the Database (Prisma)
To create the local SQLite database and generate the Prisma Client, run:
```bash
npx prisma db push
```

### 4. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Production Deployment Guide (Vercel + Cloud Database)

To deploy this platform in a production-ready cloud environment:

### 1. Provision a Cloud PostgreSQL Database
Serverless environments (like Vercel) use a read-only ephemeral filesystem, meaning the SQLite `dev.db` file will reset on every server invocation. You must connect a cloud database (e.g. **Supabase**, **Neon**, or **Vercel Postgres**).

### 2. Configure Prisma for PostgreSQL
Update the datasource provider in `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 3. Deploy to Vercel
1. Install the Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project root folder.
3. Configure the environment variables in the Vercel Dashboard:
   * `GEMINI_API_KEY`
   * `GROQ_API_KEY`
   * `JWT_SECRET`
   * `DATABASE_URL` (from Neon/Supabase)
4. Trigger the deploy build. Vercel will automatically run the Next.js production build compiler.
