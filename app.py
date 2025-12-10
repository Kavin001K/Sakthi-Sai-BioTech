from flask import Flask, request, jsonify, session, send_from_directory
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import os
import json
from datetime import datetime, timedelta
from functools import wraps

app = Flask(__name__, static_folder='dist/public', static_url_path='')
app.secret_key = 'sakthi-sai-biotech-secret-key-2024'
CORS(app, supports_credentials=True)

# Sample data storage (in production, use a proper database)
users = {
    'admin': {
        'id': 'admin-1',
        'username': 'admin',
        'email': 'admin@sakthisaibiotech.com',
        'password_hash': generate_password_hash('admin123'),
        'role': 'admin',
        'name': 'Administrator',
        'created_at': '2024-01-01'
    }
}

# Sample user database
user_accounts = [
    {
        'id': 'user-1',
        'email': 'user@example.com',
        'password_hash': generate_password_hash('password'),
        'role': 'user',
        'name': 'Customer User',
        'created_at': '2024-01-15'
    },
    {
        'id': 'user-2', 
        'email': 'distributor@example.com',
        'password_hash': generate_password_hash('password'),
        'role': 'user',
        'name': 'Distributor Account',
        'created_at': '2024-02-01'
    }
]

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        user = next((u for u in users.values() if u['id'] == session['user_id']), None)
        if not user or user['role'] != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated_function

@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Username and password required'}), 400
        
        # Check admin users
        if username in users:
            user = users[username]
            if check_password_hash(user['password_hash'], password):
                session['user_id'] = user['id']
                session['username'] = user['username']
                session['role'] = user['role']
                session.permanent = True
                return jsonify({
                    'success': True,
                    'token': f'admin-token-{user["id"]}',
                    'user': {
                        'id': user['id'],
                        'username': user['username'],
                        'email': user['email'],
                        'role': user['role'],
                        'name': user['name']
                    }
                })
        
        return jsonify({'error': 'Invalid credentials'}), 401
        
    except Exception as e:
        return jsonify({'error': 'Login failed'}), 500

@app.route('/api/auth/user-login', methods=['POST'])
def user_login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400
        
        # Check user accounts
        user = next((u for u in user_accounts if u['email'] == email), None)
        if user and check_password_hash(user['password_hash'], password):
            session['user_id'] = user['id']
            session['email'] = user['email']
            session['role'] = user['role']
            session.permanent = True
            return jsonify({
                'success': True,
                'token': f'user-token-{user["id"]}',
                'user': {
                    'id': user['id'],
                    'username': user['email'],
                    'email': user['email'],
                    'role': user['role'],
                    'name': user['name']
                }
            })
        
        return jsonify({'error': 'Invalid email or password'}), 401
        
    except Exception as e:
        return jsonify({'error': 'Login failed'}), 500

@app.route('/api/auth/me', methods=['GET'])
@login_required
def get_current_user():
    user_id = session.get('user_id')
    
    # Check admin users
    if user_id and user_id.startswith('admin'):
        user = users.get(session.get('username'))
        if user:
            return jsonify({
                'user': {
                    'id': user['id'],
                    'username': user['username'],
                    'email': user['email'],
                    'role': user['role'],
                    'name': user['name']
                }
            })
    
    # Check regular users
    user = next((u for u in user_accounts if u['id'] == user_id), None)
    if user:
        return jsonify({
            'user': {
                'id': user['id'],
                'username': user['email'],
                'email': user['email'],
                'role': user['role'],
                'name': user['name']
            }
        })
    
    return jsonify({'error': 'User not found'}), 404

