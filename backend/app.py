from flask import Flask, send_from_directory
from flask_cors import CORS
from config import db
import os

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = 'icecup_secret_key_2025'

from routes.auth import auth_bp
from routes.orders import orders_bp

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(orders_bp, url_prefix='/api/orders')

@app.route('/')
def home():
    return {'message': 'Ice Cup API running!', 'status': 'ok'}

@app.route('/frontend/')
def serve_index():
    return send_from_directory('../frontend', 'index.html')

@app.route('/frontend/<path:filename>')
def serve_frontend(filename):
    return send_from_directory('../frontend', filename)

if __name__ == '__main__':
    app.run(debug=True, port=5000)