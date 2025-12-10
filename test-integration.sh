#!/bin/bash

echo "🧪 Testing Sakthi Sai Biotech Full-Stack Integration"
echo "=================================================="

# Base URL
BASE_URL="http://localhost:5000"

# Test 1: Health Check
echo "📋 Test 1: API Health Check"
HEALTH_RESPONSE=$(curl -s "$BASE_URL/api/health")
if [[ $HEALTH_RESPONSE == *"healthy"* ]]; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed"
    exit 1
fi

# Test 2: Frontend Serving
echo "📋 Test 2: Frontend Serving"
FRONTEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/")
if [ "$FRONTEND_RESPONSE" = "200" ]; then
    echo "✅ Frontend serving correctly (HTTP 200)"
else
    echo "❌ Frontend not serving (HTTP $FRONTEND_RESPONSE)"
    exit 1
fi

# Test 3: User Login
echo "📋 Test 3: User Login"
USER_LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/user-login" \
    -H "Content-Type: application/json" \
    -d '{"email":"user@example.com","password":"password"}')
if [[ $USER_LOGIN_RESPONSE == *"success"* ]] && [[ $USER_LOGIN_RESPONSE == *"user-token"* ]]; then
    echo "✅ User login working"
    USER_TOKEN=$(echo $USER_LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo "   Token: $USER_TOKEN"
else
    echo "❌ User login failed"
    echo "   Response: $USER_LOGIN_RESPONSE"
    exit 1
fi

# Test 4: Admin Login
echo "📋 Test 4: Admin Login"
ADMIN_LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"admin123"}')
if [[ $ADMIN_LOGIN_RESPONSE == *"success"* ]] && [[ $ADMIN_LOGIN_RESPONSE == *"admin-token"* ]]; then
    echo "✅ Admin login working"
    ADMIN_TOKEN=$(echo $ADMIN_LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo "   Token: $ADMIN_TOKEN"
else
    echo "❌ Admin login failed"
    echo "   Response: $ADMIN_LOGIN_RESPONSE"
    exit 1
fi

# Test 5: User Registration
echo "📋 Test 5: User Registration"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
    -H "Content-Type: application/json" \
    -d '{"name":"New User","email":"newuser@example.com","password":"password123"}')
if [[ $REGISTER_RESPONSE == *"success"* ]] && [[ $REGISTER_RESPONSE == *"Registration successful"* ]]; then
    echo "✅ User registration working"
else
    echo "❌ User registration failed"
    echo "   Response: $REGISTER_RESPONSE"
    exit 1
fi

# Test 6: Invalid Login
echo "📋 Test 6: Invalid Login (should fail)"
INVALID_LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/user-login" \
    -H "Content-Type: application/json" \
    -d '{"email":"invalid@example.com","password":"wrong"}')
if [[ $INVALID_LOGIN_RESPONSE == *"Invalid"* ]]; then
    echo "✅ Invalid login properly rejected"
else
    echo "❌ Invalid login not handled correctly"
    echo "   Response: $INVALID_LOGIN_RESPONSE"
    exit 1
fi

echo ""
echo "🎉 All tests passed! Full-stack integration is working correctly."
echo ""
echo "📱 Access the application at: $BASE_URL"
echo "👤 User login: user@example.com / password"
echo "🔐 Admin login: admin / admin123"
echo ""
echo "🔗 API Endpoints:"
echo "   Health: $BASE_URL/api/health"
echo "   User Registration: $BASE_URL/api/auth/register"
echo "   User Login: $BASE_URL/api/auth/user-login"
echo "   Admin Login: $BASE_URL/api/auth/login"
echo "   Products: $BASE_URL/api/products"
echo "   Blog Posts: $BASE_URL/api/blog-posts"
echo "   Export Markets: $BASE_URL/api/export-markets"
echo "   User Profile: $BASE_URL/api/user/profile"
echo "   Admin Dashboard: $BASE_URL/api/admin/dashboard"