@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        
        if not name or not email or not password:
            return jsonify({'error': 'Name, email, and password are required'}), 400
        
        # Check if email already exists
        existing_user = next((u for u in user_accounts if u['email'] == email), None)
        if existing_user:
            return jsonify({'error': 'Email already registered'}), 400
        
        # Create new user
        new_user = {
            'id': f'user-{len(user_accounts) + 3}',
            'email': email,
            'password_hash': generate_password_hash(password),
            'role': 'user',
            'name': name,
            'created_at': datetime.now().strftime('%Y-%m-%d')
        }
        
        user_accounts.append(new_user)
        
        return jsonify({
            'success': True,
            'message': 'Registration successful',
            'user': {
                'id': new_user['id'],
                'email': new_user['email'],
                'name': new_user['name'],
                'role': new_user['role']
            }
        })
        
    except Exception as e:
        return jsonify({'error': 'Registration failed'}), 500

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'success': True, 'message': 'Logged out successfully'})

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

# Products API
@app.route('/api/products', methods=['GET'])
def get_products():
    products = [
        {
            'id': 'prod-1',
            'name': 'Bactowin',
            'category': 'plant-growth-promotor',
            'description': 'Advanced plant growth promoter with beneficial microorganisms',
            'specifications': {
                'Formulation': 'Liquid Concentrate',
                'Active Ingredients': 'Beneficial Bacteria & Fungi',
                'Application Rate': '2-3 ml/L water',
                'Shelf Life': '2 years'
            },
            'imageUrl': '/Bactowin.jpeg',
            'suitableCrops': ['Rice', 'Wheat', 'Cotton', 'Vegetables'],
            'packingSizes': ['100ml', '250ml', '500ml', '1L'],
            'isActive': True
        },
        {
            'id': 'prod-2',
            'name': 'Cito Max',
            'category': 'bactericide-fungicide',
            'description': 'Broad spectrum bactericide and fungicide for crop protection',
            'specifications': {
                'Formulation': 'WP (Wettable Powder)',
                'Active Ingredients': 'Copper Oxychloride',
                'Application Rate': '2-3 g/L water',
                'Shelf Life': '3 years'
            },
            'imageUrl': '/Cito max.jpeg',
            'suitableCrops': ['Tomato', 'Chilli', 'Grapes', 'Mango'],
            'packingSizes': ['100g', '250g', '500g', '1kg'],
            'isActive': True
        },
        {
            'id': 'prod-3',
            'name': 'Excl Power',
            'category': 'micronutrients',
            'description': 'Complete micronutrient fertilizer for optimal plant growth',
            'specifications': {
                'Formulation': 'Granules',
                'NPK Content': '20-20-20 + TE',
                'Micronutrients': 'Zn, Fe, Mn, B, Cu, Mo',
                'Application Rate': '50-100 kg/acre'
            },
            'imageUrl': '/Excl Power.jpeg',
            'suitableCrops': ['All Crops'],
            'packingSizes': ['5kg', '10kg', '25kg', '50kg'],
            'isActive': True
        },
        {
            'id': 'prod-4',
            'name': 'Humic Pow',
            'category': 'liquid-fertilizer',
            'description': 'Organic humic acid based liquid fertilizer',
            'specifications': {
                'Formulation': 'Liquid',
                'Humic Acid': '12%',
                'Fulvic Acid': '3%',
                'Application Rate': '2-3 ml/L water'
            },
            'imageUrl': '/Humic Pow.jpeg',
            'suitableCrops': ['All Crops'],
            'packingSizes': ['500ml', '1L', '5L', '10L'],
            'isActive': True
        },
        {
            'id': 'prod-5',
            'name': 'K-Max',
            'category': 'liquid-fertilizer',
            'description': 'Potassium rich liquid fertilizer for fruit development',
            'specifications': {
                'Formulation': 'Liquid',
                'Potassium (K2O)': '50%',
                'Application Rate': '1-2 ml/L water'
            },
            'imageUrl': '/K- Max.jpeg',
            'suitableCrops': ['Fruits', 'Vegetables', 'Flowers'],
            'packingSizes': ['500ml', '1L', '5L'],
            'isActive': True
        },
        {
            'id': 'prod-6',
            'name': 'Micro Max 2',
            'category': 'micronutrients',
            'description': 'Advanced micronutrient blend with chelated minerals',
            'specifications': {
                'Formulation': 'Granules',
                'Micronutrients': 'EDTA Chelated Zn, Fe, Mn, Cu',
                'Application Rate': '5-10 kg/acre'
            },
            'imageUrl': '/Micro Max 2.jpeg',
            'suitableCrops': ['Cereals', 'Pulses', 'Oilseeds'],
            'packingSizes': ['5kg', '10kg', '25kg'],
            'isActive': True
        },
        {
            'id': 'prod-7',
            'name': 'Win-choke',
            'category': 'pesticides',
            'description': 'Effective weed control for broadleaf weeds',
            'specifications': {
                'Formulation': 'EC (Emulsifiable Concentrate)',
                'Active Ingredients': 'Selective Herbicide',
                'Application Rate': '1-2 ml/L water'
            },
            'imageUrl': '/Win-choke.jpeg',
            'suitableCrops': ['Rice', 'Wheat', 'Soybean'],
            'packingSizes': ['100ml', '250ml', '500ml', '1L'],
            'isActive': True
        }
    ]
    return jsonify(products)

