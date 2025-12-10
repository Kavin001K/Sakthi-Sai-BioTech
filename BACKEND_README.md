# Sakthi Sai Biotech - Backend Setup

## Quick Start

### 1. Install Dependencies
```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python packages
pip install -r requirements.txt
```

### 2. Run the Application

#### Option 1: Use the startup script (Recommended)
```bash
./start.sh
```

#### Option 2: Manual start
```bash
# Build frontend first
cd client
npm install
npm run build
cd ..

# Start backend
source venv/bin/activate
python app.py
```

### 3. Access the Application
- **Website**: http://localhost:5000
- **API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/user-login` - User login  
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Admin Endpoints (Requires admin role)
- `GET /api/admin/dashboard` - Dashboard data
- `GET /api/admin/users` - User management

### User Endpoints (Requires login)
- `GET /api/user/profile` - User profile
- `GET /api/user/orders` - User orders

## Demo Credentials

### Admin Login
- **Username**: admin
- **Password**: admin123

### User Login
- **Email**: user@example.com
- **Password**: password
- **OR**: distributor@example.com / password

## Features

✅ **User Authentication**
- Login/logout functionality
- Session management
- Role-based access control

✅ **Admin Panel**
- Dashboard with statistics
- User management
- Protected routes

✅ **User Portal**
- Profile management
- Order history
- Secure authentication

✅ **Integration**
- Frontend-backend integration
- CORS enabled
- Static file serving

## Development

The Flask backend serves both the API and the built React frontend from the same server, making deployment simple and clean.