Team Task Manager
=================

Team Task Manager is a full-stack task and project management app built with React, Vite, Tailwind CSS, Node.js, Express, and MongoDB Atlas. It supports authentication, role-based access control, project and team management, task assignment, and a dashboard for tracking progress and overdue work.

Key Features
------------
- Signup and login with JWT authentication
- Role-based access for admin and member users
- Admin project creation and member assignment
- Task creation, assignment, status updates, and due date tracking
- Members can update the status of tasks assigned to them
- Dashboard with project, task, overdue, and completion summaries
- Production build served by Express for deployment

Tech Stack
----------
- Frontend: React, Vite, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express, Mongoose, JWT, bcryptjs
- Database: MongoDB Atlas
- Deployment: Railway or compatible Node.js hosting

Repository Structure
--------------------
team-task-manager/
  client/
  server/
  package.json

Local Setup
-----------
1. Install dependencies from the repository root:
   npm install

2. Create environment files for the server and client.

3. Configure server environment variables in server/.env:
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   CLIENT_URL=http://localhost:5173
   ADMIN_INVITE_CODE=<admin-invite-code>

4. Configure client environment variables in client/.env:
   VITE_API_URL=http://localhost:5000/api

5. Start the app:
   npm run dev

6. Open the frontend in a browser:
   http://localhost:5173

Available Scripts
-----------------
- npm run dev: start both server and client in development
- npm run dev:server: start the backend only
- npm run dev:client: start the frontend only
- npm run build: build both client and server for production
- npm start: start the production server

API Overview
------------
Authentication:
- POST /api/auth/signup
- POST /api/auth/login
- GET /api/auth/me

Projects:
- GET /api/projects
- POST /api/projects (admin only)
- GET /api/projects/:projectId
- PUT /api/projects/:projectId (admin only)
- DELETE /api/projects/:projectId (admin only)

Tasks:
- GET /api/tasks
- POST /api/tasks (admin only)
- PUT /api/tasks/:taskId
- DELETE /api/tasks/:taskId (admin only)

Dashboard:
- GET /api/dashboard

Users:
- GET /api/users (admin only)

Deployment
----------
Live application:
- Frontend: https://team-task-manager-client-production-15f2.up.railway.app/
- Backend API: https://team-task-manager-server-production-92c5.up.railway.app/api

Use Railway or another Node.js hosting provider.

Railway environment variables:
- NODE_ENV=production
- MONGODB_URI=<production-mongo-uri>
- JWT_SECRET=<production-jwt-secret>
- CLIENT_URL=https://team-task-manager-client-production-15f2.up.railway.app
- ADMIN_INVITE_CODE=<invite-code>

Build command:
  npm install && npm run build

Start command:
  npm start

Demo Flow
---------
1. Sign up as an admin using the invite code.
2. Sign up as a member user.
3. Login as admin and create a project.
4. Add team members to the project.
5. Create tasks and assign them to members.
6. Login as a member and update task status.
7. View the dashboard for progress and overdue task insights.

Notes
-----
- Admin signup requires ADMIN_INVITE_CODE.
