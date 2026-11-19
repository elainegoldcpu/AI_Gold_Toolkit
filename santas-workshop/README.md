# Santa's Workshop

A Christmas learning game for children aged 5 to 9, designed by Elodie, aged 9.

The child helps the elves get Santa's workshop ready. Each room mixes maths and word puzzles. Every right answer earns a star and puts a toy in Santa's sleigh. Finishing every room makes the sleigh take off.

## Try it on your computer

1. Download this `santas-workshop` folder (on GitHub: the green "Code" button, then "Download ZIP", then unzip it).
2. Double-click `index.html`. It opens in your web browser and you can play straight away.

No installation, no internet connection needed once downloaded.

## What's in the folder

| File | What it's for | Safe to edit? |
|---|---|---|
| `js/settings.js` | Game name, character names, all the words on screen, colours, which rooms are open | Yes, start here |
| `js/puzzles.js` | Toys, number ranges for each level, hints, hand-written questions | Yes |
| `js/art.js` | The drawn elves, sacks and sleigh | Yes, with care |
| `css/styles.css` | Layout, sizes and animations | With care |
| `js/game.js` | The engine that runs everything | Best left alone |
| `index.html` | The page that loads it all | Best left alone |

## Common changes

- **Rename an elf:** in `settings.js`, change `name: 'Pip'` to the new name. It updates everywhere.
- **Change a colour:** in `settings.js`, change the code next to the colour, for example `red: '#d93b3b'`.
- **Add a toy:** in `puzzles.js`, copy a line in the `toys` list and change the word, plural and emoji.
- **Add your own question:** in `puzzles.js`, copy one of the `extra` questions and change the text, options and answer.
- **Make a room longer:** in `puzzles.js`, add more puzzle names to that level's `rounds` list.
- **Open a new room:** in `settings.js`, change `ready: false` to `ready: true` once its puzzles exist.

After any change, save the file and refresh the browser page.

## Safety and privacy

- No ads, no chat, no sign-in, no links out, no purchases.
- No names or personal details are asked for.
- Progress (level, stars, toys) is saved only in the browser on that device. Grown-up settings has a button to clear it.
- The game makes no internet requests at all. Sounds are made in the browser and read-aloud uses the device's own voice.

## Grown-up settings

Press and hold the ⚙️ Grown-ups button for about a second. A quick tap does nothing, so younger children won't open it by accident. From there you can change the level, turn sounds and automatic read-aloud on or off, and start again.
