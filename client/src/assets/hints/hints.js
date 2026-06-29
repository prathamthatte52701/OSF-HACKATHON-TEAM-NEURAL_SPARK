// Pre-written hints for each concept at each level
export const hints = {
  variables: [
    { hint1: "Variables are like labeled containers — name = value", hint2: "In cricket, a player's score is stored in a variable: score = 100", hint3: "Just write: x = 5" },
    { hint1: "You can change a variable's value anytime", hint2: "Like updating a game score: hp = hp - 10", hint3: "Use the = sign to assign" }
  ],
  datatypes: [
    { hint1: "Python has int, float, str, bool types", hint2: "A cricket score is int, a player's name is str", hint3: "Use type() to check the type" },
    { hint1: "Strings go in quotes, numbers don't", hint2: "age = 18 (int), name = 'Rahul' (str)", hint3: "int for whole numbers, float for decimals" }
  ],
  conditions: [
    { hint1: "if condition: do this, else: do that", hint2: "Like in cricket: if score > 100: player.hundred = True", hint3: "Remember the colon after if/else" },
    { hint1: "You can chain conditions with elif", hint2: "if score > 300: 'Excellent', elif score > 200: 'Good'", hint3: "elif means else-if" }
  ],
  loops: [
    { hint1: "for i in range(n): repeats n times", hint2: "Like bowling 6 balls: for ball in range(6): bowl()", hint3: "range(1, 6) gives 1,2,3,4,5" },
    { hint1: "while condition: keeps running until condition is False", hint2: "Like a game: while hp > 0: keep_playing()", hint3: "Don't forget to update the condition variable!" }
  ],
  functions: [
    { hint1: "def function_name(params): body", hint2: "Like a recipe function: def make_chai(cups): return cups * 200ml", hint3: "Call it with: function_name(value)" },
    { hint1: "Functions can return values with 'return'", hint2: "def run_rate(runs, overs): return runs/overs", hint3: "return sends back a value" }
  ],
  lists: [
    { hint1: "Lists use square brackets: [1, 2, 3]", hint2: "Like a cricket team: players = ['Virat', 'Rohit', 'Dhoni']", hint3: "Access with index: players[0]" },
    { hint1: "Lists start at index 0, not 1", hint2: "First player: team[0], Last player: team[-1]", hint3: "len(list) gives the length" }
  ],
  strings: [
    { hint1: "Strings have methods: .upper(), .lower(), .split()", hint2: "Player name formatting: 'virat'.upper() = 'VIRAT'", hint3: "Access with s.method()" },
    { hint1: ".replace() swaps characters in strings", hint2: "Like renaming: 'Hello World'.replace('World', 'Python')", hint3: "s.replace('old', 'new')" }
  ],
  oop: [
    { hint1: "class Name: creates a blueprint, __init__ initializes it", hint2: "class Player: def __init__(self, name): self.name = name", hint3: "self refers to the current object" },
    { hint1: "Create objects: p = Player('Virat')", hint2: "Access attributes: p.name", hint3: "Methods are functions inside a class" }
  ],
  errors: [
    { hint1: "try: risky code, except ErrorType: handle it", hint2: "try: 10/0 except ZeroDivisionError: print('Cannot divide!')", hint3: "except can catch specific errors" },
    { hint1: "finally: always runs, error or not", hint2: "Like cleanup after a game, win or lose", hint3: "try/except/finally structure" }
  ],
  algorithms: [
    { hint1: "Sorting algorithms arrange data in order", hint2: "Like ranking cricket players by score", hint3: "Python has sorted() built-in" },
    { hint1: "Search algorithms find items in data", hint2: "Like finding a player in a team list", hint3: "Linear search: check one by one" }
  ]
};

export const getHints = (concept) => hints[concept] || hints['variables'];
