// 10 hobbies × 10 Python concepts mapping
// Each entry: { example, stemConnection }

const hobbyStemMap = {
  cricket: {
    variables: {
      example: "score = 0, wickets = 10, overs = 20",
      stemConnection: "Track runs, wickets, and overs in a cricket match",
    },
    'data-types': {
      example: "score=150 (int), player='Virat' (str), isOut=False (bool)",
      stemConnection: "Different data in cricket — scores, names, out/not-out status",
    },
    conditions: {
      example: "if score > 100: print('Century!')",
      stemConnection: "If a batsman scores 100+ runs, it's a century",
    },
    loops: {
      example: "for over in range(1, 21): bowl_over()",
      stemConnection: "Loop through 20 overs in T20 cricket",
    },
    functions: {
      example: "def calculate_run_rate(runs, overs): return runs/overs",
      stemConnection: "Calculate run rate, strike rate as reusable functions",
    },
    lists: {
      example: "team = ['Rohit', 'Virat', 'KL', 'Hardik', 'Dhoni']",
      stemConnection: "Store all 11 players in a cricket team",
    },
    strings: {
      example: "player_name.upper(), 'India vs AUS'.split(' vs ')",
      stemConnection: "Format match scorecards and player names",
    },
    oop: {
      example: "class Batsman: def __init__(self, name, runs): ...",
      stemConnection: "Model each cricket player as an object with attributes",
    },
    'error-handling': {
      example: "try: run_rate = runs/overs except ZeroDivisionError: ...",
      stemConnection: "Handle case when 0 overs bowled — division error",
    },
    algorithms: {
      example: "find max scorer from team list using loop",
      stemConnection: "Find top scorer, sort batting averages, search player stats",
    },
  },

  football: {
    variables: {
      example: "goals = 0, assists = 3, yellow_cards = 1",
      stemConnection: "Track goals, assists, and cards in football",
    },
    'data-types': {
      example: "goals=2 (int), player='Messi' (str), isPlaying=True (bool)",
      stemConnection: "Football stats use different data types",
    },
    conditions: {
      example: "if goals > 0: print('Team is winning!')",
      stemConnection: "Check if team is ahead in a football match",
    },
    loops: {
      example: "for minute in range(1, 91): play_minute()",
      stemConnection: "Loop through 90 minutes of a football match",
    },
    functions: {
      example: "def goal_difference(scored, conceded): return scored - conceded",
      stemConnection: "Calculate goal difference as a function",
    },
    lists: {
      example: "squad = ['Messi', 'Ronaldo', 'Neymar', 'Mbappe']",
      stemConnection: "Store football squad players in a list",
    },
    strings: {
      example: "match_result = 'India 3 - 1 Brazil'; match_result.split(' - ')",
      stemConnection: "Parse and format football match results",
    },
    oop: {
      example: "class Player: def __init__(self, name, position, goals): ...",
      stemConnection: "Model football player with position and stats as object",
    },
    'error-handling': {
      example: "try: ratio = goals/matches except ZeroDivisionError: ...",
      stemConnection: "Handle new player with 0 matches played",
    },
    algorithms: {
      example: "sort players by goals scored to find top scorer",
      stemConnection: "Find golden boot winner, sort league table, search player",
    },
  },

  badminton: {
    variables: {
      example: "score = 0, set_count = 0, shuttle_speed = 300",
      stemConnection: "Track badminton game score and shuttle speed",
    },
    'data-types': {
      example: "points=21 (int), player='Sindhu' (str), won=True (bool)",
      stemConnection: "Badminton match data in different types",
    },
    conditions: {
      example: "if points >= 21 and lead >= 2: print('Set won!')",
      stemConnection: "Win condition in badminton — 21 points with 2 point lead",
    },
    loops: {
      example: "for rally in rallies: count_point(rally)",
      stemConnection: "Process each rally in a badminton match",
    },
    functions: {
      example: "def smash_speed(force, angle): return force * math.cos(angle)",
      stemConnection: "Calculate smash speed using physics formula as function",
    },
    lists: {
      example: "match_scores = [21, 18, 21] # 3 set scores",
      stemConnection: "Store scores of each set in badminton match",
    },
    strings: {
      example: "result = 'Sindhu wins 21-18, 21-15'; result.split(', ')",
      stemConnection: "Format badminton match result string",
    },
    oop: {
      example: "class BadmintonPlayer: def __init__(self, name, rank, smash_speed): ...",
      stemConnection: "Model badminton player with ranking and skills",
    },
    'error-handling': {
      example: "try: avg = total_points/matches except ZeroDivisionError: ...",
      stemConnection: "Handle division by zero when player has no matches",
    },
    algorithms: {
      example: "find highest-ranked player, sort tournament results",
      stemConnection: "Sort world rankings, find tournament winner, search player",
    },
  },

  kabaddi: {
    variables: {
      example: "raid_points = 0, tackle_points = 0, super_raids = 2",
      stemConnection: "Track raid and tackle points in kabaddi",
    },
    'data-types': {
      example: "points=35 (int), team='India' (str), isOut=False (bool)",
      stemConnection: "Kabaddi match data with different types",
    },
    conditions: {
      example: "if raiders_out >= 7: print('All Out! Bonus 2 points!')",
      stemConnection: "All-out condition gives bonus points in kabaddi",
    },
    loops: {
      example: "for raid in range(1, total_raids+1): do_raid()",
      stemConnection: "Loop through each raid in a kabaddi match",
    },
    functions: {
      example: "def raid_score(touch_points, bonus): return touch_points + bonus",
      stemConnection: "Calculate raid score including bonus points",
    },
    lists: {
      example: "players_on_bench = ['Deepak', 'Rahul', 'Pawan']",
      stemConnection: "Track which kabaddi players are on bench",
    },
    strings: {
      example: "'Super Raid by Pardeep!'.upper(); 'Bengal 35 - 30 Patna'",
      stemConnection: "Format kabaddi commentary and scores",
    },
    oop: {
      example: "class KabaddiPlayer: def __init__(self, name, role, raid_points): ...",
      stemConnection: "Model kabaddi player as raider or defender object",
    },
    'error-handling': {
      example: "try: avg = raid_points/raids except ZeroDivisionError: ...",
      stemConnection: "Handle player who hasn't raided yet",
    },
    algorithms: {
      example: "find best raider by max raid points in a season",
      stemConnection: "Find top raider, sort teams by points, search player stats",
    },
  },

  basketball: {
    variables: {
      example: "points = 0, rebounds = 5, assists = 3, fouls = 2",
      stemConnection: "Track basketball stats per player",
    },
    'data-types': {
      example: "points=24 (int), player='LeBron' (str), fouled_out=False (bool)",
      stemConnection: "Basketball player stats in different data types",
    },
    conditions: {
      example: "if fouls >= 5: print('Player fouls out!')",
      stemConnection: "5 personal fouls = player removed in basketball",
    },
    loops: {
      example: "for quarter in range(1, 5): play_quarter()",
      stemConnection: "Loop through 4 quarters of basketball game",
    },
    functions: {
      example: "def shooting_percentage(made, attempted): return made/attempted*100",
      stemConnection: "Calculate shooting percentage as a function",
    },
    lists: {
      example: "starters = ['Curry', 'Thompson', 'Green', 'Wiggins', 'Looney']",
      stemConnection: "Store the 5 starting players in basketball lineup",
    },
    strings: {
      example: "play = 'LeBron James 3-pointer from half court!'",
      stemConnection: "Format basketball commentary and announcements",
    },
    oop: {
      example: "class BasketballPlayer: def __init__(self, name, position, ppg): ...",
      stemConnection: "Model player with position (Guard/Forward/Center) and stats",
    },
    'error-handling': {
      example: "try: avg = points/games except ZeroDivisionError: ...",
      stemConnection: "Handle rookie with no games played yet",
    },
    algorithms: {
      example: "sort players by points per game to find MVP",
      stemConnection: "Find MVP, sort stats, search player performance history",
    },
  },

  dance: {
    variables: {
      example: "beat_count = 0, energy = 100, moves_practiced = 15",
      stemConnection: "Track dance performance metrics",
    },
    'data-types': {
      example: "bpm=128 (int), style='Bharatnatyam' (str), on_beat=True (bool)",
      stemConnection: "Dance data — BPM, style name, beat accuracy",
    },
    conditions: {
      example: "if energy < 20: print('Take a break!')",
      stemConnection: "If dancer's energy drops, rest is needed",
    },
    loops: {
      example: "for beat in range(1, 33): perform_step(beat)",
      stemConnection: "Loop through 32 beats of a dance sequence",
    },
    functions: {
      example: "def calculate_score(technique, expression, timing): return (technique+expression+timing)/3",
      stemConnection: "Calculate overall dance score from three criteria",
    },
    lists: {
      example: "routine = ['warm_up', 'tatkaar', 'tehai', 'tihaii', 'cool_down']",
      stemConnection: "Store ordered steps of a dance routine",
    },
    strings: {
      example: "song_name = 'Naatu Naatu'; song_name.upper()",
      stemConnection: "Format song titles and dancer names",
    },
    oop: {
      example: "class Dancer: def __init__(self, name, style, experience_years): ...",
      stemConnection: "Model dancer with their style and experience",
    },
    'error-handling': {
      example: "try: avg_score = total/performances except ZeroDivisionError: ...",
      stemConnection: "Handle new dancer with no performances yet",
    },
    algorithms: {
      example: "find highest-scoring dancer from competition results",
      stemConnection: "Sort dancers by score, find winner, search performance history",
    },
  },

  music: {
    variables: {
      example: "tempo = 120, volume = 80, notes_played = 0",
      stemConnection: "Track musical performance variables",
    },
    'data-types': {
      example: "bpm=120 (int), key='C_major' (str), is_sharp=True (bool)",
      stemConnection: "Music properties — tempo, key signature, sharp/flat",
    },
    conditions: {
      example: "if volume > 100: print('Too loud! Reduce volume.')",
      stemConnection: "Check if music volume is safe for ears",
    },
    loops: {
      example: "for measure in range(1, 9): play_measure(measure)",
      stemConnection: "Loop through 8 measures of a musical phrase",
    },
    functions: {
      example: "def frequency(note, octave): return 440 * (2 ** ((note-9+12*octave)/12))",
      stemConnection: "Calculate sound frequency for any musical note",
    },
    lists: {
      example: "chord = ['C', 'E', 'G'] # C major chord",
      stemConnection: "Store musical notes that form a chord",
    },
    strings: {
      example: "song = 'Jai Ho'; song.upper(); 'Do Re Mi'.split()",
      stemConnection: "Format song names and musical notation",
    },
    oop: {
      example: "class Instrument: def __init__(self, name, type, octaves): ...",
      stemConnection: "Model musical instrument with its properties",
    },
    'error-handling': {
      example: "try: play_note(note) except InvalidNoteError: use_default()",
      stemConnection: "Handle invalid musical notes or out-of-range frequencies",
    },
    algorithms: {
      example: "sort songs by BPM to create a playlist from slow to fast",
      stemConnection: "Sort playlist by tempo, find most-played song, search by key",
    },
  },

  gaming: {
    variables: {
      example: "health = 100, ammo = 30, level = 1, gold = 500",
      stemConnection: "Game character stats stored as variables",
    },
    'data-types': {
      example: "health=100 (int), player='Ninja' (str), alive=True (bool)",
      stemConnection: "Game data — health numbers, player names, alive/dead status",
    },
    conditions: {
      example: "if health <= 0: print('Game Over!') elif health < 20: print('Warning!')",
      stemConnection: "Game over condition when health reaches zero",
    },
    loops: {
      example: "while player_alive: update_game_state()",
      stemConnection: "Game loop — keep running until player dies",
    },
    functions: {
      example: "def deal_damage(attacker_power, defender_armor): return max(0, attacker_power - defender_armor)",
      stemConnection: "Calculate damage dealt as a reusable game function",
    },
    lists: {
      example: "inventory = ['sword', 'shield', 'health_potion', 'map']",
      stemConnection: "Store player's inventory items in a game",
    },
    strings: {
      example: "message = f'Player {name} earned {points} XP!'",
      stemConnection: "Format game messages, chat, and notifications",
    },
    oop: {
      example: "class GameCharacter: def __init__(self, name, health, power): ...",
      stemConnection: "Model game characters with stats and abilities as objects",
    },
    'error-handling': {
      example: "try: load_save(slot) except FileNotFoundError: start_new_game()",
      stemConnection: "Handle missing save file gracefully in games",
    },
    algorithms: {
      example: "pathfinding algorithm to move NPC from A to B avoiding walls",
      stemConnection: "NPC movement, sort leaderboard scores, search game items",
    },
  },

  cooking: {
    variables: {
      example: "temperature = 180, timer = 30, servings = 4",
      stemConnection: "Track cooking temperature, time, and servings",
    },
    'data-types': {
      example: "temp=180 (int), dish='Biryani' (str), is_spicy=True (bool)",
      stemConnection: "Recipe data — temperature numbers, dish names, spicy/not",
    },
    conditions: {
      example: "if temperature > 200: print('Too hot! Reduce flame!')",
      stemConnection: "Check if oven temperature is within safe cooking range",
    },
    loops: {
      example: "for ingredient in recipe: add_to_pot(ingredient)",
      stemConnection: "Add each ingredient from recipe list one by one",
    },
    functions: {
      example: "def scale_recipe(servings, base_servings, ingredient_amount): return ingredient_amount * servings/base_servings",
      stemConnection: "Scale recipe ingredient amounts for different serving sizes",
    },
    lists: {
      example: "ingredients = ['rice', 'water', 'salt', 'spices', 'ghee']",
      stemConnection: "Store all ingredients needed for a recipe",
    },
    strings: {
      example: "recipe_name = 'Dal Makhani'; recipe_name.title()",
      stemConnection: "Format recipe names and cooking instructions as text",
    },
    oop: {
      example: "class Recipe: def __init__(self, name, ingredients, cook_time, calories): ...",
      stemConnection: "Model a recipe as an object with all its properties",
    },
    'error-handling': {
      example: "try: add(ingredient) except AllergyError: suggest_substitute()",
      stemConnection: "Handle missing ingredients or allergy conflicts in recipe",
    },
    algorithms: {
      example: "sort recipes by preparation time to find quickest meal",
      stemConnection: "Sort recipes by time/calories, find healthiest dish, search recipe",
    },
  },

  art: {
    variables: {
      example: "canvas_width = 800, canvas_height = 600, brush_size = 5",
      stemConnection: "Set up digital canvas dimensions and brush properties",
    },
    'data-types': {
      example: "size=800 (int), color='#FF5733' (str), is_filled=True (bool)",
      stemConnection: "Art properties — pixel size, color codes, filled/outline shapes",
    },
    conditions: {
      example: "if brush_size > 20: print('Use for large strokes only')",
      stemConnection: "Guide artist on appropriate brush size for detail work",
    },
    loops: {
      example: "for i in range(0, 360, 30): draw_spoke(angle=i)",
      stemConnection: "Draw 12 spokes of a mandala pattern using loop",
    },
    functions: {
      example: "def mix_colors(color1, color2): return blend(color1, color2, 0.5)",
      stemConnection: "Mix two colors to create a new shade — like a color blender function",
    },
    lists: {
      example: "palette = ['#FF0000', '#FFA500', '#FFFF00', '#00FF00', '#0000FF']",
      stemConnection: "Store artist's color palette as a list of hex codes",
    },
    strings: {
      example: "artwork_title = 'Taj Mahal'; artwork_title.upper()",
      stemConnection: "Format artwork titles and artist signatures as text",
    },
    oop: {
      example: "class Artwork: def __init__(self, title, artist, medium, year): ...",
      stemConnection: "Model an artwork with its title, artist, medium, and year",
    },
    'error-handling': {
      example: "try: load_image(file) except FileNotFoundError: show_placeholder()",
      stemConnection: "Handle missing image files gracefully in art apps",
    },
    algorithms: {
      example: "sort artworks by year to display chronologically in gallery",
      stemConnection: "Sort gallery by date/style, find most-viewed art, search by artist",
    },
  },
}

module.exports = hobbyStemMap
