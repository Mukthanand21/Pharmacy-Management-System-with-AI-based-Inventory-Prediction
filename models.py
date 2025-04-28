from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy import ForeignKeyConstraint

db = SQLAlchemy()

# ✅ Users Table
class Users(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)  # Hashed password
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship with activity logs
    activity_logs = db.relationship("ActivityLog", backref="user", lazy=True)


# ✅ Activity Log Table
class ActivityLog(db.Model):
    __tablename__ = "activity_log"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    action = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())


# ✅ Medicine Category Table
class MedicineCategory(db.Model):
    __tablename__ = "medicine_category"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)

    # Relationship with medicines
    medicines = db.relationship("Medicine", backref="category", lazy=True)


# ✅ Medicine Type Table
class MedicineType(db.Model):
    __tablename__ = "medicine_type"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)

    # Relationship with medicines
    medicines = db.relationship("Medicine", backref="type", lazy=True)


# ✅ Medicine Table
class Medicine(db.Model):
    __tablename__ = "medicine"

    id = db.Column(db.Integer, primary_key=True)
    sku = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    measurement = db.Column(db.String(50), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey("medicine_category.id"), nullable=False)
    type_id = db.Column(db.Integer, db.ForeignKey("medicine_type.id"), nullable=False)
    stock = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship with inventory tracking
    inventory = db.relationship("Inventory", backref="medicine", lazy=True)


# # ✅ Inventory Table
# class Inventory(db.Model):
#     __tablename__ = "inventory"

#     id = db.Column(db.Integer, primary_key=True)
#     medicine_id = db.Column(db.Integer, db.ForeignKey("medicine.id"), nullable=False)
#     quantity = db.Column(db.Integer, nullable=False)
#     date_received = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
#     expiry_date = db.Column(db.DateTime, nullable=True)
class Inventory(db.Model):
    __tablename__ = "inventory"

    id = db.Column(db.Integer, primary_key=True)
    medicine_id = db.Column(db.Integer, db.ForeignKey("medicine.id"), nullable=False)
    stock_in = db.Column(db.Integer, nullable=False, default=0)
    stock_out = db.Column(db.Integer, nullable=False, default=0)
    expired = db.Column(db.Integer, nullable=False, default=0)
    stock_available = db.Column(db.Integer, nullable=False, default=0)
   # date_received = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
   # expiry_date = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return f"<Inventory medicine_id={self.medicine_id} stock_available={self.stock_available}>"

# ✅ Supplier Table
class Supplier(db.Model):
    __tablename__ = "suppliers"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    contact = db.Column(db.String(50), nullable=False)
    address = db.Column(db.Text, nullable=False)

    # Relationship with medicine supply records
    supplies = db.relationship("SupplyRecord", backref="supplier", lazy=True)


# ✅ Supply Record Table
class SupplyRecord(db.Model):
    __tablename__ = "supply_records"

    id = db.Column(db.Integer, primary_key=True)
    supplier_id = db.Column(db.Integer, db.ForeignKey("suppliers.id"), nullable=False)
    medicine_id = db.Column(db.Integer, db.ForeignKey("medicine.id"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    date_supplied = db.Column(db.DateTime, default=datetime.utcnow)


# class Sale(db.Model):
#     __tablename__ = "sales"

#     id = db.Column(db.Integer, primary_key=True)
#     medicine_id = db.Column(db.Integer, db.ForeignKey("medicine.id"), nullable=False)
#     quantity = db.Column(db.Integer, nullable=False)
#     total_price = db.Column(db.Numeric(10, 2), nullable=False)
#     date_sold = db.Column(db.DateTime, default=datetime.utcnow)

#     medicine = db.relationship("Medicine", backref="sales")


# ✅ Expiry List Table (Renamed from `ExpiringMedicine`)
class ExpiryList(db.Model):
    __tablename__ = "expiry_list"

    id = db.Column(db.Integer, primary_key=True)
    medicine_id = db.Column(db.Integer, db.ForeignKey("medicine.id"), nullable=False)
    date_encoded = db.Column(db.DateTime, default=datetime.utcnow)
    date_expired = db.Column(db.DateTime, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)

    medicine = db.relationship("Medicine", backref="expiry_entries")

# models.py
class Receiving(db.Model):
    __tablename__ = 'receiving'

    id = db.Column(db.Integer, primary_key=True)
    medicine_id = db.Column(db.Integer, nullable=False)
    supplier_id = db.Column(db.Integer, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    received_date = db.Column(db.DateTime, nullable=False)
    

# ✅ Customer Table
class Customer(db.Model):
    __tablename__ = "customers"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    contact = db.Column(db.String(50), nullable=False)
    address = db.Column(db.String(100), unique=True, nullable=True)

    # Relationship with sales
   # sales = db.relationship("Sale", backref="customer", lazy=True)
class Sale(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, nullable=False)
    reference = db.Column(db.String(100), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    #sale_date = db.Column(db.Date, nullable=False, default=datetime.utcnow().date)  # Add sale_date here
    #medicine_id = db.Column(db.Integer, db.ForeignKey("medicine.id"), nullable=False)
#     
    # def total(self):
    #     return self.quantity * self.price_per_unit
class SaleItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
   # sale_id = db.Column(db.Integer, db.ForeignKey('sale.id'), nullable=False)
    sale_id = db.Column(db.Integer, db.ForeignKey('sale.id', ondelete='CASCADE'), nullable=False)  # Enable cascading delete

    medicine_id = db.Column(db.Integer, db.ForeignKey('medicine.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)


class Forecast(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    medicine_id = db.Column(db.Integer, db.ForeignKey("medicine.id"))
    date = db.Column(db.String(20))
    predicted_quantity = db.Column(db.Integer)
    predicted_sales_amount = db.Column(db.Float)
    interval = db.Column(db.String(10))
