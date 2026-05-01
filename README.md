# Team Task Manager

**Team Task Manager** is a full-stack task and project tracker built with React, Vite, Tailwind CSS, Node.js, Express, and MongoDB Atlas. It supports authentication, role-based access control, project/team management, task assignment, and a dashboard for tracking progress and overdue work.

## Key Features

- Signup and login with JWT authentication
- Role-based access for `admin` and `member`
- Admin-only project creation and member assignment
- Task creation, assignment, status updates, and due date tracking
- Member access to update assigned task status
- Dashboard summarizing projects, tasks, task status counts, overdue items, and recent activity
- Production-ready build with Express serving the frontend

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express, Mongoose, JWT, bcryptjs
- Database: MongoDB Atlas
- Deployment: Railway

## Live Demo

- Frontend: https://team-task-manager-client-production-15f2.up.railway.app/
- Backend API: https://team-task-manager-server-production-92c5.up.railway.app/api

## Repository Structure

```text
team-task-manager/
  client/
    package.json
    src/
  server/
    package.json
    src/
  package.json
```

## Local Setup

1. Install dependencies from the root:

```bash
npm install
```

2. Create environment files for server and client.

3. Configure server environment variables in `server/.env`:

- `NODE_ENV=development`
- `PORT=5000`
- `MONGODB_URI=<your-mongodb-connection-string>`
- `JWT_SECRET=<your-jwt-secret>`
- `CLIENT_URL=http://localhost:5173`
- `ADMIN_INVITE_CODE=<admin-invite-code>`

4. Configure client environment variables in `client/.env`:

- `VITE_API_URL=http://localhost:5000/api`

5. Start the app:

```bash
npm run dev
```

6. Open the frontend in your browser:

- `http://localhost:5173`

## Available Scripts

From the repository root:

- `npm run dev` — start both server and client in development
- `npm run dev:server` — start the backend only
- `npm run dev:client` — start the frontend only
- `npm run build` — build both client and server for production
- `npm start` — start the production server

In `client/`:

- `npm run dev` — start Vite development server
- `npm run build` — build the frontend for production
- `npm run preview` — preview the built frontend

In `server/`:

- `npm run dev` — start the Express server
- `npm run build` — run production build logic if needed
- `npm start` — start the server in production mode

## API Endpoints

### Authentication

- `POST /api/auth/signup` — register a new user
- `POST /api/auth/login` — login and receive a JWT
- `GET /api/auth/me` — get current authenticated user

### Projects

- `GET /api/projects` — list projects
- `POST /api/projects` — create project (`admin` only)
- `GET /api/projects/:projectId` — get project details and tasks
- `PUT /api/projects/:projectId` — update project (`admin` only)
- `DELETE /api/projects/:projectId` — delete project (`admin` only)

### Tasks

- `GET /api/tasks` — list tasks
- `POST /api/tasks` — create task (`admin` only)
- `PUT /api/tasks/:taskId` — update task (admin or assignee)
- `DELETE /api/tasks/:taskId` — delete task (`admin` only)

### Dashboard

- `GET /api/dashboard` — fetch dashboard summary and task lists

### Users

- `GET /api/users` — list users (`admin` only)

## Deployment Notes

This project is ready for deployment with Railway or any Node.js host. The backend serves the production build of the frontend from `client/dist`.

Deploy using the following Railway settings:

- `NODE_ENV=production`
- `MONGODB_URI=<production-mongo-uri>`
- `JWT_SECRET=<production-jwt-secret>`
- `CLIENT_URL=<railway-app-url>`
- `ADMIN_INVITE_CODE=<invite-code>`

Build command:

```bash
npm install && npm run build
```

Start command:

```bash
npm start
```

## Demo Flow

1. Sign up as an admin using the invite code.
2. Sign up another user as a member.
3. Login as admin, create a project, and assign members.
4. Create tasks inside the project and assign them.
5. Login as member and update task status.
6. Check the dashboard for project and task summaries.

## Notes

- Admin signup is protected by `ADMIN_INVITE_CODE`.
