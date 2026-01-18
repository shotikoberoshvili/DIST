from operator import length_hint

from flask_wtf import FlaskForm
from flask_wtf.file import FileAllowed
from wtforms import StringField, PasswordField, SubmitField ,TextAreaField,IntegerField,HiddenField

from wtforms.fields.choices import SelectField
from wtforms.fields.simple import EmailField, FileField
from wtforms.validators import DataRequired, equal_to, length, NumberRange


class RegisterForm(FlaskForm):
    name = StringField("სახელი გვარი", validators=[DataRequired()])
    email = EmailField("Email", validators=[DataRequired()])
    phone_number = StringField("შეიყვანე შენი ტელეფონის ნომერი", validators=[DataRequired()])
    university = StringField("რომელ უნივერსიტეტში სწავლბ?")
    faculty = StringField("რომელ ფაკულტეტზე სწავლობ?")
    password = PasswordField("შეიყვანე პაროლი", validators=[DataRequired(), length(min=8, max=64, message='პაროლის სიგრძე უნდა იყოს 8 დან 64 სიმბოლომდე')])
    repeat_password = PasswordField("გაიმეორე პაროლი", validators=[DataRequired(), equal_to("password", message='პაროლები უნდა ემთხვეოდეს ერთმანეთს')])
    role = SelectField("აირჩიე როლი" , choices= ["აირჩიე როლი", "ლექტორი", "სტუდენტი", "მენტორი"])
    profile_img = FileField("აირჩიე პროფილის ფოტო", validators=[DataRequired(), FileAllowed(["png", "jpg", "jpeg"])])
    text = TextAreaField("ჩაწერე შენს შესახებ რაიმე საინტერესო")


    submit = SubmitField("რეგისტრაცია")

class LoginForm(FlaskForm):
    name = StringField("შეიყვანე შენი სახელი")
    password = PasswordField("შეიყვანე პაროლი")

    login = SubmitField("შესვლა")

class MentorForm(FlaskForm):
    image = FileField("აირჩიე მენტორის ფოტო", validators=[DataRequired(), FileAllowed(["png", "jpg", "jpeg"])] )
    name = StringField(" მენტორის სახელი და გვარი",)
    subject = StringField("საგნები რომლებსაც ასწავლის")
    price = IntegerField("ფასი (₾ საათში)", validators=[DataRequired(), NumberRange(min=1, max=1000)])
    text = TextAreaField("ინფორმააცია სტუდენტის შესახებ")

    submit = SubmitField("დაამატე მენტორი")

class AskForm(FlaskForm):
        question = StringField("კითხე AI ს", validators=[DataRequired(), length(max=200, message="Maximum 200 characters allowrd.")])
        submit = SubmitField("გაგზავნა") 

class CommentForm(FlaskForm):
    text = TextAreaField("კომენტარი", validators=[DataRequired(), length(max=500)])
    submit = SubmitField("კომენტარის დამატება")

class ProfileForm(FlaskForm):
    name = StringField("სახელი გვარი", validators=[DataRequired()])
    email = EmailField("Email", validators=[DataRequired()])
    phone_number = StringField("ტელეფონის ნომერი", validators=[DataRequired()])
    university = StringField("უნივერსიტეტი")
    faculty = StringField("ფაკულტეტი")
    text = TextAreaField("ჩემს შესახებ")
    profile_img = FileField("შეცვალე პროფილის ფოტო", validators=[FileAllowed(["png", "jpg", "jpeg"])])

    submit = SubmitField("პროფილის შენახვა")

