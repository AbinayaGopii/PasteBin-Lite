# PasteBin-Lite

PasteBin-Lite is a lightweight Pastebin-style web application built with Next.js.
It allows users to create text pastes and share a URL to view them. Pastes can
optionally expire based on time (TTL) or view count.


---

## Features

- Create and share text pastes
- Time-to-live (TTL) expiration
- Maximum view count
- Shareable URLs
- Storage using a database

---

## Tech Stack

- **Framework**: Next.js 
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Runtime**: Node.js

---

## API Endpoints

### Health Check

**GET** `/api/healthz`

- Returns HTTP 200
- Returns JSON
- Confirms the application can access its persistence layer
---

### Create Paste

**POST** `/api/pastes`

**Request Body:**
```json
{
  "content": "string (required)",
  "ttl_seconds": "number (optional, >= 1)",
  "max_views": "number (optional, >= 1)"
}
```

**Response:**
- HTTP 201
- Returns `{ "id": "uuid", "url": "string" }`

---

### Get Paste

**GET** `/api/pastes/[id]`

**Response:**
- HTTP 200
- Returns `{ "content": "string", "remaining_views": "number | null", "expires_at": "Date | null" }`
- HTTP 404 if paste unavailable, expired, or max views reached

---

## View Paste (HTML)

**GET** /p/:id

- Returns an HTML page (HTTP 200) containing the paste content

- Paste content is rendered safely (no script execution)

- HTML page views do not decrement the view count

- Returns HTTP 404 if the paste is unavailable

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
## Live Demo
NEXT_PUBLIC_APP_URL="https://paste-bin-lite-ruddy.vercel.app"
```

3. Run database migrations:
```bash
npx prisma migrate dev
npx prisma generate
```

4. Start development server:
```bash
npm run dev
```

---

## Database Schema

**Paste Model:**
- `id` - UUID (primary key)
- `content` - String
- `createdAt` - DateTime
- `expiresAt` - DateTime? (expiration)
- `maxViews` - Int? (max view count)
- `viewCount` - Int (default: 0)
