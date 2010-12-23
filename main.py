#Small flask app to a server running

from flask import Flask, render_template
app = Flask(__name__)

@app.route('/<template>')
def index(template):
    return render_template( '%s.htm' % template )

if __name__ == '__main__':
    app.run( debug=True )
