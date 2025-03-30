import os

DB_USER = "postgres"
DB_PASS = "Mukthu%4021"
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "pharmacy_db"

SQLALCHEMY_DATABASE_URI = f'postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}'
SQLALCHEMY_TRACK_MODIFICATIONS = False
