# Task Management System

A full-stack Task Management application with role-based access control, built with **React (Vite.js)**, **Express.js**, and **MongoDB**. Deployed to **Microsoft Azure** via **Terraform** and **GitHub Actions** CI/CD, with **n8n** workflow automation.

---

## Features

- **User Authentication** — Register, login, and JWT-based sessions
- **Task CRUD** — Create, read, update, and delete tasks
- **Role-Based Access** — Admins see all tasks; regular users see only their own
- **Priority & Status** — Track task priority (low/medium/high) and status (pending/in-progress/completed)
- **Responsive UI** — Mobile-friendly dashboard built with React + Vite
- **Secure** — Passwords hashed with bcrypt, environment variables for secrets

---

## Tech Stack

| Layer        | Technology                        |
| ------------ | --------------------------------- |
| Frontend     | React 18, Vite.js, React Router   |
| Backend      | Node.js, Express.js               |
| Database     | MongoDB (via Mongoose)            |
| Auth         | JWT (JSON Web Tokens)             |
| IaC          | Terraform (Azure)                 |
| CI/CD        | GitHub Actions                    |
| Automation   | n8n                               |

---

## Project Structure

```
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Route handlers (auth, tasks)
│   ├── middleware/       # Auth middleware (JWT, roles)
│   ├── models/          # Mongoose schemas (User, Task)
│   ├── routes/          # Express routers
│   ├── server.js        # Entry point
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # Auth & Task contexts
│   │   ├── services/    # API client (axios)
│   │   ├── App.jsx      # Root with routing
│   │   └── main.jsx     # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── terraform/           # Azure IaC scripts
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
├── .github/workflows/   # CI/CD pipeline
│   └── ci-cd.yml
├── n8n/                 # n8n workflow export
│   └── task_reminder_workflow.json
└── README.md
```

---

## Local Development

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- npm

### 1. Clone & Install

```bash
# Backend
cd backend
cp .env.example .env   # Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev            # Starts on http://localhost:5000

# Frontend (in a separate terminal)
cd frontend
npm install
npm run dev            # Starts on http://localhost:3000
```

### 2. Environment Variables (backend/.env)

```env
MONGODB_URI=mongodb://localhost:27017/taskmanagement
JWT_SECRET=your_strong_secret_key
PORT=5000
NODE_ENV=development
```

### 3. Usage

1. Open `http://localhost:3000` in your browser
2. Register a new account (default role: **user**)
3. To test admin features, manually set `role: "admin"` in your MongoDB collection
4. Create, edit, and delete tasks — admins see all tasks, users see only their own

---

## Deployment to Azure

### Prerequisites

- Azure subscription
- Azure CLI (`az login`)
- Terraform >= 1.5
- MongoDB Atlas cluster (for production database)

### Provision Infrastructure

```bash
cd terraform
terraform init
terraform plan -var="mongodb_uri=mongodb+srv://..." -var="jwt_secret=your_secret"
terraform apply
```

### CI/CD via GitHub Actions

1. Set the following **repository secrets** in your GitHub repo:

| Secret                           | Description                            |
| -------------------------------- | -------------------------------------- |
| `AZURE_BACKEND_PUBLISH_PROFILE`  | Publish profile from Azure App Service |
| `AZURE_STATIC_WEB_APPS_API_TOKEN`| Deployment token from Static Web App   |
| `AZURE_BACKEND_APP_NAME`         | Name of the backend App Service        |

2. Push to the `main` branch — the pipeline automatically builds and deploys.

---

## n8n Workflow Automation

The file `n8n/task_reminder_workflow.json` is a ready-to-import n8n workflow that:

- Runs on a schedule (weekdays at 8:00 AM)
- Fetches tasks from the API
- Filters tasks that are overdue (not completed, past due date)
- Sends an email reminder to the admin

Import it into your n8n instance and configure the following environment variables in n8n:

| Variable              | Description                          |
| --------------------- | ------------------------------------ |
| `BACKEND_API_URL`     | URL of your deployed backend         |
| `ADMIN_JWT_TOKEN`     | A valid JWT token for an admin user  |
| `ADMIN_EMAIL`         | Email address to receive reminders   |
| `SMTP_FROM`           | SMTP sender address                  |

---

## API Endpoints

| Method   | Endpoint            | Auth   | Description          |
| -------- | ------------------- | ------ | -------------------- |
| `POST`   | `/api/auth/register`| Public | Register a new user  |
| `POST`   | `/api/auth/login`   | Public | Login                |
| `GET`    | `/api/auth/me`      | Private| Get current user     |
| `GET`    | `/api/tasks`        | Private| List tasks (role-filtered) |
| `GET`    | `/api/tasks/:id`    | Private| Get a single task    |
| `POST`   | `/api/tasks`        | Private| Create a task        |
| `PUT`    | `/api/tasks/:id`    | Private| Update a task        |
| `DELETE` | `/api/tasks/:id`    | Private| Delete a task        |

---

## License

MIT
