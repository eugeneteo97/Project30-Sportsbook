from flask import Flask, render_template, request, redirect, url_for, jsonify
import requests

app = Flask(__name__)

MLB_API_URL = "https://statsapi.mlb.com/api/v1/schedule?sportId=1"

@app.route('/')
def index():
    response = requests.get(MLB_API_URL)
    data = response.json()
    games = []
    for date in data.get('dates', []):
        for game in date.get('games', []):
            games.append({
                'home': game['teams']['home']['team']['name'],
                'away': game['teams']['away']['team']['name'],
                'status': game['status']['detailedState'],
                'gamePk': game['gamePk']
            })
    return render_template('index.html', games=games)

@app.route('/bet', methods=['POST'])
def place_bet():
    bet = request.form.to_dict()
    return jsonify({'result': 'Bet placed!', 'bet': bet})

if __name__ == '__main__':
    app.run(debug=True)
