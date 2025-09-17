export default {
  async fetch(request, env, ctx) {
    const API_KEY = "736da9d082b8cf7cc18967812fd547c3";
    const API_URL = "https://api.the-odds-api.com/v4/sports/";
    let sports = [];
    let oddsData = [];
    // Fetch sports list
    try {
      const sportsResp = await fetch(`${API_URL}?apiKey=${API_KEY}`);
      if (sportsResp.ok) {
        sports = await sportsResp.json();
      }
    } catch (e) {}
    // Fetch odds for first sport
    if (sports.length > 0) {
      const sportKey = sports[0].key;
      try {
        const oddsResp = await fetch(`${API_URL}${sportKey}/odds/?apiKey=${API_KEY}&regions=us&markets=h2h,spreads,totals`);
        if (oddsResp.ok) {
          oddsData = await oddsResp.json();
        }
      } catch (e) {}
    }
    // Render HTML
    let html = `<!DOCTYPE html><html><head><title>Sportsbook Odds</title><style>table{border-collapse:collapse;width:100%}th,td{border:1px solid #ccc;padding:8px;text-align:left}th{background:#f2f2f2}</style></head><body><h1>Sportsbook Odds</h1><h2>Available Sports</h2><ul>`;
    for (const sport of sports) {
      html += `<li>${sport.title}</li>`;
    }
    html += `</ul><h2>Odds for ${sports.length > 0 ? sports[0].title : 'N/A'}</h2>`;
    if (oddsData.length > 0) {
      html += `<table><tr><th>Teams</th><th>Bookmaker</th><th>Market</th><th>Odds</th></tr>`;
      for (const event of oddsData) {
        for (const bookmaker of event.bookmakers) {
          for (const market of bookmaker.markets) {
            for (const outcome of market.outcomes) {
              html += `<tr><td>${event.home_team} vs ${event.away_team}</td><td>${bookmaker.title}</td><td>${market.key}</td><td>${outcome.name}: ${outcome.price}</td></tr>`;
            }
          }
        }
      }
      html += `</table>`;
    }
    html += `</body></html>`;
    return new Response(html, { headers: { 'content-type': 'text/html' } });
  }
};
