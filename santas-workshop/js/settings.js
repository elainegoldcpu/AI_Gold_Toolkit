/* =========================================================
   SANTA'S WORKSHOP: SETTINGS
   ---------------------------------------------------------
   This is the place to change names, words and colours.
   You don't need to touch any other file to do that.

   Tips for editing:
   - Keep the quote marks around words: 'like this'
   - Keep the comma at the end of each line
   - Colours are "hex codes". Search "colour picker" online
     to find the code for any colour you like.
   ========================================================= */

window.SETTINGS = {

  /* ---------- The game's name and opening words ---------- */
  gameTitle: "Santa's Workshop",
  subtitle: "Help the elves get ready for Christmas!",
  designedBy: "Designed by Elodie, aged 9",

  /* ---------- Colours ---------- */
  colours: {
    skyTop:      '#16325c',  // night sky, top
    skyBottom:   '#3d6db3',  // night sky, near the snow
    snow:        '#ffffff',
    red:         '#d93b3b',
    green:       '#2e9b5a',
    gold:        '#f7c548',
    cream:       '#fff8e8',  // cards and speech bubbles
    wood:        '#9b6a43',  // workshop walls and shelves
    woodDark:    '#6e4527',
    text:        '#2a2a3c',
    teal:        '#5cc3c8',  // friendly highlight colour
    soft:        '#ffe7ec'   // gentle "nearly" colour
  },

  /* ---------- Characters ----------
     Change a name here and it changes everywhere in the game.
     hat, tunic and skin are colours for the drawn elves. */
  characters: {
    elf1:     { name: 'Pip',     hat: '#d93b3b', tunic: '#2e9b5a', skin: '#ffd9b8' },
    elf2:     { name: 'Holly',   hat: '#2e9b5a', tunic: '#d93b3b', skin: '#e9b48c' },
    reindeer: { name: 'Twinkle', emoji: '🦌' },
    santa:    { name: 'Santa',   emoji: '🎅' }
  },

  /* ---------- The rooms on the map ----------
     ready: true  means children can play it.
     ready: false means it shows as "the elves are still building this room". */
  scenes: [
    { id: 'workshop',   name: 'The Workshop Floor',  emoji: '🧸', blurb: 'Count and pack the toys',   ready: true  },
    { id: 'decoration', name: 'The Decoration Room', emoji: '🎄', blurb: 'Finish the patterns',       ready: false },
    { id: 'letters',    name: 'The Letter Room',     emoji: '💌', blurb: 'Solve the word puzzles',    ready: false },
    { id: 'stable',     name: 'The Stable Mystery',  emoji: '🦌', blurb: 'Find the missing reindeer', ready: false }
  ],

  /* ---------- Levels ---------- */
  levels: [
    { id: 'easy',   name: 'Easy',   label: 'Ages 5 to 6', icon: '❄️' },
    { id: 'medium', name: 'Medium', label: 'Age 7',       icon: '❄️❄️' },
    { id: 'hard',   name: 'Hard',   label: 'Ages 8 to 9', icon: '❄️❄️❄️' }
  ],

  /* ---------- Gentle level suggestions ----------
     After this many right (or wrong) answers in a row,
     an elf offers a harder (or easier) puzzle. */
  rightInARowToOfferHarder: 4,
  wrongInARowToOfferEasier: 3,

  /* ---------- Words the game says ----------
     {elf1}, {elf2}, {reindeer} and {santa} are swapped for the names above. */
  words: {
    play:          "Let's play!",
    chooseLevel:   'How tricky shall we make it?',
    mapTitle:      'Where shall we help today?',
    mapHelp:       'Tap a room to go inside.',
    beingBuilt:    'The elves are still building this room!',
    roomDone:      'All done!',
    visit:         'Go in',
    sleighTitle:   "Santa's sleigh",
    sleighEmpty:   'The sleigh is empty. Help the elves to fill it!',
    next:          'Next puzzle',
    backToMap:     'Back to the map',
    readToMe:      'Read to me',
    hintPrefix:    'Hint:',
    showMe:        "Here's a clue. Try the one that's glowing!",

    praise: [
      'Brilliant!', 'Well done!', 'You did it!', 'Super counting!',
      'Fantastic!', 'Hooray!', 'Spot on!', 'Clever you!'
    ],
    nearly: [
      'Nearly! Try again.', 'Ooh, close! Have another go.',
      'Not quite. You can do it!', 'Nearly there! Try again.'
    ],

    offerHarder:   '{elf1} says: "You\'re a star! Would you like some trickier puzzles?"',
    offerEasier:   '{elf1} says: "These are tricky ones! Would you like some easier puzzles for a bit?"',
    yesPlease:     'Yes please',
    stayHere:      'Stay the same',

    sceneDoneTitle: 'Hooray! {scene} is ready!',
    sceneDoneText:  '{elf1} and {elf2} put {count} toys in the sleigh. Thank you!',
    allDoneButton:  'See the sleigh take off!',

    celebrateTitle: 'Merry Christmas!',
    celebrateText:  "You helped get everything ready. {santa}'s sleigh is off!",
    playAgain:      'Play again',

    grownUps:       'Grown-ups',
    grownUpsHold:   'Press and hold for grown-up settings',
    grownUpsTitle:  'Grown-up settings',
    privacyNote:    'This game asks for no names, shows no ads, and has no chat or links out. Progress is saved only in this browser on this device.',
    resetProgress:  'Start again from the beginning',
    resetCheck:     'Clear all stars and toys on this device?',
    close:          'Close'
  }
};
