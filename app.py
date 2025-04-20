from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from models import db, Users, MedicineCategory,MedicineType,Medicine,Supplier,ExpiryList,Receiving,Sale,Inventory,Customer,SaleItem,Forecast,SupplyRecord
from datetime import datetime,timedelta
from datetime import date
from sqlalchemy import func
import pandas as pd
from prophet import Prophet
from sklearn.linear_model import LinearRegression
import numpy as np
from collections import defaultdict


app = Flask(__name__)
CORS(app)

# ✅ PostgreSQL Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Mukthu%4021@localhost:5432/pharmacy_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# ✅ Initialize SQLAlchemy with app
db.init_app(app)

# ✅ Create DB Tables
with app.app_context():
    db.create_all()

# ✅ Routes
@app.route('/')
def home():
    return jsonify({"message": "Pharmacy Management System API is running!"})

# @app.route('/signup', methods=['POST'])
# def signup():
#     data = request.json
#     existing_user = Users.query.filter_by(email=data['email']).first()
#     if existing_user:
#         return jsonify({"success": False, "message": "Email already exists"}), 400
#     new_user = Users(name=data['name'], email=data['email'], password=data['password'])
#     db.session.add(new_user)
#     db.session.commit()
#     return jsonify({"success": True, "message": "User registered successfully!"})

# @app.route('/login', methods=['POST'])
# def login():
#     data = request.json
#     user = Users.query.filter_by(email=data['email'], password=data['password']).first()
#     if user:
#         return jsonify({"success": True, "message": "Login successful!"})
#     return jsonify({"success": False, "message": "Invalid credentials"}), 401

@app.route('/users', methods=['GET'])
def get_users():
    users = Users.query.all()
    users_list = [{"id": user.id, "name": user.name, "email": user.email} for user in users]
    return jsonify(users_list)

@app.route('/categories', methods=['GET', 'POST'])
def manage_categories():
    if request.method == 'GET':
        categories = MedicineCategory.query.all()
        return jsonify([{"id": cat.id, "name": cat.name} for cat in categories])
    
    data = request.json
    new_category = MedicineCategory(name=data['name'])
    db.session.add(new_category)
    db.session.commit()
    return jsonify({"message": "Category added successfully!"})

@app.route('/categories/<int:id>', methods=['PUT', 'DELETE'])
def update_delete_category(id):
    category = MedicineCategory.query.get(id)
    if not category:
        return jsonify({"error": "Category not found"}), 404

    if request.method == 'PUT':
        category.name = request.json['name']
        db.session.commit()
        return jsonify({"message": "Category updated successfully!"})

    db.session.delete(category)
    db.session.commit()
    return jsonify({"message": "Category deleted successfully!"})

# ================================ #
# ✅ CRUD for Medicine Types
# ================================ #
@app.route('/types', methods=['GET', 'POST'])
def manage_types():
    if request.method == 'GET':
        types = MedicineType.query.all()
        return jsonify([{"id": typ.id, "name": typ.name} for typ in types])
    
    data = request.json
    new_type = MedicineType(name=data['name'])
    db.session.add(new_type)
    db.session.commit()
    return jsonify({"message": "Type added successfully!"})

@app.route('/types/<int:id>', methods=['PUT', 'DELETE'])
def update_delete_type(id):
    typ = MedicineType.query.get(id)
    if not typ:
        return jsonify({"error": "Type not found"}), 404

    if request.method == 'PUT':
        typ.name = request.json['name']
        db.session.commit()
        return jsonify({"message": "Type updated successfully!"})

    db.session.delete(typ)
    db.session.commit()
    return jsonify({"message": "Type deleted successfully!"})

# ================================ #
# ✅ CRUD for Medicines
# ================================ #
@app.route('/categories', methods=['GET'])
def get_categories():
    categories = MedicineCategory.query.all()
    return jsonify([{"id": c.id, "name": c.name} for c in categories])

@app.route('/types', methods=['GET'])
def get_types():
    types = MedicineType.query.all()
    return jsonify([{"id": t.id, "name": t.name} for t in types])

