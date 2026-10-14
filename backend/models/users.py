from config import db
import bcrypt
import datetime

class User:
    
    # ===== CREATE USER =====
    @staticmethod
    def create(fname, lname, email, phone, password):
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        user = {
            'fname': fname,
            'lname': lname,
            'email': email,
            'phone': phone,
            'password': hashed,
            'created_at': datetime.datetime.utcnow()
        }
        result = db.users.insert_one(user)
        return str(result.inserted_id)

    # ===== FIND BY EMAIL =====
    @staticmethod
    def find_by_email(email):
        return db.users.find_one({'email': email})

    # ===== CHECK PASSWORD =====
    @staticmethod
    def check_password(plain, hashed):
        return bcrypt.checkpw(plain.encode('utf-8'), hashed)

    # ===== GET ALL USERS =====
    @staticmethod
    def get_all():
        users = list(db.users.find({}, {'password': 0}))
        for u in users:
            u['_id'] = str(u['_id'])
        return users