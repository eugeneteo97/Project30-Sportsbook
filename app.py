
from flask import Flask, render_template
import requests

app = Flask(__name__)

API_KEY = "736da9d082b8cf7cc18967812fd547c3"
API_URL = "https://api.the-odds-api.com/v4/sports/"

@app.route('/')
def index():
    # Get list of sports
    sports_resp = requests.get(f"{API_URL}?apiKey={API_KEY}")
    sports = sports_resp.json() if sports_resp.status_code == 200 else []
    odds_data = []
    # For demo, show odds for first sport only
    if sports:
        sport_key = sports[0]['key']
        odds_resp = requests.get(f"{API_URL}{sport_key}/odds/?apiKey={API_KEY}&regions=us&markets=h2h,spreads,totals")
        if odds_resp.status_code == 200:
            odds_data = odds_resp.json()
    return render_template('index.html', sports=sports, odds_data=odds_data)

if __name__ == '__main__':
    app.run(debug=True)
