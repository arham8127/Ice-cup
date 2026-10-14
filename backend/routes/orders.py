from flask import Blueprint, request, jsonify
from config import db
import jwt
import datetime

orders_bp = Blueprint('orders', __name__)
SECRET_KEY = 'icecup_secret_key_2025'


# ===== TOKEN VERIFY =====
def verify_token(req):
    auth = req.headers.get('Authorization', '')
    token = auth.replace('Bearer ', '').strip()
    if not token:
        return None
    try:
        data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return data
    except Exception:
        return None


# ===== PLACE ORDER =====
@orders_bp.route('/place', methods=['POST'])
def place_order():
    user = verify_token(request)
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    body = request.get_json(silent=True)
    if not body:
        return jsonify({'error': 'Invalid request body'}), 400

    items = body.get('items', [])
    if not items:
        return jsonify({'error': 'Cart is empty'}), 400

    try:
        total = sum(int(item['price']) * int(item['qty']) for item in items)
    except Exception:
        return jsonify({'error': 'Invalid item data'}), 400

    order = {
        'email': user.get('email'),
        'name': user.get('name'),
        'items': items,
        'total': total,
        'status': 'placed',
        'created_at': datetime.datetime.utcnow()
    }

    result = db.orders.insert_one(order)

    return jsonify({
        'message': 'Order placed successfully!',
        'order_id': str(result.inserted_id),
        'total': total,
        'status': 'placed'
    }), 201


# ===== MY ORDERS =====
@orders_bp.route('/my-orders', methods=['GET'])
def my_orders():
    user = verify_token(request)
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    orders = list(db.orders.find({'email': user.get('email')}))
    for order in orders:
        order['_id'] = str(order['_id'])
        order['created_at'] = order['created_at'].strftime('%d %b %Y, %I:%M %p')

    return jsonify({'orders': orders}), 200


# ===== ALL ORDERS (Admin) =====
@orders_bp.route('/all', methods=['GET'])
def all_orders():
    user = verify_token(request)
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    orders = list(db.orders.find())
    for order in orders:
        order['_id'] = str(order['_id'])
        order['created_at'] = order['created_at'].strftime('%d %b %Y, %I:%M %p')

    return jsonify({'orders': orders}), 200