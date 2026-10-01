# 🎟️ TicketFixture - Ticket Affiliate Partnership Master Guide

This guide provides step-by-step instructions on how to create accounts, pass partner approval, generate tracking links, and integrate the top 2 ticket affiliate networks directly into **TicketFixture**.

---

## 🏆 Partnership Overview & Revenue Model

| Partner | Priority | Network | Commission Rate | Best For | Typical Payout / Order |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **StubHub International / Viagogo** | **Primary 🥇** | **Awin** (or Direct) | **5% – 8%** | Sold-Out European Football (Premier League, El Clásico, UCL) | **€30 – €95+** |
| **SeatGeek** | **Secondary 🥈** | **Impact.com** | **5% – 10%** | US & Overseas Sports Tourists, Interactive Seating Maps | **$25 – $80+** |

---

## 1. StubHub International / Viagogo Partner Program (Primary Choice 🥇)

StubHub International and Viagogo operate under the same corporate marketplace ecosystem outside North America. They are the world's largest secondary ticket exchange for European football (Premier League, La Liga, Serie A, Champions League).

### Step 1: Create an Account on Awin (Official Network)
1. Go to **[https://www.awin.com](https://www.awin.com)**.
2. Click **Sign Up** as a **Publisher** (Content Creator / Affiliate).
3. Fill in your account details:
   * **Account Type**: Publisher / Content Creator
   * **Company / Website Name**: TicketFixture
   * **Website URL**: `https://ticketfixture.com` (or your staging/live domain)
   * **Primary Region**: United Kingdom / United States / Global
   * **Sectors**: *Shopping > Tickets & Events* and *Sports & Recreation*.

> [!NOTE]
> Awin charges a nominal $5 / £5 verification deposit during signup to prevent spam, which is refunded directly into your first commission payout.

---

### Step 2: Exact Copy-Paste Application Description for Instant Approval
When Awin or StubHub asks to describe your promotional method and website, copy and paste this text:

```text
TicketFixture (https://ticketfixture.com) is an event fixture schedule and sports ticket price comparison platform. We cater to international football fans, expats, and sports tourists traveling to the UK and Europe who are looking to secure authentic, verified match tickets for sold-out derbies (Premier League, El Clásico, and UEFA Champions League).

We provide stadium seating breakdowns, fixture dates, legal broadcast information, and price comparison across accredited secondary marketplaces with 100% money-back guarantees. We promote verified ticket partners via contextual match guides, organic search SEO, and direct event comparison engines.
```

---

### Step 3: Apply to StubHub International & Viagogo on Awin
1. Once your Awin publisher account is active, log into the **Awin Dashboard**.
2. Navigate to **Advertisers** → **Join Programmes**.
3. Search for:
   * **StubHub International** (Advertiser ID: `7029`)
   * **Viagogo Global** (Search "Viagogo" in the directory)
4. Click **Apply to Programme** and check the terms box.
5. In the note, paste the description from Step 2.
6. Approval is typically processed within **24 to 72 business hours**.

*(Alternative direct portal: You can also register directly at [https://partner.stubhubinternational.com](https://partner.stubhubinternational.com) or [https://www.viagogo.com/affiliates](https://www.viagogo.com/affiliates)).*

---

### Step 4: Generate Your Tracking Link
1. Once approved in Awin, go to **Toolbox** → **Link Builder**.
2. Select **StubHub International** as the advertiser.
3. In the destination URL, you can enter the homepage (`https://www.stubhub.ie` or `https://www.stubhub.co.uk`) or deep-link to a specific team search (e.g., `https://www.stubhub.co.uk/arsenal-tickets/`).
4. Click **Generate Link**.
5. Your link will look like:
   `https://www.awin1.com/cread.php?awinmid=7029&awinaffid=YOUR_PUBLISHER_ID&clickref=ticketfixture&ued=https%3A%2F%2Fwww.stubhub.co.uk%2F`

---

## 2. SeatGeek Affiliate Program (Secondary Choice 🥈)

SeatGeek is the most recognized secondary ticketing technology platform in the world, with high brand trust and an intuitive seating chart interface favored by international travelers.

### Step 1: Create an Account on Impact.com
1. Go to **[https://impact.com](https://impact.com)**.
2. Click **Sign Up** → **As a Partner / Media Partner / Creator**.
3. Select your media type as **Website / Media Publisher**.
4. Enter your property details:
   * **Property Name**: TicketFixture
   * **URL**: `https://ticketfixture.com`
   * **Primary Audience**: Sports Fans, Event Attendees, Ticket Buyers.

---

### Step 2: Apply to SeatGeek on Impact
1. Once inside your Impact dashboard, go to **Brands** → **Find Brands**.
2. Search for **SeatGeek**.
3. Review their terms (typically 5% – 10% per sale, 30-day cookie window).
4. Click **Apply**.
5. When prompted for details, paste the application description provided in Step 2 of the StubHub section above.
6. SeatGeek’s affiliate management team typically approves within **2 to 4 business days**.

---

### Step 3: Generate Your SeatGeek Tracking Link
1. In Impact, open **SeatGeek** under your active partnerships.
2. Use the **Create a Link** tool in the sidebar.
3. Create your general affiliate link or deep-link to European football searches (e.g., `https://seatgeek.com/search?search=Real+Madrid`).
4. Your tracking link will look like:
   `https://seatgeek.sjv.io/c/YOUR_ID/YOUR_CAMPAIGN/seatgeek`

---

## 3. How to Connect Your Affiliate Links to TicketFixture

Once you receive your affiliate tracking links, follow these two simple steps in your TicketFixture Admin Panel:

### A. Update Global Cloaked Hop Links (Instant Site-Wide Update)
TicketFixture automatically protects your SEO and hides raw affiliate URLs using cloaked redirect hops (`/go/stubhub`, `/go/seatgeek`, `/go/viagogo`):

1. Open your browser and go to your Admin Panel:
   **`http://localhost:3000/admin/affiliates`**
2. Locate the cards for **SeatGeek** and **StubHub / Viagogo**.
3. Paste your approved destination affiliate link into the **Destination Affiliate Referral Link** input box.
4. Click anywhere outside the box or press Tab — it automatically saves to MySQL!
5. Now, whenever any user clicks `/go/seatgeek` or `/go/stubhub` on your site, they are automatically forwarded through your tracking link with `noindex, nofollow` HTTP headers.

---

### B. Set Match-Specific Deep Links (Maximum Conversion Rate)
Deep linking directly to the specific match page yields a **300% higher conversion rate** than sending buyers to a generic homepage:

1. Go to **`http://localhost:3000/admin/tickets`** in your Admin Panel.
2. Click **Edit** (pencil icon) next to any match fixture (e.g. *Arsenal vs Chelsea* or *Real Madrid vs Barcelona*).
3. Under **Secondary Marketplaces & Affiliate URLs**:
   * Paste your SeatGeek match search link into **SeatGeek Affiliate URL**.
   * Paste your StubHub match search link into **StubHub Affiliate URL**.
   * Update the live starting prices (e.g., SeatGeek: £135, StubHub: £89).
4. Click **Save Fixture**.
5. Your public match page at `/match/[slug]` and comparison table will immediately reflect the new prices and direct all buyer clicks through your affiliate partner!

---

## 4. Pro-Tips for Getting Approved on First Try

1. **Keep Your Site Live and Clean**: Before applying, make sure your website is running with active fixtures and clean ticket comparison tables. Having visible content proves to affiliate managers that you are a legitimate publisher.
2. **Emphasize International Sports Tourism**: Highlight that you target overseas fans traveling to the UK/Europe. Advertisers love international buyers because their cart values are much higher (€500+).
3. **Never Mention Scrapes or Bots**: Always state that you provide editorial reviews, stadium guides, and curated price comparisons with verified buyer guarantees.
4. **Disclose Affiliate Relationships**: TicketFixture already includes compliant buyer guarantee and partner notices in the footer, satisfying FTC and ASA affiliate disclosure rules.

