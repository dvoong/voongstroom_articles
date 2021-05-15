import { Code } from "../../Utilities";


function FlaskApiTemplate() {
    return (
        <div>
          <h1>Flask API Template</h1>
          <div>
            Published on <i>15th May 2021</i>
          </div>
          <hr />

          <div>
            <h2>Introduction</h2>
            <p>In this article we will create a Flask API with basic signup and signin functionality using Flask-Login, SQLAlchemy and postgres.</p>
          </div>

          <div>
            <h2>Project structure</h2>
            <Code copy={false} language='shell' text={`app
  __init__.py
  app.py
  db.py
venv
`} />
          </div>

          <div>
            <h2>Project setup</h2>

            <Code language='shell' text={`mkdir -p ~/projects/flask_api_template/app`} />
            <Code language='shell' text={`cd ~/projects/flask_api_template`} />

            <p>Create a python virtual environment</p>
            <Code language='shell' text={`virtualenv venv --python=3`} />
            
            <Code language='shell' text={`source venv/bin/activate`} />

            <p>Install python libraries needed for this template,</p>
            <Code language='shell' text={`pip install flask flask-login psycopg2 python-dotenv flask-sqlalchemy`} />

            <ul>
              <li><code>flask-login</code>: a library for managing user login and sessions.</li>
              <li><code>psycopg2</code>: a library for communicating between python and postgres.</li>
              <li><code>python-dotenv</code>: a library used for reading environment variable files and passing variables to python.</li>
              <li><code>flask-sqlalchemy</code>: a library that provides oject oriented data modelling functionality.</li>
            </ul>

          </div>
          <div>
            <h2>Project files</h2>
            <p>Create the app definition and configuration,</p>
            <small>~/projects/flask_api_template/app/__init__.py</small>
            <hr />

            <Code language='python' text={`import os

from flask import Flask


def create_app():
    app = Flask(__name__)

    app.secret_key = os.environ.get('FLASK_SECRET', 'secret')

    # configure database
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['SQLALCHEMY_DATABASE_URI']
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    from app.db import db
    db.init_app(app)

    # configure auth
    from app.auth import login_manager
    login_manager.init_app(app)
    from app.auth.views import bp
    app.register_blueprint(bp)

    with app.app_context():
        db.create_all()

    return app
`} />
            <p>Create the database module,</p>

            <small>~/projects/flask_api_template/app/__init__.py</small>
            <hr />
            <Code language='python' text={`from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()
`} />

            <p>Creat an authorisation package,</p>

            <small>~/projects/flask_api_template/app/auth/__init__.py</small>
            <hr />
            <Code language='python' text={`from flask_login import LoginManager

from app.auth.models import User


login_manager = LoginManager()

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)
`} />

            <p>Authorisation package user models,</p>

            <small>~/projects/flask_api_template/app/auth/models.py</small>
            <hr />
            <Code language='python' text={`from flask_login import UserMixin
from app.db import db


class User(db.Model, UserMixin):

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String)
    verified = db.Column(db.Boolean, default=False)
`} />
            
            <p>Authorisation package views used to register, signin, etc.</p>
            
            <small>~/projects/flask_api_template/app/auth/views.py</small>
            <hr />
            <Code language='python' text={`from flask import Blueprint, request
from flask_login import current_user, login_user, logout_user
from werkzeug.security import check_password_hash, generate_password_hash

from app.auth.models import User
from app.db import db


bp = Blueprint('auth', __name__, url_prefix='/')

@bp.route('/is-signed-in', methods=['GET'])
def is_signed_in():
    if current_user.is_authenticated:
        return {'isSignedin': True}
    else:
        return {'isSignedin': False}

@bp.route('/register', methods=['POST'])
def register():
    response = {}
    
    email = request.json['email'].lower()
    password = request.json['password']
    password_confirmation = request.json['passwordConfirmation']

    if password != password_confirmation:
        return {"status": 400, "errors": ["Passwords do not match"]}

    user = User.query.filter_by(email=email).first()
    if user and user.email == email:
        return {'status': 400, 'errors': ['Email already exists']}
    
    password_hash = generate_password_hash(password)
    user = User(email=email, password=password_hash)
    db.session.add(user)
    db.session.commit()
        
    return {"status": 200}

@bp.route('/signin', methods=['POST'])
def signin():
    email = request.json['email'].lower()
    password = request.json['password']
    user = User.query.filter_by(email=email).first()
    if user:
        if not user.verified:
            return {
                'status': 400,
                'errors': ['Please verify email before signing in']
            }
        user_authenticated = check_password_hash(user.password, password)
        if user_authenticated:
            login_user(user)
            return {'status': 200, 'user': {'email': email}}
    return {'status': 400, 'errors': ['Invalid signin details']}

@bp.route('/signout', methods=['GET'])
def signout():
    logout_user()
    return {'isSignedin': False}
    
`} />

          </div>
            <div>
              <h2>Testing the app</h2>
            <p>Create the database for the app, assuming postgres is already installed on the host.</p>
            <Code language='shell' text={`psql -U postgres postgres`} />

            <Code language='SQL' text={`create database flask_api_template`} />

            <p>Declare environment variables needed for the app,</p>

            <small>~/projects/flask_api_template/.env</small>
            <hr />

            <Code language='python' text={`FLASK_SECRET=secret
SQLALCHEMY_DATABASE_URI=postgresql://postgres@localhost/flask_api_template`} />

            <p>Now we'll start up the app and test the functionality. We'll start the flask process in a new terminal,</p>

            <Code language='shell' text={`cd ~/projects/flask_api_template`} />
            <Code language='shell' text={`source venv/bin/activate`} />
            <Code copy={false} language='shell' text={`(venv):~/projects/flask_api_template$ FLASK_APP=app FLASK_ENV=development FLASK_DEBUG=1 flask run
 * Serving Flask app 'app' (lazy loading)
 * Environment: development
 * Debug mode: on
 * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 348-068-454`} />

            <p>Since the app uses POST requests to register and signin we'll use the <code>requests</code> library with the python interactive prompt to test the app, in a new terminal.</p>
            
            <Code language='shell' text={`cd ~/projects/flask_api_template`} />
            <Code language='shell' text={`source venv/bin/activate`} />
            <Code language='shell' text={`pip install ipython requests`} />

            <p>We'll use the ipython interactive prompt just because it's a bit nicer to work with.</p>

            <Code language='shell' text={`ipython`} />
            <Code copy={false} language='python' text={`In [1]: import requests

In [2]: response = requests.post('http://localhost:5000/register', json={'email': 'test@test.com', 'password': 'test', 'passwordConfirmation': 'test'})

In [3]: response.json()
Out[3]: {'status': 200}
`} />

            <p>The registration worked well. An email verification is required but is not yet setup, to get round this we'll manually update the database entry to say the email has been verified.</p>

            <Code copy={false} language='text' text={`     (venv) dvoong@dvoong-~/projects/flask_api_template/app$ psql -U postgres flask_api_template
psql (12.6 (Ubuntu 12.6-1.pgdg20.04+1))
Type "help" for help.

flask_api_template=# select * from public.user;
 id |     email     |                                                password                                                | verified 
----+---------------+--------------------------------------------------------------------------------------------------------+----------
  1 | test@test.com | pbkdf2:sha256:260000$WTUMVTyDssuaIi8e$cd0ba072d512399aec952e2a53c8e5d1fc56d0dfec3f2af96a6c1d286377e1c3 | f
(1 row)

flask_api_template=# update public.user set verified=true;
UPDATE 1
flask_api_template=# select * from public.user;
 id |     email     |                                                password                                                | verified 
----+---------------+--------------------------------------------------------------------------------------------------------+----------
  1 | test@test.com | pbkdf2:sha256:260000$WTUMVTyDssuaIi8e$cd0ba072d512399aec952e2a53c8e5d1fc56d0dfec3f2af96a6c1d286377e1c3 | t
`} />

            <p>As you can see above the passwords have been hashed. Now the email address has been verified we can try signing in. To check a user is still signed in we have to create a session,</p>

            <Code copy={false} language='python' text={`In [4]: session = requests.Session()

In [5]: response = session.get('http://localhost:5000/is-signed-in')

In [6]: response.json()
Out[6]: {'isSignedin': False}

In [7]: response = session.post('http://localhost:5000/signin', json={'email': 'test@test.com', 'password': 'test'})

In [8]: response.json()
Out[8]: {'status': 200, 'user': {'email': 'test@test.com'}}

In [9]: response = session.get('http://localhost:5000/is-signed-in')

In [10]: response.json()
Out[10]: {'isSignedin': True}
`} />

            <p>Congratulations! We have created a basic flask api with register and signin functionality.</p>
            
          </div>
          
        </div>
    );
}

export default FlaskApiTemplate;