# Blog Posts API
@app.route('/api/blog-posts', methods=['GET'])
def get_blog_posts():
    blog_posts = [
        {
            'id': 'blog-1',
            'title': 'Modern Agricultural Practices for Sustainable Farming',
            'slug': 'modern-agricultural-practices',
            'content': 'In today\'s rapidly evolving agricultural landscape, sustainable farming practices have become more important than ever...',
            'excerpt': 'Discover how modern agricultural practices are revolutionizing sustainable farming for better yields and environmental protection.',
            'category': 'Sustainable Farming',
            'imageUrl': '/cotton-farming.png',
            'isPublished': True,
            'publishedAt': '2024-12-01',
            'authorId': 'admin-1',
            'metaTitle': 'Modern Agricultural Practices | Sakthi Sai BioTech',
            'metaDescription': 'Learn about sustainable farming practices and modern agricultural techniques for better crop yields.'
        },
        {
            'id': 'blog-2',
            'title': 'The Role of Micronutrients in Crop Nutrition',
            'slug': 'micronutrients-crop-nutrition',
            'content': 'Micronutrients play a crucial role in plant development and overall crop health...',
            'excerpt': 'Understanding the importance of micronutrients for optimal crop growth and yield improvement.',
            'category': 'Crop Nutrition',
            'imageUrl': '/micronutrients.png',
            'isPublished': True,
            'publishedAt': '2024-11-28',
            'authorId': 'admin-1',
            'metaTitle': 'Micronutrients in Crop Nutrition | Sakthi Sai BioTech',
            'metaDescription': 'Essential guide to micronutrients and their role in modern crop nutrition and plant health.'
        },
        {
            'id': 'blog-3',
            'title': 'Integrated Pest Management Best Practices',
            'slug': 'integrated-pest-management',
            'content': 'Integrated Pest Management (IPM) is an ecosystem-based strategy that focuses on long-term prevention...',
            'excerpt': 'Comprehensive guide to implementing integrated pest management for sustainable agriculture.',
            'category': 'Pest Management',
            'imageUrl': '/cotton-farming-generated.png',
            'isPublished': True,
            'publishedAt': '2024-11-25',
            'authorId': 'admin-1',
            'metaTitle': 'Integrated Pest Management | Sakthi Sai BioTech',
            'metaDescription': 'Best practices for integrated pest management in modern agriculture and farming.'
        }
    ]
    return jsonify(blog_posts)

