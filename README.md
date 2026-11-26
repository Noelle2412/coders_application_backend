# Coders Application Backend

Backend REST API for the **Coders Application** built with Node.js, Express, MongoDB (Mongoose), Joi, bcrypt, jsonwebtoken, and Nodemailer.

---

## 🚀 Features

- **Database Persistence & Seeding**:
  - Connected to MongoDB Atlas via Mongoose with strict schema validation.
  - Automated database seeding on startup (`db/seed.js`) with idempotent checks (`findOne`) to prevent duplicate entries on restarts.
- **Authentication, Email Verification & Security**:
  - Registration and login endpoints for **Coders** and **Managers**.
  - Passwords hashed with `bcrypt` (10 salt rounds).
  - Unverified accounts by default (`is_verified: false`); dispatches verification emails via Nodemailer with signed 24h JWT tokens.
  - `GET /verify?token=...` endpoint serving responsive HTML success/error templates.
  - Login is blocked (`403 Forbidden`) until the email address has been verified.
  - Authenticated login generates a 7-day JWT containing `{ id, email, role }`.
  - Role-based authorization (`authorize(["Coder", "Manager"])`) and self-ownership checks (`ensureSelf`) preventing users from modifying or deleting accounts other than their own.
  - `validateObjectId` middleware and global `CastError` handler preventing 500 crashes on malformed MongoDB ObjectIds.
- **Challenges**:
  - Managers can create challenges with starter code (`py`, `js`), input definitions, and test cases with optional weights (`weight`).
  - **Role-based challenge listing**:
    - **Coders**: View all available challenges with their personal status (`Waiting`, `Attempted`, `Completed`) and overall `solution_rate`.
    - **Managers**: View only the challenges they personally created, along with `solution_rate`.
  - **Hidden Test Cases**: Test cases are hidden (`tests` removed) from both `GET /challenges` and `GET /challenges/:id` to avoid giving away solutions.
- **Automated Grading & Code Runner Integration**:
  - Communicates with the remote code test runner (`https://runlang-v1.onrender.com/run`).
  - Single-solution policy: Rejects resubmissions for challenges the coder has already solved.
  - Dynamic score calculation: If tests pass, awards points using $\text{score} = \sum (\text{test weight} \times 100)$ and automatically updates the coder's global score.
  - Persists full submission records (`SubmissionModel`).
- **Leaderboard**:
  - Ranked coder list sorted by score descending, including `solved_challenges` (count of distinct challenges solved).
  - Top $K$ coders endpoint (`GET /leaderboard/top?k=...` or `?K=...`).
  - Protected to coders only; excludes email addresses to protect privacy.
- **System Statistics & Analytics**:
  - **Solved Challenges Stats**: Total challenges per difficulty (`Easy`, `Moderate`, `Hard`) vs. solved count for the requesting coder.
  - **Trending Categories**: 6-stage aggregation pipeline calculating popular categories across passed submissions.
  - **Activity Heatmap**: Aggregates successful submissions formatted as `YYYY/mm/dd` within configurable date ranges (`?start_date=&end_date=`).
- **Profile Management**:
  - Profile retrieval includes platform ranking for coders ($\text{rank} = 1 + \text{coders with higher score}$).
  - Profile updates for `firstName`, `lastName`, `about`, and `avatar` (supports URLs, 2-letter initials, or empty string).

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js (v5)
- **Database & ODM**: MongoDB / Mongoose
- **Validation**: Joi
- **Security & Tokens**: bcrypt, jsonwebtoken
- **Email**: Nodemailer (with Ethereal Email test account fallback)
- **Development Tooling**: nodemon, dotenv

---

## 📂 Project Structure