@app.route('/medicines', methods=['GET', 'POST'])
def manage_medicines():
    if request.method == 'GET':
        medicines = Medicine.query.all()
        return jsonify([{
            "id": med.id, "name": med.name, "sku": med.sku,
            "price": med.price, "stock": med.stock
        } for med in medicines])
    
    data = request.json
    new_medicine = Medicine(
        sku=data['sku'],
        category_id=data['category_id'],
        type_id=data['type_id'],
        name=data['name'],
        measurement=data['measurement'],
        description=data.get('description', ''),
        price=data['price'],
        stock=data.get('stock', 0)
    )
    db.session.add(new_medicine)
    db.session.commit()
    return jsonify({"message": "Medicine added successfully!"})


@app.route('/medicines/<int:id>', methods=['PUT', 'DELETE'])
def update_delete_medicine(id):
    medicine = Medicine.query.get(id)
    if not medicine:
        return jsonify({"error": "Medicine not found"}), 404

    if request.method == 'PUT':
        data = request.json
        medicine.sku = data['sku']
        medicine.category_id = data['category_id']
        medicine.type_id = data['type_id']
        medicine.name = data['name']
        medicine.measurement = data['measurement']
        medicine.description = data.get('description', '')
        medicine.price = data['price']
        medicine.stock = data.get('stock', 0)
        db.session.commit()
        return jsonify({"message": "Medicine updated successfully!"})

    elif request.method == 'DELETE':
        db.session.delete(medicine)
        db.session.commit()
        return jsonify({"message": "Medicine deleted successfully!"})
    
# ================================ #
# ✅ CRUD for Suppliers
# ================================ #
@app.route('/suppliers', methods=['GET', 'POST'])
def manage_suppliers():
    if request.method == 'GET':
        suppliers = Supplier.query.all()
        return jsonify([{
            "id": sup.id, "name": sup.name, "contact": sup.contact, "address": sup.address
        } for sup in suppliers])
    
    data = request.json
    new_supplier = Supplier(
        name=data['name'],
        contact=data['contact'],
        address=data['address']
    )
    db.session.add(new_supplier)
    db.session.commit()
    return jsonify({"message": "Supplier added successfully!"})
@app.route('/suppliers/<int:id>', methods=['PUT', 'DELETE'])
def update_delete_supplier(id):
    supplier = Supplier.query.get(id)
    if not supplier:
        return jsonify({"error": "Supplier not found"}), 404

    if request.method == 'PUT':
        data = request.json
        supplier.name = data['name']
        supplier.contact = data['contact']
        supplier.address = data['address']
        db.session.commit()
        return jsonify({"message": "Supplier updated successfully!"})

    elif request.method == 'DELETE':
        db.session.delete(supplier)
        db.session.commit()
        return jsonify({"message": "Supplier deleted successfully!"})
# ================================ #
# ✅ CRUD for Expiry List
# ================================ #
@app.route('/expiry-list', methods=['GET', 'POST'])
def manage_expiry_list():
    if request.method == 'GET':
        expiry_list = ExpiryList.query.all()
        result = []

        for exp in expiry_list:
            medicine = Medicine.query.get(exp.medicine_id)
            result.append({
                "id": exp.id,
                "medicine_id": exp.medicine_id,
                "product": medicine.name if medicine else "Unknown",
                "date_encoded": exp.date_encoded.strftime('%Y-%m-%d'),
                "date_expired": exp.date_expired.strftime('%Y-%m-%d'),
                "quantity": exp.quantity
            })

        return jsonify(result)

    # POST method
    data = request.json
    new_expiry = ExpiryList(
        medicine_id=data['medicine_id'],
        date_expired=data['date_expired'],
        quantity=data['quantity']
    )
    db.session.add(new_expiry)
    db.session.commit()
    return jsonify({"message": "Expiry record added successfully!"})
@app.route('/expiry-list/<int:id>', methods=['PUT'])
def update_expiry(id):
    data = request.json
    expiry = ExpiryList.query.get_or_404(id)

    expiry.medicine_id = data.get('medicine_id', expiry.medicine_id)
    expiry.date_expired = data.get('date_expired', expiry.date_expired)
    expiry.quantity = data.get('quantity', expiry.quantity)

    db.session.commit()
    return jsonify({'message': 'Expiry updated successfully'})
@app.route('/expiry-list/<int:id>', methods=['DELETE'])
def delete_expiry(id):
    expiry = ExpiryList.query.get(id)
    if not expiry:
        return jsonify({"error": "Expiry record not found"}), 404

    db.session.delete(expiry)
    db.session.commit()
    return jsonify({"message": "Expiry record deleted successfully!"})

# ================================ #
# ✅ CRUD for Receiving
# ================================ #

