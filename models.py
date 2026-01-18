from ext import db, login_manager
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class Mentor(db.Model):
    __tablename__ = 'mentors'
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(), nullable=False)
    subject = db.Column(db.String(), nullable=False)
    price = db.Column(db.Integer(), nullable=True)
    image = db.Column(db.String(), default='default_.jpg')
    text = db.Column(db.String(), nullable=False )

    ratings = db.relationship("Rating", backref="mentor", lazy="dynamic")

class Comment(db.Model):
     __tablename__ = 'comments'

     id = db.Column(db.Integer(), primary_key=True)
     text = db.Column(db.String(), nullable=False)
     mentor_id = db.Column(db.Integer(), db.ForeignKey("mentors.id"))
     user_id = db.Column(db.Integer(), db.ForeignKey("users.id"))

class Rating(db.Model):
     __tablename__ = "ratings"

     id = db.Column(db.Integer(), primary_key=True)
     stars = db.Column(db.Integer(), nullable=False)
     mentor_id = db.Column(db.Integer(), db.ForeignKey("mentors.id"), nullable=False)
     user_id = db.Column(db.Integer(), db.ForeignKey("users.id"), nullable=False)

class User(db.Model,UserMixin) :
     __tablename__ = "users"

     id = db.Column(db.Integer(), primary_key= True)
     name = db.Column(db.String())
     email = db.Column(db.String())
     phone_number = db.Column(db.String())
     university = db.Column(db.String())
     faculty = db.Column(db.String())
     password = db.Column(db.String())
     role = db.Column(db.String())
     profile_img = db.Column(db.String(), default='default.jpg')
     text = db.Column(db.String())
     comments = db.relationship("Comment", backref="user", lazy="dynamic")
     def __init__(self,name,email,phone_number,university,faculty,password,text,
          role="Guest",
          profile_img="default.jpg"):
          self.name = name
          self.email = email
          self.phone_number = phone_number
          self.university = university
          self.faculty = faculty
          self.profile_img = profile_img
          self.text = text
          self.password = generate_password_hash(password)
          self.role = role

     def check_password(self, password):
          return check_password_hash (self.password, password)



@login_manager.user_loader
def load_user(user_id):
     return User.query.get(user_id)     

