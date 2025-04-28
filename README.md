# Pharmacy Management System with AI-based Inventory Predictor

This project is a complete Pharmacy Management System built with **Flask** (backend), **PostgreSQL** (database), and **Tailwind CSS** (frontend).  
It also includes an **AI Sales Predictor** using **Machine Learning (Linear Regression)** to forecast medicine sales and inventory needs.

## 🚀 Features

- User authentication (Admin & Staff)
- Medicine management (Add, Edit, Delete)
- Sales management with bill generation
- Inventory tracking with expiry alerts
- Supplier, Customer, and Receiving modules
- Dynamic Dashboard with sales trends and inventory status
- AI-based Sales and Inventory Predictor
- Forecast table saving predicted quantities and sales
- Responsive design with Tailwind CSS
- RESTful Flask APIs
- Secure password hashing

## 🛠️ Technologies Used

- Python 3
- Flask
- SQLAlchemy ORM
- PostgreSQL
- Pandas
- scikit-learn (for ML model)
- Tailwind CSS
- Chart.js (for dashboard charts)
- Jinja2 Templates
- HTML5, JavaScript

## 📈 AI Sales Predictor

- Predicts medicine demand for 7 days, 2 weeks, 1 month, 3 months, and 6 months.
- Uses **Linear Regression** trained on past sales data.
- Forecasts are stored in the database for analytics.

## 🏗️ System Architecture

- Frontend: HTML + Tailwind CSS
- Backend: Flask API (Python)
- Database: PostgreSQL
- Machine Learning: scikit-learn, Pandas

## 🧩 Setup Instructions

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/pharmacy-management-system.git
    cd pharmacy-management-system
    ```

2. Create and activate a virtual environment:
    ```bash
    python3 -m venv venv
    source venv/bin/activate   # On Windows use `venv\Scripts\activate`
    ```

3. Install required packages:
    ```bash
    pip install -r requirements.txt
    ```

4. Set up the PostgreSQL database:
    - Create a database (e.g., `pharmacydb`).
    - Update your database URI in `app.py` or `config.py`.

5. Run database migrations (if needed):
    ```bash
    flask db init
    flask db migrate
    flask db upgrade
    ```

6. Start the server:
    ```bash
    flask run
    ```

7. Access the app at: `http://127.0.0.1:5000/`

## 📂 Project Structure

