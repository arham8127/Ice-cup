# The Ice Cup 🍦

A full-stack web application for an ice cream parlour. Users can sign up, log in, browse the menu, add items to a cart, and place orders. Built from scratch as a personal project.

## Features

- User signup and login with JWT authentication
- Cart system saved in the browser (localStorage)
- Order placing and order history
- Dark / light mode toggle
- Google Maps embed showing the parlour location

## Tech Stack

| Part      | Technology                    |
| --------- | ----------------------------- |
| Frontend  | HTML, CSS, JavaScript         |
| Backend   | Python, Flask                 |
| Database  | MongoDB                       |
| Auth      | JWT (JSON Web Tokens), bcrypt |

## Project Structure

> Update this to match your actual folders.

```
Ice-cup/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── .env            (not uploaded, you create this)
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── cart.html
│   ├── orders.html
│   ├── css/
│   └── js/
└── README.md
```

## How to Run

1. **Clone the repo**
   ```
   git clone https://github.com/arham8127/Ice-cup.git
   cd Ice-cup
   ```

2. **Set up the backend**
   ```
   cd backend
   python -m venv venv
   venv\Scripts\activate        # Windows
   pip install -r requirements.txt
   ```

3. **Create a `.env` file** inside `backend/`:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

4. **Start the server**
   ```
   python app.py
   ```

5. **Open the frontend**: open `frontend/index.html` in your browser (or use the Live Server extension in VS Code).

## What I Learned

- Connecting a Flask API to a separate frontend and fixing CORS errors
- Securing passwords with bcrypt and sessions with JWT
- Keeping token names consistent across many frontend files
- Testing each feature by running it, instead of trusting code that only looks correct

## Screenshots

> Add 2 or 3 screenshots here (home page, cart, orders).

## Author

**Arham**
- GitHub: [arham8127](https://github.com/arham8127)
- LinkedIn: [arham0616](https://www.linkedin.com/in/arham0616)
