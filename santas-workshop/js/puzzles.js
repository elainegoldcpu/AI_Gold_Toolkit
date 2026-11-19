/* =========================================================
   SANTA'S WORKSHOP: PUZZLES
   ---------------------------------------------------------
   All the puzzle content lives here.

   Each room has:
   - rounds:   the list of puzzles a child plays, for each level.
               The game shuffles the order. Add or remove names
               to make a room longer or shorter.
   - numbers:  the number ranges for each kind of maths puzzle.
   - hints:    what the elf says after a "Nearly!".
   - extra:    your own hand-written questions (see the examples).

   Puzzle kinds you can use in "rounds":
     count          count the toys on a shelf
     add            add toys into a sack
     takeaway       toys leave the conveyor belt
     share          share toys equally between sacks
     pattern        what number comes next on the belt
     matchWord      tap the picture that matches a word
     missingLetter  fill in the missing letter
     unscramble     put the letters in order
     extra          one of your hand-written questions below
   ========================================================= */

window.PUZZLES = {

  /* ---------- The toys ----------
     word:   the toy's name (lower case)
     plural: what you call more than one
     emoji:  the picture
     level:  which word puzzles it suits (easy words are short) */
  toys: [
    { word: 'car',    plural: 'cars',    emoji: '🚗', level: 'easy' },
    { word: 'ball',   plural: 'balls',   emoji: '⚽', level: 'easy' },
    { word: 'drum',   plural: 'drums',   emoji: '🥁', level: 'easy' },
    { word: 'kite',   plural: 'kites',   emoji: '🪁', level: 'easy' },
    { word: 'duck',   plural: 'ducks',   emoji: '🦆', level: 'easy' },
    { word: 'boat',   plural: 'boats',   emoji: '⛵', level: 'easy' },
    { word: 'teddy',  plural: 'teddies', emoji: '🧸', level: 'medium' },
    { word: 'train',  plural: 'trains',  emoji: '🚂', level: 'medium' },
    { word: 'robot',  plural: 'robots',  emoji: '🤖', level: 'medium' },
    { word: 'trumpet', plural: 'trumpets', emoji: '🎺', level: 'hard' },
    { word: 'rocket', plural: 'rockets', emoji: '🚀', level: 'hard' },
    { word: 'guitar', plural: 'guitars', emoji: '🎸', level: 'hard' },
    { word: 'puzzle', plural: 'puzzles', emoji: '🧩', level: 'hard' },
    { word: 'parcel', plural: 'parcels', emoji: '🎁', level: 'hard' }
  ],

  /* =======================================================
     ROOM 1: THE WORKSHOP FLOOR
     ======================================================= */
  workshop: {
    intro: '{elf1} needs help filling the sleigh sacks. Let\'s count and pack the toys!',

    rounds: {
      easy:   ['count', 'count', 'add', 'takeaway', 'pattern', 'matchWord'],
      medium: ['count', 'add', 'takeaway', 'share', 'pattern', 'missingLetter'],
      hard:   ['count', 'add', 'takeaway', 'share', 'pattern', 'unscramble', 'extra']
    },

    numbers: {
      count:    { easy: { min: 2, max: 10 },  medium: { min: 8, max: 20 },  hard: { min: 15, max: 30 } },
      add:      { easy: { max: 10 },          medium: { max: 20 },          hard: { max: 50 } },
      takeaway: { easy: { max: 10 },          medium: { max: 20 },          hard: { max: 50 } },
      share:    { easy: { sacks: [2], most: 10 }, medium: { sacks: [2, 3], most: 15 }, hard: { sacks: [2, 3, 4, 5], most: 30 } },
      pattern:  { easy: { steps: [1] },       medium: { steps: [2, 5, 10] }, hard: { steps: [3, 4, 5, -2, -10] } }
    },

    hints: {
      count:         'Tap each toy as you count it. It gets a number!',
      add:           'Start with the bigger number, then count on.',
      takeaway:      'Count the toys that are still on the belt.',
      share:         'Give one toy to each sack, again and again, until they are all gone.',
      pattern:       'Look at how the numbers change each time.',
      matchWord:     'Say the word slowly. What sound does it start with?',
      missingLetter: 'Say the word slowly and listen for each sound.',
      unscramble:    'Look at the picture. What toy is it? Which letter does it start with?',
      extra:         'Read it again slowly. You can tap "Read to me".'
    },

    /* ---------- Hand-written questions ----------
       Copy one of these to add your own. Keep the answer
       exactly the same as one of the options. */
    extra: [
      { level: 'hard',   emoji: '🎁', text: 'Santa has 4 sacks. Each sack holds 5 parcels. How many parcels is that?', options: ['9', '20', '15', '25'], answer: '20' },
      { level: 'hard',   emoji: '🧦', text: 'Holly knits 3 stockings every day. How many has she knitted after 4 days?', options: ['7', '12', '10', '16'], answer: '12' },
      { level: 'medium', emoji: '🍪', text: 'Pip baked 10 biscuits and ate 2. How many are left?', options: ['8', '12', '7'], answer: '8' },
      { level: 'easy',   emoji: '⭐', text: 'Which number is bigger?', options: ['3', '7'], answer: '7' }
    ]
  }

  /* Rooms 2, 3 and 4 will go here. */
};
