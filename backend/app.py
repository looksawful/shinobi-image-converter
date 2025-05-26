from flask import Flask, send_from_directory
from flask_cors import CORS
import pathlib

DIST = pathlib.Path(__file__).resolve().parent.parent / 'frontend' / 'dist'

app = Flask(__name__, static_folder=DIST, static_url_path='')
CORS(app)

@app.route('/')
def index():
    return send_from_directory(DIST, 'index.html')

@app.route('/<path:path>')
def assets(path):
    return send_from_directory(DIST, path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
