# Sakthi Sai BioTech - Full-Stack Application

A complete full-stack web application for Sakthi Sai BioTech with React frontend and Flask backend.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- Python 3.8+
- pip

### Setup and Run

1. **Clone and navigate to the project:**
   ```bash
   cd Sakthi-Sai-BioTech
   ```

2. **Run the startup script:**
   ```bash
   ./start.sh
   ```

3. **Access the application:**
   - Frontend: http://localhost:5000
   - API Health: http://localhost:5000/api/health

### Manual Setup

1. **Install Python dependencies:**
   ```bash
   python3 -m venv venv
   . venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Install Node dependencies:**
   ```bash
   cd client
   npm install
   ```

3. **Build the frontend:**
   ```bash
   npm run build
   cd ..
   ```

4. **Start the server:**
   ```bash
   . venv/bin/activate
   python app.py
   ```

## 🔐 Authentication

### User Login
- **Email:** user@example.com
- **Password:** password

### Admin Login
- **Username:** admin
- **Password:** admin123

### Alternative User Account
- **Email:** distributor@example.com
- **Password:** password

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/user-login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### User Endpoints
- `GET /api/user/profile` - User profile
- `GET /api/user/orders` - User orders

### Content APIs
- `GET /api/products` - Products catalog (7 products)
- `GET /api/blog-posts` - Blog posts and resources
- `GET /api/export-markets` - Export markets data

### Admin Endpoints
- `GET /api/admin/dashboard` - Admin dashboard
- `GET /api/admin/users` - User management

### System
- `GET /api/health` - Health check

## 🧪 Testing

Run the integration test suite:
```bash
./test-integration.sh
```

This will test:
- API health check
- Frontend serving
- User login functionality
- Admin login functionality
- User registration functionality
- Content APIs (products, blog posts, export markets)
- Invalid login handling

## 📁 Project Structure

```
Sakthi-Sai-BioTech/
├── app.py                 # Flask backend server
├── requirements.txt       # Python dependencies
├── start.sh              # Startup script
├── test-integration.sh   # Integration tests
├── venv/                 # Python virtual environment
├── dist/public/          # Built frontend assets
└── client/               # React frontend
    ├── src/
    │   ├── components/   # React components
    │   ├── contexts/     # React contexts
    │   ├── hooks/        # Custom hooks
    │   ├── locales/      # Internationalization
    │   └── lib/          # Utilities
    ├── public/           # Static assets
    └── package.json      # Node dependencies
```

## 🌐 Features

- **Multilingual Support:** English, Indonesian, Amharic
- **Responsive Design:** Mobile-first approach
- **User Authentication:** Secure login system
- **Admin Dashboard:** Administrative interface
- **API Integration:** RESTful backend
- **Modern UI:** Beautiful, interactive components

## 🔧 Development

### Frontend Development
```bash
cd client
npm run dev
```

### Backend Development
```bash
. venv/bin/activate
python app.py
```

## 📝 Notes

- The Flask server serves both the API and the built React frontend
- Static files are served from the `dist/public/` directory
- Session management is handled by Flask
- CORS is enabled for API requests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run the integration tests
5. Submit a pull request