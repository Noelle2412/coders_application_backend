# Coders Application Backend

Backend REST API for the **Coders Application** built with Node.js, Express, MongoDB (Mongoose), Joi, and bcrypt.

---

## 🚀 Features

- **Database Persistence**:
  - Connected to MongoDB Atlas via Mongoose with strict schema validation.
  - Automated timestamps (`createdAt`, `updatedAt`) across documents.
- **Authentication & User Management**:
  - Registration and login endpoints for **Coders** and **Managers**.
  - Secure password hashing and verification using `bcrypt` (10 salt rounds).
  - Profile retrieval, updates (`firstName`, `lastName`, `about`, `avatar`), and account deletion.
  - Avatars accept either full image URLs or 2-letter initials strings.
- **Challenges**:
  - Multi-language starter code definitions (`py` and `js`) with input metadata.
  - Structured test cases with multiple input key-value objects (`[{ name, value }]`) per test case.
  - Filter challenges by category or retrieve all unique categories.
  - CRUD operations and challenge submission validation.
- **Leaderboard & Statistics**:
  - Live ranking sorted descending by coder scores.
  - Top $K$ coders endpoint with validated integer query parameter ($K \in [1, 100]$, default 3).
  - Metrics endpoints for solved challenge summaries, trending topics, and activity heatmaps.
- **Centralized Data Validation**:
  - Request validation using `Joi`.
  - Reusable higher-order validation middleware factory (`validate(schema, property)`) handling `req.body`, `req.query`, and standardizing error responses.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js (v5)
- **Database & ODM**: MongoDB / Mongoose
- **Validation**: Joi
- **Security / Hashing**: bcrypt
- **Development Tooling**: nodemon, dotenv

---

## 📂 Project Structure

```text
coders_application_backend/
├── controllers/
│   ├── challengesControllers.js   # Challenge CRUD & submissions (MongoDB)
│   ├── codersControllers.js       # Coder auth & profile CRUD (bcrypt + MongoDB)
│   ├── leaderboardControllers.js  # Leaderboard and top coder rankings (MongoDB)
│   ├── managersControllers.js     # Manager auth & profile CRUD (bcrypt + MongoDB)
│   └── statsControllers.js        # Analytics, heatmaps & trending topics
├── db/
│   └── db.js                      # Mongoose connection setup (connectDB)
├── middlewares/
│   ├── authValidator.js           # Auth & profile update validation schemas
│   ├── challengeValidator.js      # Challenge & submission validation schemas
│   ├── leaderboardValidator.js    # Leaderboard query parameter validation schemas
│   └── validate.js                # Generic higher-order Joi validation middleware
├── models/
│   ├── Challenge.js               # Challenge Mongoose schema & model
│   ├── Coder.js                   # Coder Mongoose schema & model
│   └── Manager.js                 # Manager Mongoose schema & model
├── routers/
│   ├── challengesRouters.js       # /challenges routes
│   ├── codersRouters.js           # /coders routes
│   ├── leaderboardRouters.js      # /leaderboard routes
│   ├── managersRouters.js         # /managers routes
│   └── statsRouters.js            # /stats routes
├── .env                           # Environment variables (PORT, MONGODB_URI)
├── .env.example                   # Example environment variables
├── app.js                         # Application entrypoint & database bootstrap
└── package.json                   # Dependencies & scripts
```

---

## ⚙️ Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/)
- A running MongoDB instance or [MongoDB Atlas](https://www.mongodb.com/atlas) cluster URI

### 2. Installation

Clone the repository and install dependencies:

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory (refer to `.env.example`):

```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/Coders_Application
```

> **Note**: Do not add trailing semicolons to variable values in `.env`.

### 4. Running the Server

Start in development mode with auto-reload:

```bash
npm start
```

Or run directly with Node:

```bash
node app.js
```

The database connection will initialize first, and the server will listen on `http://localhost:3000`.

---

## 📡 API Endpoints

### Health / Root
- `GET /` - Root health status message.

---

### Coders (`/coders`)
| Method | Endpoint | Description | Validation |
|---|---|---|---|
| `POST` | `/coders/registration` | Register coder (hashes password) | `firstName`, `lastName`, `email`, `password` (min 6) |
| `POST` | `/coders/login` | Log in coder | `email`, `password` |
| `GET` | `/coders/:id` | Get coder profile by ID | None |
| `PATCH`| `/coders/:id` | Update profile fields | `firstName`, `lastName`, `about`, `avatar` (URL or 2-letter initials) |
| `DELETE`| `/coders/:id` | Delete coder account | None |

---

### Managers (`/managers`)
| Method | Endpoint | Description | Validation |
|---|---|---|---|
| `POST` | `/managers/registration` | Register manager (hashes password) | `firstName`, `lastName`, `email`, `password` (min 6) |
| `POST` | `/managers/login` | Log in manager | `email`, `password` |
| `GET` | `/managers/:id` | Get manager profile by ID | None |
| `PATCH`| `/managers/:id` | Update profile fields | `firstName`, `lastName`, `about`, `avatar` (URL or 2-letter initials) |
| `DELETE`| `/managers/:id` | Delete manager account | None |

---

### Challenges (`/challenges`)
| Method | Endpoint | Description | Validation |
|---|---|---|---|
| `POST` | `/challenges/create` | Create a new challenge | `title`, `category`, `level` (`Easy`, `Moderate`, `Hard`), `code` (with `code_text` for `py` & `js`, and `inputs`), `tests` (array of `{ inputs: [{ name, value }], output }`) |
| `GET` | `/challenges` | Get all challenges (supports `?category=`) | None |
| `GET` | `/challenges/categories` | Get list of distinct categories | None |
| `GET` | `/challenges/:id` | Get challenge by ID | None |
| `DELETE`| `/challenges/:id` | Delete challenge by ID | None |
| `POST` | `/challenges/:id/submit` | Submit code solution | `lang` (`py` or `js`), `code`, `challenge_id` |

---

### Leaderboard (`/leaderboard`)
| Method | Endpoint | Description | Validation |
|---|---|---|---|
| `GET` | `/leaderboard` | Get complete leaderboard sorted by score | None |
| `GET` | `/leaderboard/top` | Get top $K$ coders (`?K=`) | `K`: integer between 1 and 100 (default: 3) |

---

### Statistics (`/stats`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/stats/solved-challenges` | Get summary of solved challenges |
| `GET` | `/stats/trending-categories`| Get list of trending categories |
| `GET` | `/stats/heatmap` | Get activity heatmap data (`?startDate=&endDate=`) |

---

## 🔒 Validation & Error Responses

When validation fails, endpoints return a `400 Bad Request` with detailed feedback:

```json
{
  "status": "fail",
  "message": "Validation failed",
  "errors": [
    "First name is required",
    "Please provide a valid email address"
  ]
}
```
