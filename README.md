# Task Management System

A full-stack task management application with role-based access control.  
**Live Demo:** [https://orange-flower-061b2cd00.7.azurestaticapps.net](https://orange-flower-061b2cd00.7.azurestaticapps.net)

---

## Features

- **User Authentication** — Register, login, and JWT-based sessions
- **Google Sign-In** — One-click login with Google account
- **Task CRUD** — Create, read, update, and delete tasks
- **Role-Based Access** — Admins see all tasks; users see only their own + assigned
- **Admin Member Progress** — Dedicated page showing each user's completion stats and performance
- **Admin Promotion** — Existing admins can promote other users directly from the UI
- **Priority & Status** — Track task priority (low/medium/high) and status (pending/in-progress/completed)
- **Responsive UI** — Built with React + Tailwind CSS v4
- **SweetAlert2 Modals** — Polished user interactions (confirmations, errors)

---

## Tech Stack

| Layer        | Technology                             |
| ------------ | -------------------------------------- |
| Frontend     | React 18, Vite.js, Tailwind CSS v4     |
| Backend      | Node.js, Express.js                    |
| Database     | MongoDB (Mongoose ODM)                 |
| Auth         | JWT (JSON Web Tokens) + bcrypt         |
| Container    | Docker, Azure Container Registry       |
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
├── scripts/         # Admin seed script
├── server.js        # Entry point
├── Dockerfile       # Container build
└── package.json

frontend/
├── public/
├── src/
│   ├── components/  # Login, Register, Dashboard, TaskForm, TaskList, MemberProgress
│   ├── context/     # Auth & Task state management
│   ├── services/    # Axios API client
│   ├── App.jsx      # Routes & auth guards + GoogleOAuthProvider
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
cp .env.example .env.local   # Edit with your Google Client ID
npm install
npm run dev                  # Starts on http://localhost:3000
```

### 2. Environment Variables

**Backend** (`backend/.env`):
```env
MONGODB_URI=mongodb://localhost:27017/taskmanagement
JWT_SECRET=your_strong_secret_key
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
PORT=5001
NODE_ENV=development
```

**Frontend** (`frontend/.env.local`):
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

### 3. Running the App

1. Open `http://localhost:3000`
2. Register a new account, or sign in with Google
3. Create, edit, and delete tasks
4. Admins see all tasks; users see only their own + assigned

### 4. Create an Admin

Run the seed script to create the first admin:

```bash
cd backend
npm run seed
```
Creates `admin@example.com` / `admin123456`.

After logging in as admin, you can promote other users from the **Member Progress** page.

---

## API Endpoints

| Method   | Endpoint                      | Auth    | Description                     |
| -------- | ----------------------------- | ------- | ------------------------------- |
| `POST`   | `/api/auth/register`          | Public  | Register a new user             |
| `POST`   | `/api/auth/login`             | Public  | Login with email/password       |
| `POST`   | `/api/auth/google`            | Public  | Login with Google ID token      |
| `GET`    | `/api/auth/me`                | Private | Get current user profile        |
| `GET`    | `/api/auth/users`             | Admin   | List all users                  |
| `PATCH`  | `/api/auth/users/:id/promote` | Admin   | Promote a user to admin         |
| `GET`    | `/api/tasks`                  | Private | List tasks (role-filtered)      |
| `GET`    | `/api/tasks/stats`            | Admin   | Member task statistics          |
| `GET`    | `/api/tasks/:id`              | Private | Get a single task               |
| `POST`   | `/api/tasks`                  | Private | Create a task                   |
| `PUT`    | `/api/tasks/:id`              | Private | Update a task                   |
| `DELETE` | `/api/tasks/:id`              | Private | Delete a task                   |
| `GET`    | `/api/health`                 | Public  | Health check                    |

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
