from flask import Flask, render_template, request, redirect, url_for, flash, get_flashed_messages, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin, LoginManager, login_required, login_user, current_user, logout_user
from werkzeug.security import generate_password_hash, check_password_hash
from flask_session import Session
from flask_socketio import SocketIO, emit
from flask_cors import CORS, cross_origin
import uuid
from flask_socketio import SocketIO, emit
from forms import SignUpForm, LogInForm

app = Flask(__name__, template_folder='public')

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///myDB.db'
app.config['SECRET_KEY'] = 'thebestknight'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


socketio = SocketIO(app)
CORS(app)


login_manager = LoginManager()
login_manager.init_app(app)

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(15), index=True, unique=True)
    email = db.Column(db.String(80), index=True, unique=True)
    password = db.Column(db.String(50), index=False, unique=False)
    rating = db.Column(db.Integer, index=True, unique=False)



with app.app_context():
    db.create_all()

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route("/index")
@cross_origin()
@login_required
def index():
    return render_template("index.html")

@app.route('/sign_up', methods=["GET", "POST"])
def sign_up():
    sign_up_form = SignUpForm()
    if current_user.is_authenticated:
        flash("Already logged in!")
        return redirect(url_for('index', _external=True))
    if sign_up_form.validate_on_submit():
        if not User.query.filter_by(email=sign_up_form.email.data).first():
            newUser = User(email=sign_up_form.email.data, username=sign_up_form.username.data, password=generate_password_hash(sign_up_form.password.data), rating=0)
            db.session.add(newUser)
            db.session.commit()
            flash("Account Created")
            return redirect(url_for("log_in"))
        else:
            flash("Creation failed: email already in use")
            return redirect(url_for("sign_up"))
    return render_template("sign_up.html", template_form=sign_up_form)

@app.route("/", methods=["GET", "POST"])
@app.route('/log_in', methods=["GET", "POST"])
def log_in():
    log_in_form = LogInForm(csrf_enabled=False)
    if current_user.is_authenticated:
        
        flash("Already logged in!")
        return redirect(url_for('index', _external=True))
    if log_in_form.validate_on_submit():
        findUser = User.query.filter_by(email = log_in_form.email.data).first()
        if findUser and check_password_hash(findUser.password, log_in_form.password.data):
            flash("Logged in successfully")
            login_user(findUser)
            return redirect(url_for('index', _external=True))
        else:
            flash("Incorrect login information")
            return redirect(url_for('log_in', _external=True))
    return render_template("log_in.html", template_form=log_in_form)


@app.route("/update_rating", methods=["POST"])
@login_required
def update_rating():
    print("worked")
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if current_user.username == user.username:
        user.rating = data['rating']
    else:
        return jsonify({"Unauthorized"}), 404

    if not user:
        return jsonify({"message": "User not found"}), 404
    db.session.commit()
    return jsonify({"message": "Score updated"}), 200


@app.route('/logout', methods=["GET","POST"])
@login_required
def logout():
    logout_user()
    flash("Logged Out")
    return redirect(url_for('log_in',_external=True))



if __name__ == "__main__":
    socketio.run(app)