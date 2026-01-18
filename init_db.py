from ext import db, app
from models import Mentor, Comment, User
from datetime import datetime  # დაემატოს ფაილის დასაწყისში

with app.app_context():

    db.drop_all()
    db.create_all()
    print("ბაზა წარმატებით შეიქმნა!")

    admin = User(name='admin',email='admin@admin.com',phone_number='000000000',university='Admin University',faculty='Administration',password='adminpass',text='System administrator',role='Admin')

    db.session.add(admin)
    db.session.commit()