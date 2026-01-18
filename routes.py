from flask import render_template, redirect, flash, request, jsonify 
from werkzeug.security import check_password_hash

from forms import RegisterForm, MentorForm, LoginForm, AskForm, CommentForm, ProfileForm
from models import Mentor, Comment, User, Rating
from ext import app, db
from flask_login import login_user, logout_user, login_required, current_user
import os



profiles = [
]

#CRUD create read update delate

@app.route("/delete/<int:mentor_id>")
@login_required
def delete(mentor_id):
    mentor = Mentor.query.get(mentor_id)

    db.session.delete(mentor)
    db.session.commit()

    flash("პროდუქტი წარმატებით წაიშალა", "danger")
    return redirect("/tutors")

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template("about.html")

@app.route("/login", methods=["POST", "GET"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter(form.name.data == User.name).first()
        if user and user.check_password(form.password.data):
            login_user(user)

            flash("თქვენ წარმატებით გაიარეთ ავტორიზაცია", "success")
            return redirect("/")
        else:
            flash("მოხდა შეცდომა", "danger")


    return render_template("login.html", form=form)

    
@app.route('/logout')
def logout():

    logout_user()

    return redirect('/')

@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        new_user = User(name=form.name.data, email=form.email.data, phone_number=form.phone_number.data, university=form.university.data, faculty=form.faculty.data, password=form.password.data, role=form.role.data,text=form.text.data, )

        profile_img = form.profile_img.data
        img_location = os.path.join(app.root_path, 'static/images', profile_img.filename)
        profile_img.save(img_location)
        new_user.profile_img = profile_img.filename


        db.session.add(new_user)
        db.session.commit()

        flash("თქვენ წარმატებით დარეგისტრირდით, გაიარეთ ავტორიზაცია", "success")
        return redirect('/login')

    return render_template('reg.html', form=form,)



@app.route('/calendar')
def calendar():
    return render_template('calendar.html')


@app.route('/account', methods=['GET', 'POST'])
@login_required
def account():
    form = ProfileForm(
        name=current_user.name,
        email=current_user.email,
        phone_number=current_user.phone_number,
        university=current_user.university,
        faculty=current_user.faculty,
        text=current_user.text,
    )

    if form.validate_on_submit():
        current_user.name = form.name.data
        current_user.email = form.email.data
        current_user.phone_number = form.phone_number.data
        current_user.university = form.university.data
        current_user.faculty = form.faculty.data
        current_user.text = form.text.data

        if form.profile_img.data:
            image = form.profile_img.data
            img_location = os.path.join(app.root_path, 'static/images', image.filename)
            image.save(img_location)
            current_user.profile_img = image.filename

        db.session.commit()
        flash("პროფილი წარმატებით განახლდა!", "success")
        return redirect('/account')

    return render_template('account.html', form=form)


@app.route('/profiles/<int:profile_id>')
def profile(profile_id):
    return (render_template
            ('profile.html', user=profiles[profile_id]))

@app.route('/add_mentor', methods=['GET', 'POST'])
@login_required
def add_mentor ():
    form = MentorForm()
    if form.validate_on_submit():
        if current_user.role != "Admin":
            flash("მხოლოდ ადმინს შეუძლია მენტორის დამატება", "danger")
            return redirect("/")

        new_mentor = Mentor(name=form.name.data, subject=form.subject.data, price=form.price.data, text = form.text.data)
        image = form.image.data
        img_location = os.path.join(app.root_path, 'static/images', image.filename)
        image.save(img_location)
        new_mentor.image = image.filename

        db.session.add(new_mentor)
        db.session.commit()

        flash('Mentors successfully added!', 'success')
        return redirect("/tutors")

    return render_template('add_mentor.html', form = form)

@app.route("/edit_mentor/<int:mentor_id>", methods = ['POST', 'GET'])
@login_required
def edit_mentor(mentor_id):
    mentor = Mentor.query.get(mentor_id)
    if current_user.role != "Admin":
        flash("მხოლოდ ადმინს შეუძლია მენტორის რედაქტირება", "danger")
        return redirect("/")

    # დაამატეთ text=mentor.text აქ:
    form = MentorForm(name=mentor.name, subject=mentor.subject, price=mentor.price, text=mentor.text)
    
    if form.validate_on_submit():
        mentor.name = form.name.data
        mentor.subject = form.subject.data
        mentor.price = form.price.data
        mentor.text = form.text.data # ეს უკვე სწორად გიწერიათ

        db.session.commit()
        flash("მენტორის ინფორმაცია წარმატებით განახლდა!", "success")
        return redirect("/tutors")
    return render_template("add_mentor.html", form = form)



@app.route('/tutors')
def tutors():
     mentors = Mentor.query.all()

     mentor_ratings = {}
     for mentor in mentors:
         ratings = mentor.ratings.all() if hasattr(mentor, 'ratings') else []
         count = len(ratings)
         if count:
             avg = round(sum(r.stars for r in ratings) / count, 1)
         else:
             avg = None
         mentor_ratings[mentor.id] = {"avg": avg, "count": count}

     return render_template('tutors.html', mentors=mentors, mentor_ratings=mentor_ratings)
@app.route('/detailed/<int:mentor_id>', methods=['GET', 'POST'])
def detailed(mentor_id):
     mentor = Mentor.query.get(mentor_id)
     comments = Comment.query.filter(Comment.mentor_id == mentor_id)

     form = CommentForm()
     if form.validate_on_submit():
         # მხოლოდ ავტორიზებულ სტუდენტს შეუძლია კომენტარის დამატება
         if not current_user.is_authenticated or current_user.role != "სტუდენტი":
             flash("კომენტარის დასაწერად საჭიროა ავტორიზაცია სტუდენტის როლით.", "danger")
             return redirect(f"/detailed/{mentor_id}")

         new_comment = Comment(text=form.text.data, mentor_id=mentor_id, user_id=current_user.id)
         db.session.add(new_comment)
         db.session.commit()
         flash("კომენტარი წარმატებით დაემატა!", "success")
         return redirect(f"/detailed/{mentor_id}")

     avg_rating = None
     ratings_count = 0
     user_rating = None

     if mentor:
         ratings = mentor.ratings.all() if hasattr(mentor, 'ratings') else []
         ratings_count = len(ratings)
         if ratings_count:
             avg_rating = round(sum(r.stars for r in ratings) / ratings_count, 1)

     if current_user.is_authenticated:
         existing = Rating.query.filter_by(mentor_id=mentor_id, user_id=current_user.id).first()
         if existing:
             user_rating = existing.stars

     return render_template(
         'detailed.html',
         mentor=mentor,
         comments=comments,
         avg_rating=avg_rating,
         ratings_count=ratings_count,
         user_rating=user_rating,
         form=form,
     )


@app.route('/rate_mentor/<int:mentor_id>', methods=['POST'])
@login_required
def rate_mentor(mentor_id):
     mentor = Mentor.query.get_or_404(mentor_id)

     if current_user.role != "სტუდენტი":
         flash("მხოლოდ სტუდენტს შეუძლია მენტორის შეფასება.", "danger")
         return redirect(f"/detailed/{mentor_id}")

     try:
         stars = int(request.form.get('stars', 0))
     except ValueError:
         stars = 0

     if stars < 1 or stars > 5:
         flash("შეფასება უნდა იყოს 1-დან 5 ვარსკვლავამდე.", "danger")
         return redirect(f"/detailed/{mentor_id}")

     existing = Rating.query.filter_by(mentor_id=mentor_id, user_id=current_user.id).first()
     if existing:
         existing.stars = stars
     else:
         new_rating = Rating(stars=stars, mentor_id=mentor_id, user_id=current_user.id)
         db.session.add(new_rating)

     db.session.commit()
     flash("შენი შეფასება შენახულია!", "success")
     return redirect(f"/detailed/{mentor_id}")

