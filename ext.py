import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

DATABASE_URL = os.environ.get("DATABASE_URL")

if DATABASE_URL:
    app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
else:
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///instance/database.db"

app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "secret")

db = SQLAlchemy(app)
