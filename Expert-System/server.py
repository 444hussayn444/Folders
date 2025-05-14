from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

app.config["SECRET_KEY"] = "2354@#$%67$DGFJ5234sfgdas#@$%"
CORS(app, resources={r"/*": {"origins": "*"}})
