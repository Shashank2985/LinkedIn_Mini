# Mini LinkedIn - Community Platform

A full-stack MERN application that replicates core LinkedIn functionality including user authentication, profile management, and social posting.

## 🚀 Features

### ✅ Completed Features
- **User Authentication**
  - Register/Login with email & password
  - JWT-based authentication with httpOnly cookies
  - Secure password hashing with bcrypt
  - Protected routes with middleware

- **User Profiles**
  - Profile with name, email, and bio
  - View own profile and other users' profiles
  - Edit profile functionality
  - Profile route supports both `/profile` (own) and `/profile/:userId` (others)
  - Upload and set profile as well background cover photo

- **Post Management**
  - Create text-only posts
  - Public post feed with author names and timestamps
  - View all posts by a specific user
  - Real-time post display
  - User can delete their specific posts

- **Modern UI/UX**
  - Responsive design with Tailwind CSS
  - Clean, professional interface
  - Loading states and error handling
  - Mobile-friendly layout

## 🛠 Tech Stack

### Frontend
- **React.js** - UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin requests

## 📁 Project Structure

```
mini-linkedin/
├── backend/
│   ├── config/
│   │   └── db.js              # Database connection
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   ├── postController.js  # Post management
│   │   └── userController.js  # User profile management
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT verification
│   ├── models/
│   │   ├── User.js           # User schema
│   │   └── Post.js           # Post schema
│   ├── routes/
│   │   ├── authRoutes.js     # Auth endpoints
│   │   ├── postRoutes.js     # Post endpoints
│   │   └── userRoutes.js     # User endpoints
│   ├── .env                  # Environment variables
│   ├── index.js              # Server entry point
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AuthForm.jsx      # Login/Register form
    │   │   ├── CreatePostForm.jsx # Post creation
    │   │   ├── EditProfileForm.jsx # Profile editing
    │   │   ├── Navbar.jsx        # Navigation
    │   │   ├── PostCard.jsx      # Post display
    │   │   └── ProfileCard.jsx   # Profile display
    │   ├── context/
    │   │   └── AuthContext.jsx   # Authentication state
    │   ├── pages/
    │   │   ├── Home.jsx          # Main feed
    │   │   ├── Login.jsx         # Login page
    │   │   ├── Register.jsx      # Registration page
    │   │   ├── Profile.jsx       # Profile page
    │   │   └── EditProfile.jsx   # Profile editing
    │   ├── utils/
    │   │   └── api.js            # API utilities
    │   └── App.jsx               # Main app component
    └── package.json
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mini-linkedin
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Variables**
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   FRONTEND_URL=http://localhost:5173
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server will run on http://localhost:5000

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Application will run on http://localhost:5173

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post (protected)

### Users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/me` - Update own profile (protected)
- `GET /api/users/:id/posts` - Get posts by user

## 🔐 Security Features

- **JWT Authentication** with httpOnly cookies
- **Password Hashing** with bcrypt
- **CORS Configuration** for secure cross-origin requests
- **Protected Routes** with authentication middleware
- **Input Validation** and error handling

## 🎨 UI Features

- **Responsive Design** - Works on all device sizes
- **Loading States** - Smooth user experience
- **Error Handling** - User-friendly error messages
- **Modern Styling** - Clean, professional appearance
- **Interactive Elements** - Hover effects and transitions

## 🚀 Deployment Ready

The application is configured for easy deployment:
- Environment variable support
- Production-ready build scripts
- CORS configuration for different environments
- Secure cookie settings for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ using the MERN stack**
