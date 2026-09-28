# HypeFixture

> Automated High-CTR Sports SEO & Affiliate Marketing Platform powered by Next.js 16 (App Router), Google Gemini 3.8 Flash, Prisma ORM (MySQL), and Tailwind CSS v4.

## Overview

HypeFixture is a high-performance sports media and affiliate aggregation platform designed to capture high-intent search traffic ("how to watch", "live stream channels", "match predictions", "lineups") across Football (Soccer), NFL, NBA, UFC, and Boxing.

## Key Features

- **Autonomous Matchday Cluster Generation**: Google Gemini 3.8 Flash creates keyword-optimized match previews, "where to watch" broadcast guides, and predicted lineups.
- **Admin Management Portal**: Dedicated `/admin/dashboard` featuring live AI telemetry monitoring, affiliate partner management, SERP keyword tracking, and role-based access control.
- **In-Admin Article Editor**: Rich markdown/HTML editor with automated DOMPurify sanitization against XSS injections, H2/H3 formatting, affiliate CTA insertions, and live preview.
- **Strict Role Isolation**: Separated authentication flows for regular users and administrators.
- **High-CTR Affiliate Engine**: Cloaked redirects (`/go/[partner]`) tracking click-through rates and geo-targeted streaming partners.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack, React 19)
- **Database & ORM**: MySQL via Prisma ORM
- **AI Engine**: Google GenAI SDK (`gemini-3.8-flash`)
- **Styling**: Tailwind CSS v4
- **Security**: Isomorphic DOMPurify & Content Security Headers
- **Authentication**: NextAuth.js v4

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables** in `.env`:
   ```env
   DATABASE_URL="mysql://root:@127.0.0.1:3306/hypefixture"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   GEMINI_API_KEY="your-google-gemini-api-key"
   ```

3. **Database Setup**:
   ```bash
   npx prisma db push
   npm run seed
   ```

4. **Run Application**:
   ```bash
   # Development
   npm run dev

   # Production Build
   npm run build
   npm run start
   ```
