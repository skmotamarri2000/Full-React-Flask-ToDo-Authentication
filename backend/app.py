# -------------------------------- Installations and Imports --------------------------------
from flask import Flask, render_template, request, flash, redirect, url_for,jsonify,session
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, BooleanField, SelectField,DateField
from wtforms.fields.list import FieldList
from wtforms.validators import DataRequired, Length, Email, EqualTo
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import UserMixin, LoginManager, current_user, login_user, login_required,logout_user
from flask_migrate import Migrate
from sqlalchemy import or_
from datetime import datetime
from sqlalchemy.orm.exc import NoResultFound
import requests

# --------------------------------------------------------------------------------------------------------------------------------------------

app = Flask(__name__)
app.config['SECRET_KEY'] = '5791628bb0b13he0c576dfde280ba245'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ToDo.db'


db = SQLAlchemy(app)
bcrypt = Bcrypt(app)


# Define User model
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    todos = db.relationship('Todo', backref='owner', lazy=True)

# Define Todo model
class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(1000))
    complete = db.Column(db.Boolean)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

# Setup LoginManager
login_manager = LoginManager(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/')
def index():
    return render_template('index.html')

#---------------------------------------------------------------------------------------------------------------------------------
import random
import string

@app.route("/google-login", methods=['POST'])
def google_login():
    data = request.json
    email = data.get('email')
    username = data.get('name')

    if not email or not username:
        return jsonify({"error": "Email and name are required"}), 400

    # Check if the user already exists in the database
    user = User.query.filter_by(email=email).first()
    if user:
        login_user(user)
        
        return jsonify({"message": "User already exists"}), 200
        

    # random password genrtor.
    password = ''.join(random.choices(string.ascii_letters + string.digits, k=8))  
    user = User(username=username, email=email,  password=password)
    
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User created successfully", "password": password}), 201



#----------------------------------------------------------------------------------------------------------------------
@app.route("/register", methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if User.query.filter_by(username=username).first() is not None:
        return jsonify({"error": "Username already exists"}), 400
    if User.query.filter_by(email=email).first() is not None:
        return jsonify({"error": "Email already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(username=username, email=email, password=hashed_password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Registration successful"}), 201
#-------------------------------------------------------------------------------------------------------------------------


@app.route("/login", methods=['POST'])
def login():
    data = request.json
    username_or_email = data.get('username_or_email')
    password = data.get('password')

    # Query user by username or email
    user = User.query.filter(or_(User.username == username_or_email, User.email == username_or_email)).first()

    if user and bcrypt.check_password_hash(user.password, password):
        login_user(user)
        return jsonify({"message": "Login successful"}), 200
    return jsonify({"error": "Invalid credentials"}), 401

#----------------------------------------------------------------------------------------------------------------------------------
@app.route("/logout")
@login_required
def logout():
    #logout_user()
     # Clear the user's session
    session.pop('user_id', None)
    return jsonify({"message": "Logout successful"}), 200

@app.route('/api/todos', methods=['POST'])
@login_required
def add_todo():
    data = request.json
    if not data or 'title' not in data:
        return jsonify({'error': 'Title is required'}), 400
    new_todo = Todo(title=data['title'], complete=False, user_id=current_user.id)
    db.session.add(new_todo)
    db.session.commit()
    return jsonify({'id': new_todo.id, 'title': new_todo.title, 'complete': new_todo.complete}), 201
#----------------------------------------------------------------------------------------------------------------------------

@app.route('/api/current-user', methods=['GET'])
@login_required
def get_current_user():
    username = current_user.username
    return jsonify({"username": username}), 200
#---------------------------------------------------------------------------------------------------------------------------
@app.route('/api/todos', methods=['GET'])
@login_required
def get_todos():
    #print("Current User ID:", current_user.id)  
    todos = Todo.query.filter_by(user_id=current_user.id).all()
    #print("Fetched Todos:", todos)  # Debug statement
    todo_list = [{'id': todo.id, 'title': todo.title, 'complete': todo.complete} for todo in todos]
    #print("Feteched to do list: ", todo_list)
    return jsonify(todo_list)

#----------------------------------------------------------------------------------------------------------------------------------
@app.route('/api/todos/<int:todo_id>', methods=['PUT'])
@login_required
def update_todo(todo_id):
    todo = Todo.query.get(todo_id)
    if not todo:
        return jsonify({'error': 'Todo not found'}), 404
    todo.complete = not todo.complete
    db.session.commit()
    return jsonify({'message': 'Todo updated successfully'})

@app.route('/api/todos/<int:todo_id>', methods=['DELETE'])
@login_required
def delete_todo(todo_id):
    todo = Todo.query.get(todo_id)
    if not todo:
        return jsonify({'error': 'Todo not found'}), 404
    db.session.delete(todo)
    db.session.commit()
    return jsonify({'message': 'Todo deleted successfully'})

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
