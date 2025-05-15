from flask import Flask, session
from flask_cors import CORS
from dotenv import load_dotenv
from src.routes.queen_routes import get_data, get_game
import os
import secrets

load_dotenv()
app = Flask(__name__)

cors_config = {
    'origins':"*",
    'methods':['GET',"POST"],
    'allow_headers':['Content-type','Authorization'],
    'supports_credentials':True
}
CORS(app,**cors_config)

app.secret_key = os.getenv('SECRET_KEY', secrets.token_hex(16))
PORT = os.getenv('PORT')
print(PORT)

@app.route("/queen", methods=['POST'])
def queen_route():
    return get_data()

@app.route("/queen", methods=['GET'])
def game_route():
    return get_game()

@app.route('/')
def starter():
    return "<h1>Hello world</h1>"

@app.route('/new-game', methods=['GET'])
def new_game():
    session.clear()
    return game_route()

if __name__ == "__main__":
    app.run(
        debug=True,
        port=PORT
    )