```text
coders_application_backend/
├── controllers/
│   ├── challengesControllers.js   # Challenge endpoints (CRUD, submissions)
│   ├── codersControllers.js       # Coder auth & profile endpoints
│   ├── leaderboardControllers.js  # Leaderboard & Top K endpoints
│   ├── managersControllers.js     # Manager auth & profile endpoints
│   ├── statsControllers.js        # Analytics, heatmaps & trending categories
│   └── verificationController.js  # Email verification endpoint & template rendering
├── db/
│   ├── db.js                      # MongoDB connection setup
│   └── seed.js                    # Idempotent database seeder
├── middlewares/
│   ├── authMiddleware.js          # authorize, ensureSelf, validateObjectId
│   ├── authValidator.js           # Joi schemas for registration, login, profile
│   ├── challengeValidator.js      # Joi schemas for challenges & submissions
│   ├── leaderboardValidator.js    # Joi schema for Top K query parameters
│   └── validate.js                # Higher-order Joi validation middleware
├── models/
│   ├── Challenge.js               # Challenge Mongoose schema
│   ├── Coder.js                   # Coder Mongoose schema
│   ├── Manager.js                 # Manager Mongoose schema
│   └── Submission.js              # Submission Mongoose schema
├── routers/
│   ├── challengesRouters.js       # /challenges routes
│   ├── codersRouters.js           # /coders routes
│   ├── leaderboardRouters.js      # /leaderboard routes
│   ├── managersRouters.js         # /managers routes
│   └── statsRouters.js            # /stats routes
├── services/
│   ├── challengesService.js       # Challenge listing, status & solution rate calculations
│   ├── gradingService.js          # Code runner integration & score computation
│   ├── leaderboardService.js      # Ranked leaderboard & solved counts
│   ├── profileService.js          # Profile retrieval, rank calculation & updates
│   └── statsService.js            # Aggregation pipelines for statistics & heatmaps
├── utils/
│   └── emailService.js            # Nodemailer transport, email sending & JWT utilities
├── views/
│   └── verificationTemplates.js   # Responsive HTML templates for email verification
├── .env                           # Environment variables
├── .env.example                   # Example environment variables
├── app.js                         # Express configuration, database bootstrap & server startup
└── package.json                   # Dependencies & scripts
```

---

## ⚙️ Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/)
- MongoDB Atlas connection URI or local MongoDB instance

### 2. Installation

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory (see `.env.example`):

```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/Coders_Application
JWT_SECRET=your_super_secret_jwt_key
CODE_RUNNER_URL=https://runlang-v1.onrender.com/run
BASE_URL=http://localhost:3000

# Optional SMTP Configuration (falls back to Ethereal Email in dev)
# SMTP_HOST=smtp.mailtrap.io
# SMTP_PORT=587
# SMTP_USER=your_username
# SMTP_PASS=your_password
```

### 4. Running the Server

Start in development mode with auto-reload:

```bash
npm start
```

Or run directly:

```bash
node app.js
```

---

## 📡 API Endpoints

### Public & Authentication Endpoints
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/` | API root health check | Public |
| `GET` | `/verify?token=...` | Verifies account via token from email | Public |
| `POST` | `/coders/registration` | Register a new coder (sends verification email) | Public |
| `POST` | `/coders/login` | Login as coder (requires verified email, returns JWT) | Public |
| `POST` | `/managers/registration`| Register a new manager (sends verification email) | Public |
| `POST` | `/managers/login` | Login as manager (requires verified email, returns JWT) | Public |

---

### Profile Management (`/coders`, `/managers`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/coders/:id` | Get coder profile (includes platform `rank`) | Authenticated |
| `PATCH`| `/coders/:id` | Update coder profile fields (`firstName`, `lastName`, `about`, `avatar`) | Own Coder Account |
| `DELETE`| `/coders/:id` | Delete coder account | Own Coder Account |
| `GET` | `/managers/:id` | Get manager profile | Authenticated |
| `PATCH`| `/managers/:id` | Update manager profile fields (`firstName`, `lastName`, `about`, `avatar`) | Own Manager Account |
| `DELETE`| `/managers/:id` | Delete manager account | Own Manager Account |

---

### Challenges (`/challenges`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/challenges/create` | Create a new challenge (with test cases and weights) | Managers |
| `GET` | `/challenges` | List challenges (coders see all + status; managers see own; tests hidden) | Authenticated |
| `GET` | `/challenges/categories` | List distinct challenge categories | Public |
| `GET` | `/challenges/:id` | Get challenge details (tests hidden, includes solution rate) | Authenticated |
| `DELETE`| `/challenges/:id` | Delete challenge | Managers |
| `POST` | `/challenges/:id/submission` | Submit code for remote evaluation and grading | Coders |

---

### Leaderboard (`/leaderboard`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/leaderboard` | Full leaderboard sorted by score with solved challenge counts | Coders |
| `GET` | `/leaderboard/top` | Top $K$ coders (`?k=...` or `?K=...`, default: 3) | Coders |

---

### System Statistics (`/stats`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/stats/solved-challenges` | Difficulty level stats for coder vs. platform totals | Coders |
| `GET` | `/stats/trending-categories` | Top categories by passed submissions | Coders |
| `GET` | `/stats/heatmap` | Submission activity strikes (`?start_date=&end_date=`) | Coders |
