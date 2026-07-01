# 🚀 Priyansh Rajput — MERN Portfolio

A **100% production-ready, enterprise-grade Full Stack MERN Portfolio** with a premium Admin Dashboard, built by Priyansh Rajput.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite) — Lightning-fast dev builds
- **Tailwind CSS** — Utility-first styling
- **Framer Motion** — Premium animations
- **React Router DOM** — Client-side routing
- **Axios** — HTTP client with JWT interceptors
- **React Hook Form** — Form management
- **React Hot Toast** — Beautiful notifications
- **Swiper.js** — Testimonial carousel
- **TSParticles** — Hero particle effects
- **Recharts** — Admin analytics charts
- **Typewriter Effect** — Hero typing animation

### Backend
- **Node.js + Express.js** — REST API
- **MongoDB Atlas + Mongoose** — Database & ODM
- **JWT** — Authentication
- **bcrypt** — Password hashing
- **Multer + Cloudinary** — File & image uploads
- **Nodemailer** — Email notifications
- **Helmet, Rate Limiting, Sanitization** — Security

---

## 📁 Project Structure

```
MERN Portfolio/
├── client/                # React (Vite) Frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Public + Admin pages
│   │   ├── layouts/       # MainLayout & AdminLayout
│   │   ├── context/       # AuthContext
│   │   ├── hooks/         # Custom React hooks
│   │   ├── config/        # Axios API instance
│   │   └── utils/         # Animation variants
│   └── public/            # Static assets
└── server/                # Node.js + Express Backend
    ├── controllers/       # Business logic (12 modules)
    ├── models/            # Mongoose schemas (13 models)
    ├── routes/            # Express routes (12 routers)
    ├── middleware/        # Auth, upload, rate limit, validation
    ├── services/          # Email & Cloudinary services
    ├── utils/             # Helpers & constants
    └── config/            # DB, CORS, Cloudinary config
```

---

## ⚡ Getting Started

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd "MERN Portfolio"
npm run install-all
```

### 2. Configure Environment Variables

**Server** — Copy `server/.env.example` to `server/.env` and fill in:
- `MONGODB_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — Strong random secret (32+ chars)
- `CLOUDINARY_*` — Cloudinary credentials
- `EMAIL_*` — Gmail SMTP / App Password

### 3. Create Admin Account

```bash
# Start the server and call the register API once:
POST http://localhost:5000/api/auth/register
{
  "name": "Priyansh Rajput",
  "email": "admin@email.com",
  "password": "StrongPassword123"
}
```
After registering, **delete the register route or protect it** to prevent abuse.

### 4. Start Development

```bash
npm run dev
```

This runs both server (`:5000`) and client (`:5173`) concurrently.

### 5. Access

- **Portfolio** → http://localhost:5173
- **Admin Dashboard** → http://localhost:5173/admin/login
- **API Health** → http://localhost:5000/api/health

---

## 🚢 Deployment

| Service | Platform |
|---------|----------|
| Frontend | Vercel |
| Backend | Render / Railway |
| Database | MongoDB Atlas |
| Files | Cloudinary |
| Email | Gmail SMTP |

---

## 📞 Contact

- **GitHub**: [priyanshrajput](https://github.com/priyanshrajput)
- **LinkedIn**: [priyansh-rajput](https://linkedin.com/in/priyansh-rajput)
- **Email**: priyanshrajput@gmail.com

---

Built with ❤️ by **Priyansh Rajput**
