# Music Catalog Insights Platform

A full-stack, enterprise-grade application for music catalog discovery, personal library management, analytics, and AI-powered trend summaries built with Java 21, Spring Boot 3, PostgreSQL, React (Vite + TypeScript), Tailwind CSS, and Recharts.

---

## Entity Focus and Justification

### Entity Choice: Albums

**Selected Entity Focus**: Albums (`collectionId` / `entity=album` in iTunes Catalog)

### Justification

1. **Rich Macro Metadata**: Albums provide cohesive metadata including release dates, primary genre classifications, track counts, pricing, and high-resolution artwork.
2. **Superior Analytics Foundation**: Aggregating albums allows meaningful visual charts such as genre distribution, release year timelines, rating distributions, and track count spreads. Individual songs produce fragmented metadata, while artist objects lack granular release year and track count attributes.
3. **Structured Personal Collections**: Collecting albums mirrors physical vinyl and CD library curation, providing a natural user workflow for searching, bookmarking, rating, and annotating music collections.

---

## Database Choice and Architectural Justification

### Database Selected: PostgreSQL (Relational SQL)

### Justification: SQL vs NoSQL

1. **Relational Integrity**: The domain model has a clear relational structure where a `User` owns 0 to N `SavedAlbum` records. SQL relational schemas enforce strict foreign key constraints and cascade rules.
2. **Unique Composite Indexing**: A database-level unique constraint on `(user_id, apple_catalog_id)` guarantees that a user cannot save duplicate copies of the same album, avoiding race conditions in concurrent requests.
3. **Native Aggregation Power**: SQL excels at analytical aggregations (`GROUP BY genre`, `AVG(user_rating)`, `COUNT(*)`), allowing the backend to compute analytics metrics efficiently via optimized database queries.
4. **ACID Transactions**: Guarantee transactional integrity when updating user ratings and notes, ensuring zero partial writes or inconsistent states.

---

## Database Schema Specification

The `saved_albums` table stores saved catalog items for each user.

| Field Name | Database Column | Data Type | Constraints / Details |
| :--- | :--- | :--- | :--- |
| `id` | `id` | `BIGSERIAL` | Primary Key, Auto-increment |
| `user` | `user_id` | `BIGINT` | Foreign Key to `users(id)`, NOT NULL |
| `apple_catalog_id` | `apple_catalog_id` | `BIGINT` | Catalog ID from iTunes API, NOT NULL |
| `title` | `title` | `VARCHAR(255)` | Album title, NOT NULL |
| `artist_name` | `artist_name` | `VARCHAR(255)` | Artist name, NOT NULL |
| `genre` | `genre` | `VARCHAR(100)` | Primary music genre, NOT NULL |
| `release_date` | `release_date` | `DATE` | Official release date |
| `track_count` | `track_count` | `INTEGER` | Total number of tracks, NOT NULL |
| `artwork_url` | `artwork_url` | `VARCHAR(500)` | High-res album cover image URL |
| `user_rating` | `user_rating` | `INTEGER` | User rating (1 to 5 stars), Nullable |
| `user_notes` | `user_notes` | `VARCHAR(1000)` | User personal notes/review, Nullable |
| `created_at` | `created_at` | `TIMESTAMP` | Record creation timestamp, NOT NULL |
| `updated_at` | `updated_at` | `TIMESTAMP` | Record update timestamp, NOT NULL |

---

## Architecture and Technology Stack

- **Backend**: Java 21, Spring Boot 3.3+, Spring Security (Stateless JWT), Spring Data JPA, Spring Web / RestClient
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide React Icons, Recharts
- **Database**: PostgreSQL 16
- **External Integration**: iTunes Search API (`https://itunes.apple.com/search`)
- **Live Audio Streaming Integration**: JioSaavn API for 320kbps MP3 tracks and Vinyl Turntable player integration
- **AI Engine**: LLM Trend Summary Engine (Groq / OpenAI API integration with structured local fallback engine)
- **Deployment Target**: Render (Backend + PostgreSQL DB) & Vercel (Frontend)

---

## Repository Structure

```
music-catalog-insights/
├── backend/            # Spring Boot 3 Java 21 REST API
├── frontend/           # React + TypeScript + Vite Single Page Application
├── docker-compose.yml  # Local multi-container development environment
└── README.md           # Project Documentation
```

---

## REST API Endpoints

| Method | Endpoint | Description | Authentication Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT token | No |
| `GET` | `/api/search` | Search album catalog via iTunes Search API | Yes |
| `GET` | `/api/library` | List authenticated user's saved albums | Yes |
| `GET` | `/api/library/{id}` | Get specific saved album details | Yes |
| `POST` | `/api/library` | Save catalog album to personal library | Yes |
| `PUT` | `/api/library/{id}` | Update rating (1-5) or personal notes | Yes |
| `DELETE` | `/api/library/{id}` | Remove album from saved library | Yes |
| `GET` | `/api/analytics` | Fetch aggregate metrics for analytics dashboard | Yes |
| `POST` | `/api/insights/trend-summary` | Generate AI trend summary report | Yes |

---

## Analytics Dashboard

The platform includes four distinct visual data charts rendered with Recharts:

1. **Donut / Pie Chart**: Albums grouped by Primary Genre.
2. **Bar Chart**: Album Release Year timeline breakdown.
3. **Horizontal Bar Chart**: User Rating distribution (1 to 5 stars).
4. **Histogram Bar Chart**: Track Count spread across saved library.

---

## AI Feature Implementation

- **Natural Language Trend Summary Engine**: Analyzes the user's saved library collection across genres, release eras, and ratings to produce structured insights on listening habits, dominant genres, historical eras, and recommendations.
- **Audio Tone & BPM Analysis**: Analyzes audio characteristics for selected tracks to extract BPM, tone key, mood, and energy metrics.

---

## Quick Start (Local Development)

### Prerequisites

- JDK 21 or higher
- Node.js 18+ and npm
- Docker and Docker Compose (Optional, for local PostgreSQL)

### 1. Database Setup (Docker)

Start PostgreSQL in detached mode:
```bash
docker-compose up -d postgres
```

### 2. Backend Setup (Spring Boot)

Navigate to `/backend`:
```bash
cd backend
cp .env.example .env
./mvnw spring-boot:run
```
The API server will start at `http://localhost:8080`.

### 3. Frontend Setup (React + Vite)

Navigate to `/frontend`:
```bash
cd frontend
npm install
npm run dev
```
The UI application will start at `http://localhost:5173`.

---

## Trade-offs and Engineering Decisions

1. **Client-Side Debouncing vs Server-Side Throttling**: Debouncing search input on the frontend reduces redundant requests to both the Spring Boot backend and the external iTunes Search API.
2. **In-Memory Caching for External Search**: External iTunes API responses are cached to minimize network latency and handle transient upstream outages gracefully.
3. **Stateless JWT Security**: Avoids server-side session state in Spring Boot, enabling effortless horizontal scaling when deployed to cloud providers like Render.

---

## License

MIT License. Created as a full-stack take-home architecture solution.
