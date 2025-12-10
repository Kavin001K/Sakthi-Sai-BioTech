#!/bin/bash

echo "🌱 Starting Sakthi Sai Biotech Full-Stack Application..."
echo "📦 Installing dependencies..."

# Install Python dependencies
if [ ! -d "venv" ]; then
    echo "🐍 Creating Python virtual environment..."
    python3 -m venv venv
fi

echo "📚 Activating virtual environment and installing requirements..."
. venv/bin/activate
pip install -r requirements.txt

# Install Node dependencies if needed
if [ ! -d "client/node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    cd client
    npm install
    cd ..
fi

# Build frontend
echo "🔨 Building frontend..."
cd client
npm run build
cd ..

# Start backend server
echo "🚀 Starting Flask backend server..."
. venv/bin/activate
python app.py