# Export Markets API
@app.route('/api/export-markets', methods=['GET'])
def get_export_markets():
    export_markets = [
        {
            'id': 'market-1',
            'country': 'United States',
            'countryCode': 'US',
            'description': 'Major market for agricultural inputs with strong demand for quality products',
            'productCount': 15,
            'shipmentFrequency': 'Weekly',
            'isActive': True,
            'flagIcon': '🇺🇸'
        },
        {
            'id': 'market-2',
            'country': 'Brazil',
            'countryCode': 'BR',
            'description': 'Leading agricultural market with extensive farming operations',
            'productCount': 12,
            'shipmentFrequency': 'Bi-weekly',
            'isActive': True,
            'flagIcon': '🇧🇷'
        },
        {
            'id': 'market-3',
            'country': 'India',
            'countryCode': 'IN',
            'description': 'Large agricultural sector with growing demand for advanced inputs',
            'productCount': 18,
            'shipmentFrequency': 'Weekly',
            'isActive': True,
            'flagIcon': '🇮🇳'
        },
        {
            'id': 'market-4',
            'country': 'Australia',
            'countryCode': 'AU',
            'description': 'Advanced agricultural market with focus on sustainable farming',
            'productCount': 10,
            'shipmentFrequency': 'Monthly',
            'isActive': True,
            'flagIcon': '🇦🇺'
        },
        {
            'id': 'market-5',
            'country': 'Kenya',
            'countryCode': 'KE',
            'description': 'Growing agricultural market in East Africa region',
            'productCount': 8,
            'shipmentFrequency': 'Bi-weekly',
            'isActive': True,
            'flagIcon': '🇰🇪'
        },
        {
            'id': 'market-6',
            'country': 'Netherlands',
            'countryCode': 'NL',
            'description': 'European hub for agricultural distribution and innovation',
            'productCount': 14,
            'shipmentFrequency': 'Weekly',
            'isActive': True,
            'flagIcon': '🇳🇱'
        }
    ]
    return jsonify(export_markets)

# Admin endpoints
@app.route('/api/admin/dashboard', methods=['GET'])
@admin_required
def admin_dashboard():
    return jsonify({
        'stats': {
            'inquiries': 156,
            'leads': 89,
            'products': 45,
            'countries': 23
        },
        'recent_activity': [
            {'type': 'login', 'user': 'admin', 'time': '2024-12-08 18:30:00'},
            {'type': 'quote_request', 'customer': 'John Doe', 'time': '2024-12-08 17:45:00'},
            {'type': 'product_view', 'product': 'Zinc Sulphate', 'time': '2024-12-08 16:20:00'}
        ]
    })

@app.route('/api/admin/users', methods=['GET'])
@admin_required
def get_users():
    return jsonify({
        'users': list(users.values()),
        'user_accounts': user_accounts
    })

# User endpoints
@app.route('/api/user/profile', methods=['GET'])
@login_required
def user_profile():
    user_id = session.get('user_id')
    user = next((u for u in user_accounts if u['id'] == user_id), None)
    
    if user:
        return jsonify({
            'profile': {
                'id': user['id'],
                'email': user['email'],
                'name': user['name'],
                'role': user['role'],
                'member_since': user['created_at'],
                'orders_count': 12,
                'last_login': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
        })
    
    return jsonify({'error': 'Profile not found'}), 404

@app.route('/api/user/orders', methods=['GET'])
@login_required
def user_orders():
    return jsonify({
        'orders': [
            {
                'id': 'ORD-001',
                'date': '2024-11-15',
                'product': 'Zinc Sulphate Heptahydrate',
                'quantity': '500 kg',
                'status': 'Delivered',
                'total': '$2,500'
            },
            {
                'id': 'ORD-002', 
                'date': '2024-10-20',
                'product': 'Ferrous Sulphate',
                'quantity': '1000 kg',
                'status': 'Processing',
                'total': '$1,800'
            }
        ]
    })

# Serve static files
@app.route('/<path:path>')
def serve_static(path):
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    print("🌱 Sakthi Sai Biotech Backend Server")
    print("🚀 Starting server on http://localhost:5000")
    print("📱 Frontend will be served from /")
    print("🔐 API endpoints available at /api/")
    app.run(debug=True, host='0.0.0.0', port=5000)