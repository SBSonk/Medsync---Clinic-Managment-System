from flask import Flask, render_template, abort, url_for

app = Flask(__name__)

names = ["noah", "lloyd", "matew"]

@app.route("/")
def index():
    return render_template('index.html', list=names)

@app.route("/tite")
def tite():
    return render_template('tite.html')

@app.route("/profile")
@app.route("/profile/<name>")
def profile(name=None):
    if name not in names:
        return render_template("404.html") 
    else:
        return render_template('profile.html', person=name)
    

if __name__ == "__main__":
    app.run(debug=True)