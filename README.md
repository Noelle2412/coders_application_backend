# Coders Application Backend

Backend REST API for the **Coders Application** built with Node.js, Express, Joi, and bcrypt.

---

## 🚀 Features

- **Authentication & User Management**:
  - Registration and login endpoints for **Coders** and **Managers**.
  - Secure password hashing and verification using `bcrypt`.
  - CRUD operations (get by ID, update profile, delete by ID) for coder and manager profiles.
- **Challenges**:
  - Create challenges with multi-language starter code (`py`, `js`), input definitions, and automated test cases.
  - Fetch all challenges or filter by category.
  - Fetch single challenge by ID and delete challenge by ID.
  - Retrieve available challenge categories.
  - Challenge submission endpoint.
- **Leaderboard & Statistics**:
  - Get full leaderboard ranking.
  - Retrieve top $K$ coders (with validated query parameter $K \in [1, 100]$).
  - Metrics endpoints for solved challenges stats, trending categories, and activity heatmaps.
- **Centralized Data Validation**:
  - Schema validation on requests using `Joi`.
  - DRY, generic higher-order middleware factory (`validate(schema, property)`) supporting `req.body` and `req.query`.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Validation**: Joi
- **Security / Hashing**: bcrypt
- **Development Tooling**: nodemon, dotenv

---

## 📂 Project Structure

```text
coders_application_backend/
├── controllers/
│   ├── challengesControllers.js   # Challenge management & submissions
│   ├── codersControllers.js       # Coder auth & profile CRUD (bcrypt hashed)
│   ├── leaderboardControllers.js  # Leaderboard and top coder rankings
│   ├── managersControllers.js     # Manager auth & profile CRUD
│   └── statsControllers.js        # Analytics, heatmaps & trending topics
├── middlewares/
│   ├── authValidator.js           # Registration, login & profile update schemas
│   ├── challengeValidator.js      # Challenge creation & submission schemas
│   ├── leaderboardValidator.js    # Leaderboard query parameter validation
│   └── validate.js                # Generic higher-order Joi validation middleware
├── routers/
│   ├── challengesRouters.js       # /challenges routes
│   ├── codersRouters.js           # /coders routes
│   ├── leaderboardRouters.js      # /leaderboard routes
│   ├── managersRouters.js         # /managers routes
│   └── statsRouters.js            # /stats routes
├── db/
│   └── db.js                      # Database configuration / placeholder
├── .env                           # Environment configuration
├── .env.example                   # Example environment variables
├── app.js                         # Application entrypoint & middleware setup
└── package.json                   # Dependencies & scripts
```

---

## ⚙️ Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### 2. Installation

Clone the repository and install dependencies:

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory (refer to `.env.example`):

```env
PORT=3000
```

> **Note**: Avoid trailing semicolons in `.env` variable values.

### 4. Running the Server

Start in development mode with auto-reload (via `nodemon`):

```bash
npm start
```

Or run directly with Node:

```bash
node app.js
```

The server will be running at `http://localhost:3000`.

---

## 📡 API Endpoints

### Health / Root
- `GET /` - Root health message.

---

### Coders (`/coders`)
| Method | Endpoint | Description | Validation |
|---|---|---|---|
| `POST` | `/coders/registration` | Register a new coder (hashes password) | `firstName`, `lastName`, `email`, `password` (min 6) |
| `POST` | `/coders/login` | Log in as coder | `email`, `password` |
| `GET` | `/coders/:id` | Get coder by ID | None |
| `PATCH`| `/coders/:id` | Update profile fields | `firstName`, `lastName`, `about` (optional) |
| `DELETE`| `/coders/:id` | Delete coder profile | None |

---

### Managers (`/managers`)
| Method | Endpoint | Description | Validation |
|---|---|---|---|
| `POST` | `/managers/registration` | Register a new manager | `firstName`, `lastName`, `email`, `password` (min 6) |
| `POST` | `/managers/login` | Log in as manager | `email`, `password` |
| `GET` | `/managers/:id` | Get manager by ID | None |
| `PATCH`| `/managers/:id` | Update profile fields | `firstName`, `lastName`, `about` (optional) |
| `DELETE`| `/managers/:id` | Delete manager profile | None |

---

### Challenges (`/challenges`)
| Method | Endpoint | Description | Validation |
|---|---|---|---|
| `POST` | `/challenges/create` | Create a new challenge | `title`, `category`, `level`, `code` (with `code_text` [py, js], `inputs`), `tests` |
| `GET` | `/challenges` | Get all challenges (supports `?category=`) | None |
| `GET` | `/challenges/categories` | Get unique challenge categories | None |
| `GET` | `/challenges/:id` | Get challenge by ID | None |
| `DELETE`| `/challenges/:id` | Delete challenge by ID | None |
| `POST` | `/challenges/:id/submit` | Submit code for challenge | `lang` (`py` or `js`), `code`, `challenge_id` |

---

### Leaderboard (`/leaderboard`)
| Method | Endpoint | Description | Validation |
|---|---|---|---|
| `GET` | `/leaderboard` | Get complete leaderboard | None |
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

When validation fails, endpoints return a `400 Bad Request` with structured error messages:

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
