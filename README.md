# 🎓 CampusX - Campus Event Discovery Portal

A full-stack web application that helps students discover and manage events happening in their college campus.

## ✨ Features

### Core Features
- 🔐 **JWT Authentication** - Secure signup/login with role-based access
- 👤 **Student Profiles** - Skills, interests, clubs, events attended
- 🏛️ **Clubs System** - Create/join clubs with categories (technical, cultural, sports, etc.)
- 📅 **Event Management** - Full CRUD for events with rich details
- 🔍 **Event Discovery** - Search, filter by category/club/tags, sort by popularity/date
- 🗺️ **Interactive Campus Map** - Leaflet map with event markers and venue labels
- 🔖 **Bookmarks & Interests** - Save and track events you care about
- 📊 **Student Dashboard** - Registered events, bookmarks, recommendations, club memberships
- ⚙️ **Admin Panel** - Create/edit/delete events, view registrations
- 🎯 **Recommendation Engine** - Personalized event suggestions based on interests

### Additional Features
- ⏳ Event countdown timer
- 📆 Calendar view with event indicators
- 📱 QR code check-in for events
- 🔥 Trending events section
- 🏆 Club leaderboard (most active clubs)
- 🌓 Dark/Light mode toggle
- 📱 Fully responsive design
- ✨ Glassmorphism UI with smooth animations

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router |
| Styling | Custom CSS with Glassmorphism |
| Maps | Leaflet + OpenStreetMap |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth | JWT + bcrypt |
| Calendar | react-calendar |
| Icons | react-icons |

## 📁 Project Structure

```
EventPortal/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── eventController.js
│   │   ├── clubController.js
│   │   └── bookmarkController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Club.js
│   │   ├── Event.js
│   │   ├── Registration.js
│   │   └── Bookmark.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── clubRoutes.js
│   │   └── bookmarkRoutes.js
│   ├── seed.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── EventCard.jsx
│   │   │   └── CountdownTimer.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── EventDetail.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Clubs.jsx
│   │   │   ├── ClubDetail.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── CampusMap.jsx
│   │   │   ├── CalendarView.jsx
│   │   │   └── AdminPanel.jsx
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

Edit `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/campusx
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
```

### 3. Seed the Database

```bash
cd backend
node seed.js
```

This creates sample data with these login credentials:
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@campus.edu | admin123 |
| Club Admin | rahul@campus.edu | student123 |
| Student | aarav@campus.edu | student123 |

### 4. Run the Application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get profile |
| PUT | /api/auth/profile | Update profile |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/events | List events (with filters) |
| GET | /api/events/trending | Trending events |
| GET | /api/events/:id | Event details |
| POST | /api/events | Create event (admin) |
| PUT | /api/events/:id | Update event (admin) |
| DELETE | /api/events/:id | Delete event (admin) |
| POST | /api/events/:id/register | Register for event |
| POST | /api/events/:id/interested | Toggle interest |
| POST | /api/events/:id/checkin | QR check-in |

### Clubs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/clubs | List clubs |
| GET | /api/clubs/leaderboard | Club leaderboard |
| GET | /api/clubs/:id | Club details |
| POST | /api/clubs | Create club |
| POST | /api/clubs/:id/join | Join club |
| DELETE | /api/clubs/:id/join | Leave club |

### Bookmarks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/bookmarks | User bookmarks |
| POST | /api/bookmarks/:eventId | Toggle bookmark |

## 🌐 Deployment

### Backend (Render/Railway)
1. Push to GitHub
2. Connect to Render/Railway
3. Set environment variables
4. Deploy with `npm start`

### Frontend (Vercel)
1. Push to GitHub
2. Connect to Vercel
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add env variable `VITE_API_URL` pointing to backend URL

## 📄 License
MIT
