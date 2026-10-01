# TicketFixture

> High-Demand European Football & Sports Matchday Ticket Aggregator powered by Next.js 16 (App Router), Prisma ORM (MySQL), Google Gemini AI, and Tailwind CSS v4.

## Overview

**TicketFixture** (https://ticketfixture.com) is a high-performance sports ticket price comparison aggregator designed to help international fans and sports tourists compare verified matchday tickets across accredited secondary exchanges like **SeatGeek**, **StubHub**, and **Viagogo** with 100% money-back buyer guarantees.

The platform specializes in high-margin, sold-out European football blockbusters (Premier League derbies, El Clásico, and UEFA Champions League) as well as major global cricket fixtures.

## Key Features

- **Dynamic Ticket Comparison Engine**: Live price comparison across SeatGeek, StubHub, and Viagogo with automated "Best Value" and "100% Buyer Guarantee" badges.
- **Dedicated Match Tickets Admin Hub** (`/admin/tickets`): Dynamically add new fixtures, set live secondary marketplace prices, update direct affiliate deep-links, and toggle availability.
- **Stadium Seating Breakdown**: Category 1 (Longside / Sideline), Category 2 (Upper Tier), Category 3 (Behind Goal), and VIP Club hospitality tier guides for marquee stadiums (Emirates, Bernabéu, Etihad, etc.).
- **Cloaked Affiliate Redirection Router** (`/go/[partner]`): SEO-safe outbound tracking links protected with `noindex, nofollow` headers to safeguard search engine rankings.
- **Autonomous AI Editorial Studio**: Powered by Google Gemini to publish match previews, lineups, and stadium tourist guides.
- **Admin Management Portal**: Role-based access control (Admin & Super Admin), keyword SERP rank tracking, and instant IndexNow search engine syndication.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack, React 19)
- **Database & ORM**: MySQL via Prisma ORM
- **AI Engine**: Google GenAI SDK (`@google/genai`)
- **Styling**: Tailwind CSS v4
- **Security**: Isomorphic DOMPurify & Security Headers
- **Authentication**: NextAuth.js v4

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables** in `.env`:
   ```env
   DATABASE_URL="mysql://root:@localhost:3306/hypefixture"
   NEXTAUTH_SECRET="ticketfixture_secure_nextauth_secret_key_2026"
   NEXTAUTH_URL="http://localhost:3000"
   GEMINI_API_KEY="your-google-gemini-api-key"
   ```

3. **Database Setup**:
   ```bash
   npx prisma db push
   npx tsx prisma/seed.ts
   ```

4. **Run Application**:
   ```bash
   # Development
   npm run dev

   # Production Build
   npm run build
   npm run start
   ```

## Affiliate Documentation

For complete directions on getting approved with **StubHub International / Viagogo** (via Awin) and **SeatGeek** (via Impact), refer to the [Affiliate Partner Master Guide](affiliate_partner.md).