@app.route('/receivings', methods=['GET', 'POST'])
def manage_receivings():
    if request.method == 'GET':
        receivings = Receiving.query.order_by(Receiving.received_date.desc()).all()
        result = []
        for r in receivings:
            medicine = Medicine.query.get(r.medicine_id)
            supplier = Supplier.query.get(r.supplier_id)
            result.append({
                "id": r.id,
                "medicine_id": r.medicine_id,
                "medicine_name": medicine.name if medicine else "Unknown",
                "supplier_id": r.supplier_id,
                "supplier_name": supplier.name if supplier else "Unknown",
                "quantity": r.quantity,
                "received_date": r.received_date.strftime('%Y-%m-%d %H:%M')
            })
        return jsonify(result)

    # POST – Add new receiving
    try:
        data = request.json
        print("📦 Receiving Data:", data)

        if not all(k in data for k in ("medicine_id", "supplier_id", "quantity", "received_date")):
            return jsonify({"error": "Missing required fields"}), 400

        received_dt = datetime.fromisoformat(data['received_date'])

        new_receiving = Receiving(
            medicine_id=int(data['medicine_id']),
            supplier_id=int(data['supplier_id']),
            quantity=int(data['quantity']),
            received_date=received_dt
        )
        db.session.add(new_receiving)

        # Update stock in Medicine table
        medicine = Medicine.query.get(int(data['medicine_id']))
        if medicine:
            medicine.stock += int(data['quantity'])

        db.session.commit()
        return jsonify({"message": "Receiving added successfully!"})

    except Exception as e:
        db.session.rollback()
        print("❌ Error:", e)
        return jsonify({"error": str(e)}), 500


@app.route('/receivings/<int:id>', methods=['PUT', 'DELETE'])
def update_delete_receiving(id):
    receiving = Receiving.query.get(id)
    if not receiving:
        return jsonify({"error": "Receiving entry not found"}), 404

    if request.method == 'PUT':
        try:
            data = request.json
            print("✏️ Updating Receiving:", data)
            old_quantity = receiving.quantity

            receiving.medicine_id = int(data['medicine_id'])
            receiving.supplier_id = int(data['supplier_id'])
            receiving.quantity = int(data['quantity'])
            receiving.received_date = datetime.fromisoformat(data['received_date'])

            # Update stock based on quantity difference
            medicine = Medicine.query.get(receiving.medicine_id)
            if medicine:
                medicine.stock += receiving.quantity - old_quantity

            db.session.commit()
            return jsonify({"message": "Receiving updated successfully!"})
        except Exception as e:
            db.session.rollback()
            print("❌ Error during update:", e)
            return jsonify({"error": str(e)}), 500

    # DELETE receiving
    try:
        print("🗑️ Deleting Receiving:", id)

        # Deduct stock from medicine
        medicine = Medicine.query.get(receiving.medicine_id)
        if medicine:
            medicine.stock -= receiving.quantity

        db.session.delete(receiving)
        db.session.commit()
        return jsonify({"message": "Receiving deleted successfully!"})
    except Exception as e:
        db.session.rollback()
        print("❌ Error during deletion:", e)
        return jsonify({"error": str(e)}), 500
# ================================ #
# ✅ CRUD for Sales
# ================================ #

