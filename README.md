# Task Management System

A full-stack task management application with role-based access control.  
**Live Demo:** [https://orange-flower-061b2cd00.7.azurestaticapps.net](https://orange-flower-061b2cd00.7.azurestaticapps.net)

---

## Features

- **User Authentication** — Register, login, and JWT-based sessions
- **Task CRUD** — Create, read, update, and delete tasks
- **Role-Based Access** — Admins see all tasks; users see only their own
- **Admin Dashboard** — Member progress overview with completion stats
- **Priority & Status** — Track task priority (low/medium/high) and status (pending/in-progress/completed)
- **Daily Email Reminders** — Automated SendGrid notifications for overdue / due-today tasks
- **Responsive UI** — Built with React + Tailwind CSS

---

## Tech Stack

| Layer        | Technology                             |
| ------------ | -------------------------------------- |
| Frontend     | React 18, Vite.js, Tailwind CSS v4     |
| Backend      | Node.js, Express.js                    |
| Database     | MongoDB (Mongoose ODM)                 |
| Auth         | JWT (JSON Web Tokens) + bcrypt         |
| Email        | SendGrid (free tier)                   |
| Deployment   | Azure App Service, Azure Static Web Apps |
| CI/CD        | GitHub Actions                         |
| IaC          | Terraform (Azure)                      |

---

## Project Structure

```
backend/
├── config/          # Database connection
├── controllers/     # Route handlers (auth, tasks)
├── middleware/       # Auth middleware (JWT, roles)
├── models/          # Mongoose schemas (User, Task)
├── routes/          # Express routers
├── scripts/         # Utilities (seed admin)
├── server.js        # Entry point (includes cron reminders)
├── Dockerfile       # Container build
└── package.json

frontend/
├── public/
├── src/
│   ├── components/  # React components (Login, Register, Dashboard, etc.)
│   ├── context/     # Auth & Task state management
│   ├── services/    # Axios API client
│   ├── App.jsx      # Routes & auth guards
│   ├── App.css      # Tailwind import
│   └── main.jsx     # Entry point
├── index.html
├── vite.config.js
└── package.json

terraform/           # Azure IaC (App Service, ACR, Static Web App)

.github/workflows/   # CI/CD pipeline

README.md
```

---

## Local Development

### Prerequisites

- **Node.js** 20+
- **MongoDB** (local or Atlas)
- **npm**

### 1. Clone & Install

```bash
# Backend
cd backend
cp .env.example .env   # Edit with your MongoDB URI and JWT secret
npm install
npm run dev             # Starts on http://localhost:5001

# Frontend (separate terminal)
cd frontend
npm install
npm run dev             # Starts on http://localhost:3000
```

### 2. Environment Variables (`backend/.env`)

```env
MONGODB_URI=mongodb://localhost:27017/taskmanagement
JWT_SECRET=your_strong_secret_key
ADMIN_SECRET=admin_secret_change_me
PORT=5001
NODE_ENV=development

# Optional — for email reminders
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=reminders@yourdomain.com
```

### 3. Running the App

1. Open `http://localhost:3000`
2. Register a new account (default role: **user**)
3. To create an admin, check **"Register as admin"** and enter the secret code from your `.env`
4. Create, edit, and delete tasks
5. Admins see all tasks; users see only their own + assigned

### 4. Seed an Admin (Alternative)

```bash
cd backend
npm run seed
```

Creates `admin@example.com` / `admin123456`.

---

## API Endpoints

| Method   | Endpoint              | Auth    | Description                |
| -------- | --------------------- | ------- | -------------------------- |
| `POST`   | `/api/auth/register`  | Public  | Register a new user        |
| `POST`   | `/api/auth/login`     | Public  | Login                      |
| `GET`    | `/api/auth/me`        | Private | Get current user           |
| `GET`    | `/api/auth/users`     | Admin   | List all users             |
| `GET`    | `/api/tasks`          | Private | List tasks (role-filtered) |
| `GET`    | `/api/tasks/stats`    | Admin   | Member task statistics     |
| `GET`    | `/api/tasks/:id`      | Private | Get a single task          |
| `POST`   | `/api/tasks`          | Private | Create a task              |
| `PUT`    | `/api/tasks/:id`      | Private | Update a task              |
| `DELETE` | `/api/tasks/:id`      | Private | Delete a task              |
| `GET`    | `/api/health`         | Public  | Health check               |

---

## Deployment

The project is deployed to Azure using Terraform and GitHub Actions.

### Infrastructure

```bash
cd terraform
terraform init
terraform apply
```

### CI/CD

Push to `main` triggers the pipeline:
1. Test backend
2. Build frontend
3. Build & push Docker image to Azure Container Registry
4. Restart App Service (new container pulled)
5. Deploy frontend to Azure Static Web Apps

---