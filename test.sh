#!/bin/bash

echo "🧪 Testing Sakthi Sai Biotech Full Stack Integration"
echo "=================================================="

# Start backend server
echo "🚀 Starting Flask backend..."
cd /home/naveen/Sakthi-Sai-BioTech
. venv/bin/activate
python app.py &
BACKEND_PID=$!

# Wait for server to start
sleep 3

echo "📡 Testing API endpoints..."

# Test health
echo "1. Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s http://localhost:5000/api/health)
if [[ $HEALTH_RESPONSE == *"healthy"* ]]; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed"
fi

# Test user login
echo "2. Testing user login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/user-login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}')

if [[ $LOGIN_RESPONSE == *"success"* ]]; then
    echo "✅ User login works"
else
    echo "❌ User login failed"
fi

# Test admin login
echo "3. Testing admin login..."
ADMIN_LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}')

if [[ $ADMIN_LOGIN_RESPONSE == *"success"* ]]; then
    echo "✅ Admin login works"
else
    echo "❌ Admin login failed"
fi

echo ""
echo "🌐 Frontend should be available at: http://localhost:5000"
echo "🔐 Test with these credentials:"
echo "   User: user@example.com / password"
echo "   Admin: admin / admin123"
echo ""
echo "🛑 Press Ctrl+C to stop the server"

# Wait for user to stop
wait $BACKEND_PID