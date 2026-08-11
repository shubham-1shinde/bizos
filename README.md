# BizOS - AI-Powered Business Operating System

BizOS is an enterprise-grade AI-powered Business Operating System for SMEs that centralizes Sales, Inventory, Finance, GST & Compliance, Customer Intelligence, Employee Performance, AI Forecasting, What-if Simulations, Automation Workflows, and System Integrations.

---

## Architecture Overview

```
Frontend (React + Vite + TypeScript + Tailwind CSS)
    ↓ REST APIs
Backend (Node.js + Express + TypeScript + Mongoose)
    ↓ REST APIs
Python FastAPI Service (Pandas + Scikit-learn ML Engine)
    ↓
MongoDB (Single Database Instance with Company Data Isolation)
```

---

## Services & Ports

- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`
- **AI/ML Service**: `http://localhost:8000`
- **MongoDB**: `mongodb://localhost:27017/bizos`

---

## Quick Start & Installation

### 1. Backend Setup
```bash
cd backend
npm install
npm run seed     # Populate rich demo data (Company, 5 Users, 20 SKUs, Sales, GST, etc.)
npm run dev      # Starts Express backend on port 5000
```

### 2. AI Python Service Setup
```bash
cd ai-service
pip install -r requirements.txt
python main.py   # Starts FastAPI server on port 8000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev      # Starts Vite React application on port 5173
```

---

## Demo Credentials

- **Email**: `owner@apex.com`
- **Password**: `password123`
- **Company**: Apex Innovations Pvt Ltd

---

## Environment Variables (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bizos
JWT_SECRET=super_secret_jwt_key_bizos_2026
AI_SERVICE_URL=http://localhost:8000
```
