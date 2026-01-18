from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
import os
from groq import Groq
from dotenv import load_dotenv

app = Flask(__name__)
app.config['SECRET_KEY'] = 'shotiko'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'

db = SQLAlchemy(app)
login_manager = LoginManager(app)

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
