from flask import Flask, render_template, abort, url_for, jsonify
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, origins='*')

@app.route("/api/users", methods=['GET'])
def users():
    return jsonify(
        {
            "users": [
                'noah',
                'lloyd',
                'matthew',
                'stanley'
            ]
        }
    )


if __name__ == "__main__":
    app.run(debug=True, port=8080)