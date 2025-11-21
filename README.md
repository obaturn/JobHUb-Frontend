# JobHub - Professional Job Marketplace

A full-stack job marketplace platform connecting job seekers with employers. Built with React, Express.js, and PostgreSQL.

## 🎯 Project Overview

JobHub is a comprehensive job marketplace that provides:
- **For Job Seekers**: Search jobs, apply, track applications, build profiles, take skill assessments
- **For Employers**: Post jobs, manage applications, find candidates
- **For Admins**: Moderate content, manage users, view analytics

## 📁 Project Structure

```
jobhub/
├── frontend/          # React frontend application
│   ├── components/    # React components
│   ├── pages/         # Page components
│   ├── public/        # Static assets
│   └── src/           # Source files
│
├── backend/           # Express.js backend API
│   └── src/
│       ├── config/    # Configuration files
│       ├── controllers/ # Route controllers
│       ├── database/  # Database schema & migrations
│       ├── middleware/ # Custom middleware
│       ├── routes/    # API routes
│       └── utils/     # Utility functions
│
└── README.md          # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### 1. Clone the Repository

```bash
git clone <repository-url>
cd jobhub---professional-job-marketplace
```

### 2. Setup Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your database credentials and other settings

# Run database migrations
npm run db:migrate

# Start backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Setup Frontend

```bash
# Navigate to frontend (from root)
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.local.example .env.local

# Update .env.local with your Gemini API key

# Start frontend development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## 🔧 Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=jobhub_db
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

FRONTEND_URL=http://localhost:3000
```

### Frontend Environment Variables

Create `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:5000/api
GEMINI_API_KEY=your_gemini_api_key
```

## 📚 Features

### Authentication & Authorization
- ✅ User registration with email verification
- ✅ Secure login with JWT tokens
- ✅ Password reset functionality
- ✅ Role-based access control
- ✅ Refresh token mechanism

### Job Seeker Features
- 🔍 Job search and filtering
- 📝 Job applications tracking
- 💾 Save jobs and searches
- 📄 Resume management
- 🎯 Skill assessments
- 🤝 Professional networking
- 💬 Direct messaging
- 📊 Career path explorer
- 🎤 Interview practice (AI-powered)

### Employer Features
- 📢 Post job listings
- 👥 Manage applications
- 📊 View analytics
- 💬 Message candidates

### Admin Features
- 🛡️ Job moderation
- 👤 User management
- 📈 Platform analytics

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (planned)
- **AI**: Google Gemini AI (Chatbot)
- **PWA**: Service Workers

### Backend
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT + bcrypt
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting
- **Email**: Nodemailer

## 📖 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register          - Register new user
POST   /api/auth/verify-email      - Verify email address
POST   /api/auth/login             - Login user
POST   /api/auth/refresh-token     - Refresh access token
POST   /api/auth/forgot-password   - Request password reset
POST   /api/auth/reset-password    - Reset password
GET    /api/auth/me                - Get current user (Protected)
PUT    /api/auth/change-password   - Change password (Protected)
POST   /api/auth/logout            - Logout user (Protected)
```

See `backend/README.md` for detailed API documentation.

## 🗄️ Database Schema

Key tables:
- `users` - User accounts and profiles
- `jobs` - Job listings
- `applications` - Job applications
- `companies` - Company profiles
- `skills` - User skills
- `experience` - Work experience
- `education` - Educational background
- `resumes` - Resume files
- `messages` - Direct messages
- `notifications` - User notifications
- `connections` - Professional network

See `backend/src/database/schema.sql` for complete schema.

## 🔐 Security

- Password hashing with bcrypt (10 salt rounds)
- JWT token authentication
- Email verification required
- Rate limiting (100 req/15min)
- Input validation and sanitization
- SQL injection protection
- CORS protection
- Security headers with Helmet

## 📱 Progressive Web App (PWA)

The frontend is PWA-enabled with:
- Service worker for offline functionality
- Installable on devices
- App manifest for native-like experience

## 🧪 Testing

```bash
# Backend tests (coming soon)
cd backend
npm test

# Frontend tests (coming soon)
cd frontend
npm test
```

## 📦 Deployment

### Backend Deployment

1. Set environment to production
2. Update database credentials
3. Set strong JWT secrets
4. Configure email service
5. Deploy to your preferred platform (Heroku, Railway, AWS, etc.)

### Frontend Deployment

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy `dist` folder to hosting service (Vercel, Netlify, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

ISC

## 👨‍💻 Support

For support, email support@jobhub.com or create an issue in the repository.

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js community
- PostgreSQL team
- All open-source contributors

---

**Happy Job Hunting! 🎯**