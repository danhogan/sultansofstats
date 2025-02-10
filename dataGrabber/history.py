import requests
import json
from datetime import datetime, timedelta
import httpx
import asyncio

# Define the league and team info
league_id = "e3px47n0lr7xx2y9"
team_id = "88y05iu3lta8m9yb"
base_url = "https://www.fantrax.com/fxpa/req"

# Define the categories you want to track
categories = ["R", "HR", "RBI", "SB", "OBP", "OPS", "WQS", "K", "K9", "SVHLD", "ERA", "WHP"]

# Function to fetch data for each day
def fetch_team_stats_for_day(league_id, team_id, date):
    params = {
        'leagueId': league_id,
        'teamId': team_id,
        'date': date
    }
    response = requests.get(base_url, params=params)
    
    if response.status_code == 200:
        print(response.text)
        return response.json()
    else:
        print(f"Error fetching data for {date}: {response.status_code}")
        return None

# Function to get stats history for the team
def get_stats_history(league_id, team_id, start_date, end_date):
    stats_history = {category: [] for category in categories}
    
    # Loop over each day in the season
    current_date = start_date
    while current_date <= end_date:
        date_str = current_date.strftime('%Y-%m-%d')
        data = fetch_team_stats_for_day(league_id, team_id, date_str)
        
        if data:
            # Extract the stats for each category and add to the history
            for category in categories:
                stats_history[category].append(data['stats'].get(category, 0))
        
        # Move to the next day
        current_date += timedelta(days=1)
    
    return stats_history

# Main function to add statsHistory to the team data
def add_stats_history_to_team_data(league_id, team_id, start_date, end_date):
    # Placeholder team data structure (this would typically be loaded from your existing JSON)
    team_data = {
        "divisionValues": {
            "HR": 164,
            "R": 156.5,
            "RBI": 154,
            "SB": 157,
            "OBP": 155,
            "OPS": 167,
            "SO": 151,
            "SV": 156,
            "HD": 147,
            "ERA": 142,
            "WHP": 150,
            "QS": 134.5
        },
        "statValues": {
            "HR": 293,
            "R": 282,
            "RBI": 281,
            "SB": 286,
            "OBP": 282,
            "OPS": 297,
            "SO": 251,
            "SV": 281,
            "HD": 217,
            "ERA": 245,
            "WHP": 267,
            "QS": 235
        },
        "teamName": "GatorDave15",
        "teamId": team_id,
        "leagueName": "2023 D4 - Cupid Childs",
        "leagueId": league_id,
        "leagueRank": "1",
        "division": 4,
        "stats": {
            "R": 1001,
            "HR": 312,
            "RBI": 972,
            "SB": 212,
            "OBP": 0.346547,
            "OPS": 0.822056,
            "QS": 99,
            "SO": 1657,
            "SV": 118,
            "HD": 78,
            "ERA": 3.677722,
            "WHP": 1.184606
        },
        "totalPoints": 3217,
        "divisionPoints": 1834,
        "overallRank": 1,
        "divisionRank": 1,
        "promotion": "super"
    }

    # Get stats history for the team
    stats_history = get_stats_history(league_id, team_id, start_date, end_date)
    
    # Add statsHistory to the team data
    team_data['statsHistory'] = stats_history
    
    # Print the updated team data (or save it to a file)
    print(json.dumps(team_data, indent=4))

# Define the start and end date of the season (adjust this based on the actual season)
start_date = datetime(2024, 3, 30)  # Example start date
end_date = datetime(2024, 10, 1)    # Example end date

# Run the script
# add_stats_history_to_team_data(league_id, team_id, start_date, end_date)

async def fetch_league_standings(league_id):
    url = f"https://www.fantrax.com/fxpa/req?leagueId={league_id}"
    body = {
        "msgs": [
            {
                "method": "getStandings",
                "data": { "leagueId": league_id }
            }
        ]
    }

    headers = {
        "Content-Type": "application/json"
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=body, headers=headers)

            # Check if the request was successful
            if response.status_code != 200:
                raise Exception(f"HTTP error {response.status_code}: {response.reason}")

            # Parse and return the JSON response
            return response.json()

        except Exception as e:
            print(f"Error fetching league standings: {e}")
            return None

# Usage example
async def main():
    league_id = "rdjea3rslck02h24"  # Replace with your actual leagueId
    standings = await fetch_league_standings(league_id)
    print("League Standings:", standings)

# Run the async main function
asyncio.run(main())
