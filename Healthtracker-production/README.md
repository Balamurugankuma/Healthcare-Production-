# 🏥 Health Tracker — Production Setup

## Stack
- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **AI**: Groq (llama3-8b-8192)

---

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd health-backend
npm install
cp .env.example .env
# Edit .env and fill in your keys
npm start
```

### 2. Frontend Setup

```bash
cd health-frontend
npm install
cp .env.example .env
# Edit .env and set REACT_APP_API_URL
npm start
```

---

## 🔑 Environment Variables

### Backend (`health-backend/.env`)

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT tokens (use a long random string) |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `7d`) |
| `GROQ_API_KEY` | Get from https://console.groq.com |
| `PORT` | Server port (default `5000`) |
| `NODE_ENV` | `production` or `development` |
| `ALLOWED_ORIGINS` | Comma-separated frontend URLs for CORS |

### Frontend (`health-frontend/.env`)

| Variable | Description |
|---|---|
| `REACT_APP_API_URL` | Full URL to backend API (e.g. `https://api.yourdomain.com/api`) |

---

## 🌐 Deploying

### Backend → Render / Railway / Fly.io
1. Push backend folder to GitHub
2. Create a new Web Service
3. Set environment variables from `.env.example`
4. Build command: `npm install`
5. Start command: `npm start`

### Frontend → Vercel / Netlify
1. Push frontend folder to GitHub
2. Set `REACT_APP_API_URL` to your deployed backend URL
3. Build command: `npm run build`
4. Output directory: `build`

---

## 🔒 Security Notes
- Never commit `.env` files
- Use a strong `JWT_SECRET` (32+ characters)
- Keep `GROQ_API_KEY` server-side only (never expose to frontend)
