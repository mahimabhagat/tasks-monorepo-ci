# Tasks Application (Full-Stack Monorepo)

This is a production-level, full-stack monorepo application designed to demonstrate the construction of a modern web application using React (Vite), Node.js, Express, and MongoDB. It features Docker containerization, complex GitHub Actions CI/CD workflows, PM2 ecosystem deployment, and code quality tools.

## 🏗️ Project Structure

The codebase is organized as a monorepo setup:

```
practice/
├── .github/workflows/   # CI/CD pipelines
│   └── ci.yml           # GitHub Actions workflow
├── backend/             # Node.js + Express backend API
│   ├── src/             
│   │   ├── config/      # DB connection logic
│   │   ├── controllers/ # Route handler logic (Tasks)
│   │   ├── middleware/  # Error & Request loggers
│   │   ├── models/      # Mongoose schemas
│   │   ├── routes/      # Express API routes
│   │   └── index.js     # Entry point
│   ├── .env.example     # Backend environment vars
│   ├── Dockerfile
│   └── package.json    
├── frontend/            # Vite + React frontend
│   ├── src/
│   │   ├── components/  # TaskList and CreateTask components
│   │   ├── App.jsx      # Main routing
│   │   ├── index.css    # Minimal & modern styling
│   │   └── main.jsx     # Frontend entry point
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml   # Multi-container orchestration
├── ecosystem.config.js  # PM2 cluster mode config
└── README.md
```

## 🚀 Features

### Backend
- **Express Server**: Structured cleanly with layers (Routes -> Controllers -> Models).
- **MongoDB + Mongoose**: Manages database connection and models.
- **Middleware**: Incorporates global Error Handling (to mask stack traces in production) and Request Logging using Morgan.
- **Health Check**: `GET /health` endpoint for readiness/liveness probes.

### Frontend
- **Vite & React**: Fast startup, HMR, and modern tooling.
- **Beautiful UI**: Modern, fully-responsive vanilla CSS (`index.css`) incorporating variables, flexbox, and sleek animations.
- **State & Routing**: Utilizes React Hooks (`useState`, `useEffect`) and `react-router-dom`.
- **Axios Integration**: Error capture and API responses mapping.

### DevOps & Infrastructure
- **Docker**: Multi-stage `Dockerfile` for frontend (using NGINX), backend, orchestrated via `docker-compose.yml`.
- **PM2**: `ecosystem.config.js` provided for scaling Node.js apps across cores in a VM setup.

---

## 🏃‍♂️ How to Run Locally

### Approach 1: Using Docker Compose (Recommended)
This approach spins up the database, backend, and frontend at once.

1. Build and spin up the containers:
   ```bash
   docker-compose up --build
   ```
2. Access the Apps:
   - Frontend: `http://localhost:8080`
   - Backend API: `http://localhost:3000`
   - Health check: `http://localhost:3000/health`

### Approach 2: Running Manually

1. **Start MongoDB**: Ensure you have a MongoDB instance running locally (port 27017).
2. **Setup Backend**:
   ```bash
   cd backend
   cp .env.example .env
   npm install
   npm run dev
   ```
3. **Setup Frontend**:
   ```bash
   cd frontend
   cp .env.example .env
   npm install
   npm run dev
   ```
4. Access the Frontend at `http://localhost:5173`.

---

## ⚙️ GitHub Actions CI/CD Strategy

The project contains a production-ready CI workflow located in `.github/workflows/ci.yml`.

### Caching Strategy Explained
To heavily speed up GitHub Actions in a monorepo setup, we utilize the `actions/cache@v4` action in heavily-customized steps:

1. **`npm` Global Cache (~/.npm)**:
   - **Cache Key**: `${{ runner.os }}-node20-npm-${{ hashFiles('backend/package-lock.json') }}`
   - **Explanation**: This caches the tarballs of global npm packages. If the `package-lock.json` changes, we get a new cache key.
   - **Restore Keys**: `${{ runner.os }}-node20-npm-`. This means if a completely matching cache key isn't found, it falls back to the most recent prefix match, saving download time for unchanged packages.

2. **`node_modules` Local Cache**:
   - Instead of caching the `.npm` folder, we can cache the actual `node_modules` folder directly based on the lockfile hash. This bypasses the need to run `npm ci` at all on an exact hit!
   - We conditionally run `npm ci` via `if: steps.node-modules-cache.outputs.cache-hit != 'true'`.

3. **Build Cache Output (Frontend)**:
   - Caching the `dist` directory allows subsequent deployment jobs to sidestep running a full production build if the source files (`frontend/src/**`) haven't changed.

---

## 🖥️ Deployment Guide

### Deploying to Amazon EC2 (Ubuntu)

Provision an EC2 instance with Ubuntu and execute the following:

**1. Install Dependencies**
```bash
sudo apt update && sudo apt upgrade -y
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git

# Install global PM2
sudo npm install -g pm2
```

**2. Clone the repository**
```bash
git clone https://github.com/your-username/tasks-monorepo.git /var/www/application
cd /var/www/application
```

**3. Run Backend via PM2**
```bash
cd backend
npm install
cd ..
# Use the ecosystem file to start cluster mode
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

**4. Build and Serve Frontend via Nginx**
```bash
cd frontend
npm install
npm run build

# Configure NGINX
sudo rm -rf /var/www/html/*
sudo cp -r dist/* /var/www/html/

# Restart NGINX
sudo systemctl restart nginx
```

---

## 🧪 API Testing Examples

You can easily interact with the backend API endpoints locally using `curl`:

**Check API Health:**
```bash
curl -X GET http://localhost:3000/health
```

**Create a new Task:**
```bash
curl -X POST http://localhost:3000/api/tasks \
-H "Content-Type: application/json" \
-d '{"title": "Learn Docker", "description": "Understand containerization with Express and React"}'
```

**Get all Tasks:**
```bash
curl -X GET http://localhost:3000/api/tasks
```
