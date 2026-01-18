from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_mail import Mail
import os
from groq import Groq
from dotenv import load_dotenv

app = Flask(__name__)
app.config['SECRET_KEY'] = 'shotiko'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'

# Mail configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = 'infodistt@gmail.com'
app.config['MAIL_PASSWORD'] = 'pivl brvr gxla gzgm'  # 16-ნიშნა App Password
app.config['MAIL_DEFAULT_SENDER'] = 'infodistt@gmail.com'
app.config['MAIL_DEBUG'] = True

db = SQLAlchemy(app)
login_manager = LoginManager(app)

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