@app.route('/sales', methods=['GET', 'POST'])
def manage_sales():
    if request.method == 'GET':
        sales = Sale.query.order_by(Sale.date_created.desc()).all()
        result = []
        for sale in sales:
            customer = Customer.query.get(sale.customer_id)
            result.append({
                "id": sale.id,
                "reference": sale.reference,
                "date": sale.date_created.strftime('%Y-%m-%d %H:%M'),
                "customer": customer.name if customer else "Unknown",
                "total_amount": sale.total_amount
            })
        return jsonify(result)

    # POST
    data = request.get_json()
    customer_id = data.get('customer_id')
    reference = data.get('reference')
    items = data.get('items', [])
    total_amount = data.get('total_amount')

    if not customer_id or not items:
        return jsonify({"error": "Customer and items are required"}), 400

    try:
        sale = Sale(
            customer_id=customer_id,
            reference=reference,
            total_amount=total_amount
        )
        db.session.add(sale)
        db.session.flush()  # Get sale.id before committing

        for item in items:
            medicine_id = item.get('medicine_id')
            quantity = item.get('quantity')

            medicine = Medicine.query.get(medicine_id)
            if not medicine:
                return jsonify({"error": f"Medicine ID {medicine_id} not found"}), 404

            if medicine.stock < quantity:
                return jsonify({"error": f"Not enough stock for {medicine.name}"}), 400

            sale_item = SaleItem(
                sale_id=sale.id,
                medicine_id=medicine_id,
                quantity=quantity,
                price=medicine.price
            )
            db.session.add(sale_item)
            medicine.stock -= quantity

        db.session.commit()
        return jsonify({"message": "Sale recorded successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
@app.route('/sales/<int:id>', methods=['GET'])
def get_sale(id):
    sale = Sale.query.get(id)
    if not sale:
        return jsonify({"error": "Sale not found"}), 404

    customer = Customer.query.get(sale.customer_id)
    items = SaleItem.query.filter_by(sale_id=sale.id).all()

    return jsonify({
        "id": sale.id,
        "reference": sale.reference,
        "customer": customer.name if customer else "Unknown",
        "total_amount": sale.total_amount,
        "date": sale.date_created.strftime('%Y-%m-%d %H:%M'),
        "items": [
            {
                "medicine_id": item.medicine_id,
                "medicine_name": Medicine.query.get(item.medicine_id).name,
                "quantity": item.quantity,
                "price": item.price
            } for item in items
        ]
    })

@app.route('/sales/<int:id>', methods=['DELETE'])
def delete_sale(id):
    sale = Sale.query.get(id)
    if not sale:
        return jsonify({"error": "Sale not found"}), 404

    items = SaleItem.query.filter_by(sale_id=sale.id).all()

    try:
        for item in items:
            medicine = Medicine.query.get(item.medicine_id)
            if medicine:
                medicine.stock += item.quantity
            db.session.delete(item)

        db.session.delete(sale)
        db.session.commit()

        return jsonify({"message": "Sale deleted and stock restored"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/medicines-with-sales', methods=['GET'])
def get_medicines_with_sales():
    try:
        # Join SaleItem with Medicine and get distinct medicine names
        medicines = db.session.query(Medicine.id, Medicine.name).\
            join(SaleItem, Medicine.id == SaleItem.medicine_id).\
            distinct().all()

        result = [{"id": m.id, "name": m.name} for m in medicines]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ================================ #
# ✅ CRUD for Inventory
# ================================ #
# @app.route('/inventory', methods=['GET'])
# def get_inventory():
#     inventory = Inventory.query.all()
#     return jsonify([{
#         "id": inv.id,
#         "medicine_id": inv.medicine_id,
#         "quantity": inv.quantity,
#         "date_received": inv.date_received.strftime('%Y-%m-%d'),
#         "expiry_date": inv.expiry_date.strftime('%Y-%m-%d') if inv.expiry_date else None
#     } for inv in inventory])
@app.route('/inventory', methods=['GET'])
def get_inventory():
    inventory = db.session.query(Inventory, Medicine).join(Medicine, Inventory.medicine_id == Medicine.id).all()

    inventory_data = [{
        "id": inv.Inventory.id,
        "medicine_id": inv.Inventory.medicine_id,
        "medicine_name": inv.Medicine.name,
        "stock_in": inv.Inventory.stock_in,
        "stock_out": inv.Inventory.stock_out,
        "expired": inv.Inventory.expired,
        "stock_available": inv.Inventory.stock_available
    } for inv in inventory]

    return jsonify(inventory_data)
# ---------------------------
# 🔁 GET & POST Customers
# ---------------------------
@app.route('/customers', methods=['GET', 'POST'])
def manage_customers():
    if request.method == 'GET':
        customers = Customer.query.all()
        return jsonify([
            {
                "id": customer.id,
                "name": customer.name,
                "contact": customer.contact,
                "address": customer.address
            } for customer in customers
        ])

    # POST
    data = request.get_json()
    new_customer = Customer(
        name=data['name'],
        contact=data['contact'],
        address=data['address']
    )
    db.session.add(new_customer)
    db.session.commit()
    return jsonify({"message": "Customer added successfully"}), 201

# ---------------------------
# ✏️ PUT & DELETE Customer
# ---------------------------
@app.route('/customers/<int:id>', methods=['PUT', 'DELETE'])
def update_delete_customer(id):
    customer = Customer.query.get(id)
    if not customer:
        return jsonify({"error": "Customer not found"}), 404

    if request.method == 'PUT':
        data = request.get_json()
        customer.name = data['name']
        customer.contact = data['contact']
        customer.address = data['address']
        db.session.commit()
        return jsonify({"message": "Customer updated successfully"})

    # DELETE
    db.session.delete(customer)
    db.session.commit()
    return jsonify({"message": "Customer deleted successfully"})

@app.route('/inventory/summary', methods=['GET'])
def update_inventory_summary():
    medicines = Medicine.query.all()

    for med in medicines:
        medicine_id = med.id

        # Stock Calculations
        stock_in = db.session.query(db.func.sum(Receiving.quantity)).filter_by(medicine_id=medicine_id).scalar() or 0
        stock_out = db.session.query(db.func.sum(SaleItem.quantity)).filter_by(medicine_id=medicine_id).scalar() or 0
        expired = db.session.query(db.func.sum(ExpiryList.quantity)).filter_by(medicine_id=medicine_id).scalar() or 0

        # Update or create inventory (WITHOUT stock_available)
        inventory = Inventory.query.filter_by(medicine_id=medicine_id).first()
        if inventory:
            inventory.stock_in = stock_in
            inventory.stock_out = stock_out
            inventory.expired = expired
        else:
            inventory = Inventory(
                medicine_id=medicine_id,
                stock_in=stock_in,
                stock_out=stock_out,
                expired=expired
            )
            db.session.add(inventory)

    db.session.commit()

    # Return all inventory with computed stock_available
    all_inventory = Inventory.query.all()
    result = []
    for inv in all_inventory:
        stock_available = inv.stock_in - inv.stock_out - inv.expired
        if stock_available < 0:
            stock_available = 0

        result.append({
            "id": inv.id,
            "medicine_id": inv.medicine_id,
            "stock_in": inv.stock_in,
            "stock_out": inv.stock_out,
            "expired": inv.expired,
            "stock_available": stock_available  # computed only for return
        })

    return jsonify(result)

# DASHBOARD API
@app.route('/dashboard', methods=['GET'])
def get_dashboard_data():
    # Today's date
    today = date.today()

    # Calculate total sales for today
    sales_today = Sale.query.filter(Sale.sale_date == today).all()  # Use sale_date here
    total_sales_today = sum([sale.total() for sale in sales_today])

    # Calculate total sales (all time)
    total_sales = Sale.query.with_entities(db.func.sum(Sale.quantity * Sale.price_per_unit)).scalar()

    # Calculate expiring medicines today (this assumes you have the correct model for ExpiringProduct)
    expiring_today = ExpiryList.query.filter(ExpiryList.expiration_date == today).count()

    dashboard_data = {
        "totalSalesToday": total_sales_today,
        "totalSales": total_sales,
        "expiringMedicinesToday": expiring_today
    }

    return jsonify(dashboard_data)

# @app.route('/predict-inventory', methods=['GET'])
# def get_inventory_predictions():
#     # Load forecast CSV
#     df = pd.read_csv('all_medicine_forecasts.csv')

#     # Clean and preprocess
#     df['medicine_id'] = df['medicine_id'].astype(int)
#     df['date'] = pd.to_datetime(df['date'], dayfirst=True)
    
#     # Optional: Add this if 'category' column exists in your CSV
#     if 'category' not in df.columns:
#         df['category'] = 'General'  # Default category if missing

#     # Query Params
#     category_filter = request.args.get('category')
#     start_date = request.args.get('start_date')
#     end_date = request.args.get('end_date')

#     # Apply filters
#     if category_filter:
#         df = df[df['category'].str.lower() == category_filter.lower()]

#     if start_date:
#         df = df[df['date'] >= pd.to_datetime(start_date)]

#     if end_date:
#         df = df[df['date'] <= pd.to_datetime(end_date)]

#     df = df.sort_values(['medicine_id', 'date'])

#     response = {}
#     for med_id in df['medicine_id'].unique():
#         data = df[df['medicine_id'] == med_id].tail(7)

#         response[str(med_id)] = {
#             "medicine_name": f"Medicine {med_id}",  # Replace with actual name if available
#             "predictions": [
#                 {
#                     "date": row['date'].strftime('%Y-%m-%d'),
#                     "predicted_sales": round(row['predicted_sales'], 2)
#                 }
#                 for _, row in data.iterrows()
#             ]
#         }

#     return jsonify(response)


# @app.route('/predict-inventory', methods=['GET'])
# def predict_inventory():
#     # Fetch data
#     sales = db.session.query(
#         SaleItem.medicine_id,
#         func.date(Sale.date_created).label('sale_date'),
#         func.sum(SaleItem.quantity).label('total_quantity')
#     ).join(Sale).group_by(
#         SaleItem.medicine_id,
#         func.date(Sale.date_created)
#     ).order_by(
#         SaleItem.medicine_id,
#         func.date(Sale.date_created)
#     ).all()

#     df = pd.DataFrame(sales, columns=['medicine_id', 'date', 'quantity'])
#     df['date'] = pd.to_datetime(df['date'])
#     df = df.sort_values(['medicine_id', 'date'])

#     response = {}

#     for med_id in df['medicine_id'].unique():
#         med_data = df[df['medicine_id'] == med_id]

#         # Convert dates to ordinal numbers for regression
#         med_data['ordinal'] = med_data['date'].map(lambda x: x.toordinal())
#         X = med_data['ordinal'].values.reshape(-1, 1)
#         y = med_data['quantity'].values

#         if len(X) < 2:
#             continue  # Not enough data to forecast

#         # Fit simple linear regression
#         model = LinearRegression()
#         model.fit(X, y)

#         # Predict next 7 days
#         last_date = med_data['date'].max()
#         future_dates = [last_date + timedelta(days=i) for i in range(1, 8)]
#         future_ordinals = np.array([d.toordinal() for d in future_dates]).reshape(-1, 1)
#         predicted_sales = model.predict(future_ordinals)

#         response[str(med_id)] = {
#             "medicine_name": f"Medicine {med_id}",
#             "predictions": [
#                 {
#                     "date": d.strftime('%Y-%m-%d'),
#                     "predicted_sales": round(p, 2)
#                 }
#                 for d, p in zip(future_dates, predicted_sales)
#             ]
#         }

   # return jsonify(response)

@app.route("/ai-predictor", methods=["GET"])
def predict_sales():
    medicine_id = request.args.get("medicine_id")
    interval = request.args.get("interval", "7d")

    if not medicine_id:
        return jsonify({"error": "medicine_id query parameter is required"}), 400

    days_map = {
        "7d": 7,
        "2w": 14,
        "1m": 30,
        "3m": 90,
        "6m": 180
    }

    if interval not in days_map:
        return jsonify({"error": "Invalid interval"}), 400

    days = days_map[interval]
    future_dates = [datetime.utcnow() + timedelta(days=i) for i in range(days)]

    results = {}
    total_revenue = 0
    total_quantity = 0

    if medicine_id == "all":
        medicines = db.session.query(Medicine.id, Medicine.name).all()
    else:
        med = Medicine.query.get(medicine_id)
        if not med:
            return jsonify({"error": f"Medicine with ID {medicine_id} not found"}), 404
        medicines = [(int(medicine_id), med.name)]

    for mid, mname in medicines:
        data = []
        for d in future_dates:
            date_str = d.strftime("%Y-%m-%d")

            # Check if prediction already exists
            existing = Forecast.query.filter_by(
                medicine_id=mid,
                date=date_str,
                interval=interval
            ).first()

            if existing:
                quantity = existing.predicted_quantity
                sales = existing.predicted_sales_amount
            else:
                quantity = np.random.randint(1, 5)
                price = 15.0  # Dummy value
                sales = quantity * price

                forecast = Forecast(
                    medicine_id=mid,
                    date=date_str,
                    predicted_quantity=quantity,
                    predicted_sales_amount=sales,
                    interval=interval
                )
                db.session.add(forecast)

            data.append({
                "date": date_str,
                "predicted_quantity": quantity,
                "predicted_sales_amount": sales
            })

            total_quantity += quantity
            total_revenue += sales

        results[str(mid)] = {
            "medicine_name": mname,
            "predictions": data
        }

    db.session.commit()

    return jsonify({
        "predictions": results,
        "summary": {
            "total_revenue": total_revenue,
            "total_quantity": total_quantity,
            "conversion_rate": 26,
            "conversion_increase": 8
        }
    })
# Load the forecast data (assumes a preprocessed CSV with names)
forecast_df = pd.read_csv("all_medicine_forecasts.csv")

@app.route('/api/forecast', methods=['GET'])
def get_forecasts():
    category = request.args.get('category')
    name = request.args.get('name')
    start_date = request.args.get('start')
    end_date = request.args.get('end')

    medicines = Medicine.query.all()
    forecasts = []

    for med in medicines:
        if name and name.lower() not in med.name.lower():
            continue
        if category and (not med.category or category.lower() != med.category.name.lower()):
            continue

        sales = Sale.query.filter_by(medicine_id=med.id).all()
        df = pd.DataFrame([{'ds': s.date, 'y': s.quantity} for s in sales])

        if df.empty or len(df) < 2:
            continue  # Skip poor data

        model = Prophet()
        model.fit(df)

        future = model.make_future_dataframe(periods=30)
        forecast = model.predict(future)

        filtered_forecast = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']]
        filtered_forecast['medicine_id'] = med.id
        filtered_forecast['medicine_name'] = med.name
        filtered_forecast['category'] = med.category

        if start_date:
            filtered_forecast = filtered_forecast[filtered_forecast['ds'] >= start_date]
        if end_date:
            filtered_forecast = filtered_forecast[filtered_forecast['ds'] <= end_date]

        forecasts.append(filtered_forecast)

    all_forecasts = pd.concat(forecasts).reset_index(drop=True)
    return jsonify(all_forecasts.to_dict(orient='records'))

# Stock alerts
@app.route('/api/alerts', methods=['GET'])
def get_stock_alerts():
    threshold = int(request.args.get('threshold', 10))
    medicines = Medicine.query.all()

    low_stock = []
    for med in medicines:
        if med.stock_available < threshold:
            low_stock.append({
                "id": med.id,
                "name": med.name,
                "stock": med.stock_available,
                "category": med.category,
            })

    return jsonify(low_stock)


@app.route("/ai-inventory-predictor", methods=["GET"])
def inventory_predictor():
    days_to_predict = int(request.args.get("days", 7))
    today = datetime.utcnow()
    end_date = today + timedelta(days=days_to_predict)

    inventory_predictions = []
    medicines = Medicine.query.all()

    for med in medicines:
        past_start = today - timedelta(days=90)

        # Get past forecasts
        past_forecasts = (
            Forecast.query
            .filter(Forecast.medicine_id == med.id)
            .order_by(Forecast.date)
            .all()
        )

        # Filter valid dates
        valid_sales = []
        for row in past_forecasts:
            try:
                row_date = datetime.strptime(row.date, "%Y-%m-%d")
                if past_start <= row_date < today:
                    valid_sales.append(row)
            except:
                continue

        # Prepare for regression
        X, y = [], []
        for i, row in enumerate(valid_sales):
            X.append([i])
            y.append(row.predicted_quantity)

        predicted_demand = 0
        if len(X) > 2:
            model = LinearRegression().fit(X, y)
            future_days = np.array([[len(X) + i] for i in range(days_to_predict)])
            predicted_demand = int(model.predict(future_days).sum())
        elif y:
            predicted_demand = int(sum(y) / len(y) * days_to_predict)

        # Get current stock
        inventory = Inventory.query.filter_by(medicine_id=med.id).first()
        available_stock = (
            (inventory.stock_in if inventory else 0)
            - (inventory.stock_out if inventory else 0)
            - (inventory.expired if inventory else 0)
        )

        shortage = max(predicted_demand - available_stock, 0)
        status = "Restock Needed" if shortage > 0 else "Stock OK"
        recommended_restock = shortage + 10 if shortage > 0 else 0

        # Days until out of stock
        if predicted_demand > 0:
            daily_demand = predicted_demand / days_to_predict
            days_of_supply = available_stock / daily_demand
            overstock_alert = days_of_supply > 45
            days_until_out = round(days_of_supply, 1)
        else:
            overstock_alert = False
            days_until_out = 0.0

        # Expiry alert
        expiry_alert = False
        soon_expiry = ExpiryList.query.filter(
            ExpiryList.medicine_id == med.id,
            ExpiryList.date_expired <= today + timedelta(days=30)
        ).first()
        if soon_expiry:
            expiry_alert = True

        inventory_predictions.append({
            "medicine_id": med.id,
            "medicine_name": med.name,
            "available_stock": available_stock,
            "predicted_demand": predicted_demand,
            "shortage": shortage,
            "recommended_restock": recommended_restock,
            "days_until_out_of_stock": days_until_out,
            "overstock_alert": overstock_alert,
            "expiry_alert": expiry_alert,
            "status": status
        })

    return jsonify({"inventory_predictions": inventory_predictions})






if __name__ == '__main__':
    app.run(debug=True)
