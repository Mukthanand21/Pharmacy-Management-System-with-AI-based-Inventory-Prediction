# forecast_trainer.py

import psycopg2
import pandas as pd
from prophet import Prophet
from sqlalchemy import create_engine
from datetime import datetime

# STEP 1: Connect to PostgreSQL and fetch data
conn = psycopg2.connect(
    host="localhost",
    database="pharmacy_db",
    user="postgres",
    password="Mukthu@21"
)

sales_df = pd.read_sql("SELECT * FROM sale", conn)
medicines_df = pd.read_sql("SELECT * FROM medicine", conn)
conn.close()

# STEP 2: Preprocess sales data
sales_df['date_sold'] = pd.to_datetime(sales_df['date_sold'])
grouped = sales_df.groupby(['medicine_id', 'date_sold'])['quantity'].sum().reset_index()

# STEP 3: Train forecast model (Prophet) for each medicine
forecast_results = []

for med_id in grouped['medicine_id'].unique():
    med_sales = grouped[grouped['medicine_id'] == med_id].copy()
    med_sales.rename(columns={"date_sold": "ds", "quantity": "y"}, inplace=True)

    if len(med_sales) < 2:
        continue  # Not enough data to train

    model = Prophet()
    model.fit(med_sales)

    future = model.make_future_dataframe(periods=7)
    forecast = model.predict(future)

    forecast = forecast[['ds', 'yhat']].tail(7)
    forecast['medicine_id'] = med_id

    forecast_results.append(forecast)

# Combine all forecasts
final_df = pd.concat(forecast_results)
final_df['created_at'] = datetime.now()

# STEP 4: Store forecasts in a new PostgreSQL table
# Create SQLAlchemy engine
engine = create_engine('postgresql://your-user:your-password@your-host/your-db')

# Create table if not exists (or just replace it for now)
final_df.to_sql("forecasts", engine, index=False, if_exists="replace")
