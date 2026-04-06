# Financial Records Management API

A robust, production-ready REST API for managing personal or business financial records. Built with Node.js, Express, and Prisma, this backend features role-based access control (RBAC), JSON Web Token (JWT) authentication, data aggregation for dashboards, and strict input validation.

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database Engine:** SQLite (Chosen for zero-config local evaluation)
- **ORM:** Prisma
- **Validation:** Zod
- **Security:** crypt (password hashing), jsonwebtoken (stateless authentication), express-rate-limit (DDoS protection)

## ⚡ Features & Technical Details

### Authentication & Authorization

- **JWT-Based Stateless Auth:** Users authenticate using JWTs, ensuring the API instance doesn't have to keep track of sessions, allowing for seamless horizontal scaling.
- **Password Protection:** Plain text passwords are never stored. Passwords are securely hashed with salts using crypt to protect against rainbow table attacks.
- **Role-Based Access Control (RBAC):** Strict middleware enforces permissions for ADMIN, ANALYST, and VIEWER roles down to the protected route level.

### Security & Reliability

- **Rate Limiting Limit:** A global rate limit is applied via express-rate-limit, permitting only 100 requests per 15-minute window per IP. This mitigates brute-force attacks and prevents application overload.
- **Payload Validation:** All incoming data passes through strict validation pipelines using Zod, which ensures structural integrity before logic execution.
- **Global Error Handling:** All unhandled promises and API errors are caught continuously by a centralized middleware handler, preventing stack trace leaks and app crashes.

### Financial Data Management & Dashboard

- **Financial Records:** Full CRUD capabilities for tracking income and expenses.
- **Dashboard Aggregations:** High-performance database-level calculations using Prisma for total summaries, category breakdowns, and monthly trends.

## 🛠️ Setup Process

Follow these steps to run the project locally on your machine.

### 1. Install Dependencies

`ash
npm install
`

### 2. Configure Environment Variables

Create a .env file in the root directory and add your JWT secret:
`env
JWT_SECRET="your-super-secret-key"
`

### 3. Initialize the Database

Generate the Prisma client and push the schema to create the local dev.db SQLite file:
`ash
npx prisma generate
npx prisma db push
`

### 4. Start the Server

`ash
npm run dev
`
The server will start on http://localhost:3000.

### 5. Bootstrapping the First Admin

_Note: Because creating a user requires an ADMIN token, you must create the first user manually._

1. Run
   px prisma studio in a new terminal.
2. Add a new user to the User table with the role ADMIN.
3. Use the following pre-hashed string as the password:
   $2b/v3L5kQ.8J7Q9Zq5O.l4H/8s8z3/7T7b45q8Zq5O.l4H/8s8z3
   _(This translates to the password: password123)_.

---

## 📖 API Documentation

All routes under /api/users, /api/records, and /api/dashboard require a valid JWT passed in the Authorization: Bearer <token> header.

### Authentication

- POST /api/auth/login - Authenticate a user and receive a JWT. (Public)

### Users Management (Admin Only)

- POST /api/users - Create a new user (Requires ADMIN role).
- GET /api/users - Retrieve all users.
- PATCH /api/users/:id - Update user details or status.
- DELETE /api/users/:id - Remove a user.

### Financial Records

- GET /api/records - Fetch all financial records. Supports query filters (?type=INCOME&category=Salary). _(Requires ADMIN or ANALYST role)_.
- POST /api/records - Create a new record. _(Requires ADMIN role)_.
- PATCH /api/records/:id - Update an existing record. _(Requires ADMIN role)_.
- DELETE /api/records/:id - Delete a record. _(Requires ADMIN role)_.

### Dashboard Data

_(Accessible by ADMIN, ANALYST, and VIEWER)_

- GET /api/dashboard/summary - Returns aggregated totals (Total Income, Total Expenses, Net Balance).
- GET /api/dashboard/categories - Returns income/expenses grouped by category.
- GET /api/dashboard/trends - Returns month-over-month financial trends.

---

## 🤔 Assumptions Made

- **Local Evaluation:** I assumed the evaluator will run this locally, hence the choice of SQLite. It prevents the need to install PostgreSQL or configure Docker just to test the API.
- **Dashboard UI:** The dashboard endpoints are structured specifically to serve modern frontend charting libraries (e.g., returning data grouped by YYYY-MM for easy rendering on a line chart).
- **Admin Exclusivity:** I assumed that financial record creation and modification should be strictly limited to Admins, while Analysts are primarily data consumers.

---

## ⚖️ Tradeoffs Considered

- **SQLite vs. PostgreSQL:** While PostgreSQL is superior for production (better concurrency and advanced data types), I chose SQLite to maximize developer experience and ease of setup for the reviewer. Because the app uses Prisma, migrating to Postgres requires changing only one line of code in schema.prisma.
- **In-Memory Rate Limiting vs. Redis:** I utilized memory-based rate limiting via express-rate-limit. If this API were deployed across multiple instances/servers behind a load balancer, a Redis store would be necessary to synchronize rate limits, but it was excluded here to keep local dependencies minimal.
- **Pagination & Search:** To keep the core logic focused and the scope tight for the assignment timeframe, cursor/offset pagination was omitted, relying on database-level aggregation to handle large datasets efficiently.
