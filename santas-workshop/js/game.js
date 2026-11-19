/* =========================================================
   SANTA'S WORKSHOP: THE GAME
   ---------------------------------------------------------
   This file runs the game. To change words, names, colours
   or puzzles, use settings.js and puzzles.js instead.

   Sections in this file:
     1. Helpers
     2. Saving progress (this device only)
     3. Sounds and reading aloud
     4. Snow and colours
     5. Screens: start, level, map
     6. Playing a room
     7. Puzzle makers (one for each puzzle kind)
     8. Answers and feedback
     9. Room finished and the big celebration
    10. Grown-up settings
    11. Start the game
   ========================================================= */

(function () {
  'use strict';

  var S = window.SETTINGS;
  var P = window.PUZZLES;
  var W = S.words;
  var app = document.getElementById('app');

  /* =======================================================
     1. HELPERS
     ======================================================= */

  function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }
  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // Swap {elf1}, {santa}, {scene} etc. for real names
  function fill(text, extra) {
    var names = {
      elf1: S.characters.elf1.name,
      elf2: S.characters.elf2.name,
      reindeer: S.characters.reindeer.name,
      santa: S.characters.santa.name
    };
    extra = extra || {};
    return String(text).replace(/\{(\w+)\}/g, function (m, key) {
      if (extra[key] !== undefined) return extra[key];
      if (names[key] !== undefined) return names[key];
      return m;
    });
  }

  function sceneById(id) {
    for (var i = 0; i < S.scenes.length; i++) if (S.scenes[i].id === id) return S.scenes[i];
    return null;
  }

  function levelById(id) {
    for (var i = 0; i < S.levels.length; i++) if (S.levels[i].id === id) return S.levels[i];
    return S.levels[0];
  }

  function levelIndex(id) {
    for (var i = 0; i < S.levels.length; i++) if (S.levels[i].id === id) return i;
    return 0;
  }

  function on(selector, handler) {
    var els = app.querySelectorAll(selector);
    for (var i = 0; i < els.length; i++) els[i].addEventListener('click', handler);
  }

  /* =======================================================
     2. SAVING PROGRESS (only in this browser, on this device)
     ======================================================= */

  var SAVE_KEY = 'santasWorkshop.progress.v1';

  var state = {
    level: null,          // 'easy', 'medium' or 'hard'
    done: {},             // which rooms are finished
    sleigh: [],           // toys collected (emoji)
    sound: true,
    autoRead: false,
    celebrated: false
  };

  function load() {
    try {
      var saved = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null');
      if (saved) for (var k in state) if (saved[k] !== undefined) state[k] = saved[k];
    } catch (e) { /* storage blocked: the game still works, it just won't remember */ }
  }

  function save() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  /* =======================================================
     3. SOUNDS AND READING ALOUD
     Sounds are made in the browser, so there are no sound
     files to download. They are soft and short.
     ======================================================= */

  var audio = null;

  function bell(freq, when, length, volume) {
    var t = audio.currentTime + when;
    [1, 2, 3.01].forEach(function (ratio, n) {
      var osc = audio.createOscillator();
      var gain = audio.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq * ratio;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(volume / (n + 1), t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + length);
      osc.connect(gain).connect(audio.destination);
      osc.start(t);
      osc.stop(t + length + 0.05);
    });
  }

  var tunes = {
    tap:     [[880, 0, 0.25]],
    right:   [[784, 0, 0.5], [988, 0.12, 0.5], [1175, 0.24, 0.8]],
    nearly:  [[440, 0, 0.4], [392, 0.18, 0.5]],
    sceneDone: [[659, 0, .4], [659, .2, .4], [659, .4, .7], [659, .8, .4], [659, 1, .4], [659, 1.2, .7],
                [659, 1.6, .4], [784, 1.8, .4], [523, 2, .5], [587, 2.25, .4], [659, 2.5, 1]],
    takeOff: [[523, 0, .5], [659, .15, .5], [784, .3, .5], [1047, .45, .9], [1319, .7, 1.2]]
  };

  function play(name) {
    if (!state.sound) return;
    try {
      if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === 'suspended') audio.resume();
      (tunes[name] || []).forEach(function (note) { bell(note[0], note[1], note[2], 0.07); });
    } catch (e) { /* no sound available: carry on quietly */ }
  }

  var ukVoice = null;
  function findVoice() {
    if (!('speechSynthesis' in window)) return;
    var voices = speechSynthesis.getVoices();
    for (var i = 0; i < voices.length; i++) {
      if (voices[i].lang === 'en-GB') { ukVoice = voices[i]; return; }
    }
  }
  if ('speechSynthesis' in window) {
    findVoice();
    speechSynthesis.onvoiceschanged = findVoice;
  }

  function speak(text) {
    if (!('speechSynthesis' in window)) return;
    try {
      speechSynthesis.cancel();
      var clean = String(text).replace(/\p{Extended_Pictographic}|️/gu, '').replace(/_/g, ' gap ');
      var say = new SpeechSynthesisUtterance(clean);
      say.lang = 'en-GB';
      if (ukVoice) say.voice = ukVoice;
      say.rate = 0.9;
      say.pitch = 1.1;
      speechSynthesis.speak(say);
    } catch (e) { /* ignore */ }
  }

  function stopSpeaking() {
    if ('speechSynthesis' in window) speechSynthesis.cancel();
  }

  /* =======================================================
     4. SNOW AND COLOURS
     ======================================================= */

  function applyColours() {
    var root = document.documentElement.style;
    for (var name in S.colours) root.setProperty('--' + name, S.colours[name]);
    document.title = S.gameTitle;
  }

  function makeSnow() {
    var snow = document.getElementById('snow');
    var quiet = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var count = quiet ? 0 : 36;
    var html = '';
    for (var i = 0; i < count; i++) {
      var size = randInt(8, 22);
      html += '<span class="flake" style="left:' + randInt(0, 100) + '%;' +
        'font-size:' + size + 'px;' +
        'animation-duration:' + randInt(9, 20) + 's,' + randInt(3, 6) + 's;' +
        'animation-delay:-' + randInt(0, 20) + 's,-' + randInt(0, 6) + 's;' +
        'opacity:' + (0.5 + Math.random() * 0.5).toFixed(2) + '">❄</span>';
    }
    snow.innerHTML = html;
  }

  function lights() {
    var colours = [S.colours.red, S.colours.gold, S.colours.green, S.colours.teal];
    var html = '<div class="lights" aria-hidden="true">';
    for (var i = 0; i < 14; i++) {
      html += '<span class="bulb" style="--c:' + colours[i % 4] + ';animation-delay:' + (i % 4) * 0.4 + 's"></span>';
    }
    return html + '</div>';
  }

  // The bar along the top of every screen
  function topBar(showMap) {
    return '' +
      '<header class="topbar">' +
        (showMap
          ? '<button class="pill" id="go-map" aria-label="' + W.backToMap + '">🗺️ <span>Map</span></button>'
          : '<span></span>') +
        '<div class="topbar-right">' +
          '<button class="pill" id="sound-btn" aria-pressed="' + state.sound + '" aria-label="Sound ' + (state.sound ? 'on' : 'off') + '">' +
            (state.sound ? '🔔 <span>Sound on</span>' : '🔕 <span>Sound off</span>') +
          '</button>' +
          '<button class="pill hold" id="grownups-btn" aria-label="' + W.grownUpsHold + '" title="' + W.grownUpsHold + '">' +
            '⚙️ <span>' + W.grownUps + '</span><i class="hold-fill"></i>' +
          '</button>' +
        '</div>' +
      '</header>';
  }

  function wireTopBar() {
    on('#go-map', function () { stopSpeaking(); play('tap'); showMap(); });
    on('#sound-btn', function () {
      state.sound = !state.sound;
      save();
      if (!state.sound) stopSpeaking();
      var b = document.getElementById('sound-btn');
      b.setAttribute('aria-pressed', state.sound);
      b.setAttribute('aria-label', 'Sound ' + (state.sound ? 'on' : 'off'));
      b.innerHTML = state.sound ? '🔔 <span>Sound on</span>' : '🔕 <span>Sound off</span>';
      play('tap');
    });
    wireHold(document.getElementById('grownups-btn'), openGrownUps);
  }

  /* =======================================================
     5. SCREENS: START, LEVEL, MAP
     ======================================================= */

  function showStart() {
    app.className = 'screen screen-start';
    app.innerHTML = '' +
      lights() +
      '<div class="start-card">' +
        '<div class="elf-pair">' + ART.elf('elf1', 'cheer') + ART.elf('elf2', 'cheer') + '</div>' +
        '<h1>' + S.gameTitle + '</h1>' +
        '<p class="big">' + S.subtitle + '</p>' +
        '<button class="btn btn-go" id="play">' + W.play + '</button>' +
        '<p class="credit">' + S.designedBy + '</p>' +
      '</div>';
    on('#play', function () {
      play('right');
      if (state.level) showMap(); else showLevelPick(true);
    });
  }

  function showLevelPick(firstTime) {
    app.className = 'screen screen-level';
    var buttons = S.levels.map(function (lv) {
      return '<button class="btn level-btn" data-level="' + lv.id + '">' +
        '<span class="level-icon">' + lv.icon + '</span>' +
        '<span class="level-name">' + lv.name + '</span>' +
        '<span class="level-label">' + lv.label + '</span>' +
      '</button>';
    }).join('');
    app.innerHTML = '' +
      '<div class="card center">' +
        '<div class="elf-solo">' + ART.elf('elf1') + '</div>' +
        '<h2>' + W.chooseLevel + '</h2>' +
        '<div class="level-row">' + buttons + '</div>' +
      '</div>';
    on('.level-btn', function (e) {
      state.level = e.currentTarget.getAttribute('data-level');
      save();
      play('right');
      showMap();
    });
    if (state.autoRead) speak(W.chooseLevel);
  }

  function allReadyDone() {
    return S.scenes.every(function (sc) { return !sc.ready || state.done[sc.id]; });
  }

  function sleighHtml() {
    var toys = state.sleigh;
    var shown = toys.slice(-40).join('');
    var more = toys.length > 40 ? '<span class="more">+' + (toys.length - 40) + '</span>' : '';
    return '' +
      '<section class="sleigh-box" aria-label="' + W.sleighTitle + '">' +
        '<div class="sleigh-pic">' + ART.sleigh() + '</div>' +
        '<div>' +
          '<h3>' + W.sleighTitle + ' <span class="count-badge">' + toys.length + ' 🎁</span></h3>' +
          '<div class="sleigh-toys">' + (toys.length ? shown + more : '<span class="muted">' + W.sleighEmpty + '</span>') + '</div>' +
        '</div>' +
      '</section>';
  }

  function showMap() {
    app.className = 'screen screen-map';
    var rooms = S.scenes.map(function (sc) {
      var done = state.done[sc.id];
      var status = !sc.ready
        ? '<span class="status building">🔨 ' + W.beingBuilt + '</span>'
        : done ? '<span class="status done">⭐ ' + W.roomDone + '</span>'
               : '<span class="status go">' + W.visit + ' ➜</span>';
      return '<button class="room room-' + sc.id + (sc.ready ? '' : ' locked') + (done ? ' is-done' : '') + '"' +
        ' data-scene="' + sc.id + '"' + (sc.ready ? '' : ' aria-disabled="true"') + '>' +
        '<span class="room-roof" aria-hidden="true"></span>' +
        '<span class="room-emoji">' + sc.emoji + '</span>' +
        '<span class="room-name">' + sc.name + '</span>' +
        '<span class="room-blurb">' + sc.blurb + '</span>' +
        status +
      '</button>';
    }).join('');

    var finale = allReadyDone() && state.sleigh.length
      ? '<button class="btn btn-go finale-btn" id="finale">🛷 ' + W.allDoneButton + '</button>'
      : '';

    app.innerHTML = '' +
      topBar(false) +
      lights() +
      '<h2 class="map-title">' + W.mapTitle + '</h2>' +
      '<p class="map-help">' + W.mapHelp + ' <span class="level-chip">' + levelById(state.level).icon + ' ' + levelById(state.level).name + '</span></p>' +
      '<div class="rooms">' + rooms + '</div>' +
      finale +
      sleighHtml();

    wireTopBar();
    on('.room', function (e) {
      var sc = sceneById(e.currentTarget.getAttribute('data-scene'));
      if (!sc.ready) {
        play('nearly');
        e.currentTarget.classList.remove('wobble');
        void e.currentTarget.offsetWidth;
        e.currentTarget.classList.add('wobble');
        speak(W.beingBuilt);
        return;
      }
      play('tap');
      startScene(sc.id);
    });
    on('#finale', function () { showCelebration(); });
    if (state.autoRead) speak(W.mapTitle + ' ' + W.mapHelp);
  }

  /* =======================================================
     6. PLAYING A ROOM
     ======================================================= */

  var room = null;   // what's happening in the room right now

  function startScene(id) {
    var data = P[id];
    room = {
      id: id,
      data: data,
      rounds: shuffleRounds(data.rounds[state.level]),
      index: 0,
      stars: 0,
      toys: [],
      rightRun: 0,
      wrongRun: 0,
      puzzle: null,
      tries: 0,
      solved: false,
      usedExtras: []
    };
    nextPuzzle();
  }

  // Shuffle, but try not to put the same kind twice in a row
  function shuffleRounds(list) {
    var best = shuffle(list);
    for (var go = 0; go < 20; go++) {
      var ok = true;
      for (var i = 1; i < best.length; i++) if (best[i] === best[i - 1]) ok = false;
      if (ok) return best;
      best = shuffle(list);
    }
    return best;
  }

  function nextPuzzle() {
    if (room.index >= room.rounds.length) { showSceneDone(); return; }
    var kind = room.rounds[room.index];
    var maker = makers[kind] || makers.count;
    room.puzzle = maker(state.level, room.data);
    room.puzzle.kind = kind;
    room.tries = 0;
    room.solved = false;
    showPuzzle();
  }

  function starsRow() {
    var html = '';
    for (var i = 0; i < room.rounds.length; i++) {
      html += '<span class="star' + (i < room.stars ? ' got' : '') + '">' + (i < room.stars ? '⭐' : '☆') + '</span>';
    }
    return '<div class="stars" aria-label="' + room.stars + ' of ' + room.rounds.length + ' stars">' + html + '</div>';
  }

  function showPuzzle() {
    var pz = room.puzzle;
    var sc = sceneById(room.id);
    app.className = 'screen screen-scene scene-' + room.id;

    var answerArea;
    if (pz.mode === 'build') {
      var slots = pz.word.split('').map(function () { return '<span class="slot"></span>'; }).join('');
      var tiles = pz.tiles.map(function (ch, i) {
        return '<button class="tile" data-i="' + i + '" data-letter="' + ch + '">' + ch + '</button>';
      }).join('');
      answerArea = '<div class="slots" id="slots">' + slots + '</div><div class="tiles">' + tiles + '</div>';
    } else {
      answerArea = '<div class="answers answers-' + pz.options.length + (pz.emojiOptions ? ' emoji-answers' : '') + '">' +
        pz.options.map(function (opt) {
          return '<button class="answer" data-value="' + opt + '">' + opt + '</button>';
        }).join('') +
      '</div>';
    }

    app.innerHTML = '' +
      topBar(true) +
      lights() +
      '<div class="scene-head">' +
        '<h2>' + sc.emoji + ' ' + sc.name + '</h2>' +
        starsRow() +
      '</div>' +
      (room.index === 0 && room.data.intro ? '<p class="intro">' + fill(room.data.intro) + '</p>' : '') +
      '<section class="puzzle card">' +
        '<div class="puzzle-top">' +
          '<div class="elf-helper" id="helper">' + ART.elf(pz.elf || 'elf1') + '</div>' +
          '<div class="bubble">' +
            '<p class="prompt">' + pz.prompt + '</p>' +
            '<button class="pill read-btn" id="read">🔊 ' + W.readToMe + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="visual">' + pz.visual + '</div>' +
        answerArea +
        '<div class="feedback" id="feedback" role="status"></div>' +
      '</section>';

    wireTopBar();
    on('#read', function () { speak(pz.speak || pz.prompt); });
    on('.answer', function (e) { checkChoice(e.currentTarget); });
    on('.tile', function (e) { checkTile(e.currentTarget); });
    wireCounting();
    wireSharing();

    if (state.autoRead && state.sound) speak(pz.speak || pz.prompt);
  }

  // Tapping toys on the shelf gives each one a number
  function wireCounting() {
    var counted = [];
    var toys = app.querySelectorAll('.countable');
    function renumber() {
      for (var i = 0; i < toys.length; i++) {
        var n = counted.indexOf(toys[i]);
        toys[i].classList.toggle('counted', n > -1);
        toys[i].setAttribute('data-n', n > -1 ? n + 1 : '');
      }
    }
    for (var i = 0; i < toys.length; i++) {
      toys[i].addEventListener('click', function (e) {
        var t = e.currentTarget;
        var n = counted.indexOf(t);
        if (n > -1) counted.splice(n, 1); else counted.push(t);
        renumber();
        play('tap');
      });
    }
  }

  // Tapping a sack moves one toy from the pile into it
  function wireSharing() {
    var pile = app.querySelector('.share-pile');
    if (!pile) return;
    on('.share-sack', function (e) {
      var toy = pile.querySelector('.toy:not(.moved)');
      if (!toy) return;
      toy.classList.add('moved');
      var label = e.currentTarget.querySelector('text');
      var n = (parseInt(e.currentTarget.getAttribute('data-n'), 10) || 0) + 1;
      e.currentTarget.setAttribute('data-n', n);
      if (label) label.textContent = n;
      e.currentTarget.classList.remove('bump');
      void e.currentTarget.offsetWidth;
      e.currentTarget.classList.add('bump');
      play('tap');
    });
  }

  /* =======================================================
     7. PUZZLE MAKERS
     Each one returns a puzzle: what to say, what to show,
     and the right answer.
     ======================================================= */

  function randomToy() { return pick(P.toys); }

  function toyName(toy, n) { return n === 1 ? toy.word : toy.plural; }

  // Draw a row of toys. groupBy puts them in neat rows (handy for big numbers)
  function toys(emoji, n, opts) {
    opts = opts || {};
    var html = '';
    for (var i = 0; i < n; i++) {
      var gone = opts.goneFrom !== undefined && i >= opts.goneFrom;
      html += '<span class="toy' + (opts.countable ? ' countable' : '') + (gone ? ' gone' : '') + '"' +
        (opts.countable ? ' role="button" tabindex="0"' : '') + '>' + emoji + '</span>';
      if (opts.groupBy && (i + 1) % opts.groupBy === 0 && i < n - 1) html += '<span class="group-break"></span>';
    }
    return html;
  }

  // Wrong answers that are close to the right one
  function numberOptions(answer, level) {
    var howMany = level === 'easy' ? 3 : 4;
    var set = [answer];
    var spread = [1, -1, 2, -2, 10, -10, 3, -3];
    if (level === 'hard') spread = [1, -1, 10, -10, 2, -2, 5, -5];
    for (var i = 0; i < spread.length && set.length < howMany; i++) {
      var v = answer + spread[i];
      if (v >= 0 && set.indexOf(v) === -1 && Math.random() > 0.2) set.push(v);
    }
    for (var k = 1; set.length < howMany; k++) if (set.indexOf(answer + k) === -1) set.push(answer + k);
    return shuffle(set).map(String);
  }

  function hintFor(kind, data) { return (data.hints && data.hints[kind]) || ''; }

  var makers = {

    count: function (level, data) {
      var r = data.numbers.count[level];
      var n = randInt(r.min, r.max);
      var toy = randomToy();
      return {
        prompt: 'How many ' + toy.plural + ' are on the shelf?',
        visual: '<div class="shelf">' + toys(toy.emoji, n, { countable: true, groupBy: n > 10 ? 5 : 0 }) + '</div>',
        options: numberOptions(n, level),
        answer: String(n),
        hint: hintFor('count', data),
        reward: toy.emoji
      };
    },

    add: function (level, data) {
      var max = data.numbers.add[level].max;
      var total = randInt(Math.max(3, Math.floor(max / 3)), max);
      var a = randInt(1, total - 1);
      var b = total - a;
      var toy = randomToy();
      var elf = S.characters.elf2.name;
      var visual = total <= 20
        ? '<div class="sum">' +
            '<div class="in-sack"><div class="pile">' + toys(toy.emoji, a) + '</div>' + ART.sack() + '</div>' +
            '<span class="op">+</span>' +
            '<div class="pile arriving">' + toys(toy.emoji, b) + '</div>' +
          '</div>'
        : '<div class="sum">' +
            '<div class="num-card">' + ART.sack(a) + '<span>' + toy.emoji + ' in the sack</span></div>' +
            '<span class="op">+</span>' +
            '<div class="num-card"><b>' + b + '</b><span>' + toy.emoji + ' more</span></div>' +
          '</div>';
      return {
        elf: 'elf2',
        prompt: 'The sack has ' + a + ' ' + toyName(toy, a) + '. ' + elf + ' adds ' + b + ' more. How many are in the sack now?',
        visual: visual,
        options: numberOptions(total, level),
        answer: String(total),
        hint: hintFor('add', data),
        reward: toy.emoji
      };
    },

    takeaway: function (level, data) {
      var max = data.numbers.takeaway[level].max;
      var n = randInt(Math.max(4, Math.floor(max / 2)), max);
      var k = randInt(1, n - 1);
      var left = n - k;
      var toy = randomToy();
      var visual = n <= 20
        ? '<div class="belt">' + toys(toy.emoji, n, { goneFrom: left }) + '</div>' +
          '<p class="small-note">The faded ones are going into the sack.</p>'
        : '<div class="sum">' +
            '<div class="num-card"><b>' + n + '</b><span>' + toy.emoji + ' on the belt</span></div>' +
            '<span class="op">−</span>' +
            '<div class="num-card">' + ART.sack(k) + '<span>into the sack</span></div>' +
          '</div>';
      return {
        prompt: 'There are ' + n + ' ' + toy.plural + ' on the conveyor belt. ' + k + ' go into the sleigh sack. How many are left on the belt?',
        visual: visual,
        options: numberOptions(left, level),
        answer: String(left),
        hint: hintFor('takeaway', data),
        reward: toy.emoji
      };
    },

    share: function (level, data) {
      var r = data.numbers.share[level];
      var sacks = pick(r.sacks);
      var each = randInt(2, Math.max(2, Math.floor(r.most / sacks)));
      var total = sacks * each;
      var toy = randomToy();
      var sackHtml = '';
      for (var i = 0; i < sacks; i++) {
        sackHtml += '<button class="share-sack" aria-label="Put a toy in sack ' + (i + 1) + '">' + ART.sack(0) + '</button>';
      }
      return {
        prompt: 'Share ' + total + ' ' + toy.plural + ' equally between ' + sacks + ' sacks. How many go in each sack?',
        visual: '<div class="share-pile">' + toys(toy.emoji, total) + '</div>' +
                '<p class="small-note">Tap a sack to drop a toy in.</p>' +
                '<div class="share-sacks">' + sackHtml + '</div>',
        options: numberOptions(each, level),
        answer: String(each),
        hint: hintFor('share', data),
        reward: toy.emoji
      };
    },

    pattern: function (level, data) {
      var step = pick(data.numbers.pattern[level].steps);
      var start = step > 0 ? (level === 'easy' ? randInt(1, 5) : step * randInt(0, 4) + (level === 'hard' ? randInt(0, 3) : 0))
                           : randInt(5, 9) * Math.abs(step);
      var seq = [start, start + step, start + 2 * step, start + 3 * step];
      var next = start + 4 * step;
      var boxes = seq.map(function (v) { return '<span class="parcel">' + v + '</span>'; }).join('') +
        '<span class="parcel mystery">?</span>';
      return {
        prompt: 'The parcels on the belt have numbers. What number comes next?',
        speak: 'The parcels on the belt have numbers. ' + seq.join(', ') + '. What number comes next?',
        visual: '<div class="belt parcels">' + boxes + '</div>',
        options: numberOptions(next, level),
        answer: String(next),
        hint: hintFor('pattern', data),
        reward: '🎁'
      };
    },

    matchWord: function (level, data) {
      var easy = P.toys.filter(function (t) { return t.level === 'easy'; });
      var picks = shuffle(easy).slice(0, 3);
      var toy = picks[0];
      return {
        prompt: 'Tap the picture of the <span class="word">' + toy.word + '</span>.',
        speak: 'Tap the picture of the ' + toy.word + '.',
        visual: '<div class="word-card">' + toy.word + '</div>',
        options: shuffle(picks.map(function (t) { return t.emoji; })),
        emojiOptions: true,
        answer: toy.emoji,
        hint: hintFor('matchWord', data),
        reward: toy.emoji
      };
    },

    missingLetter: function (level, data) {
      var list = P.toys.filter(function (t) { return t.level === 'easy' || t.level === 'medium'; });
      var toy = pick(list);
      var gap = randInt(0, toy.word.length - 1);
      var letter = toy.word[gap];
      var shown = toy.word.split('').map(function (ch, i) {
        return i === gap ? '<span class="gap">_</span>' : ch;
      }).join('');
      var letters = [letter];
      var abc = 'abcdefghijklmnoprstuwy';
      while (letters.length < 3) {
        var l = pick(abc.split(''));
        if (letters.indexOf(l) === -1) letters.push(l);
      }
      return {
        prompt: 'Which letter is missing from this toy?',
        speak: 'Which letter is missing from the word ' + toy.word + '?',
        visual: '<div class="word-pic">' + toy.emoji + '</div><div class="word-card">' + shown + '</div>',
        options: shuffle(letters),
        answer: letter,
        hint: hintFor('missingLetter', data),
        reward: toy.emoji
      };
    },

    unscramble: function (level, data) {
      var list = P.toys.filter(function (t) { return t.level === 'medium' || t.level === 'hard'; });
      var toy = pick(list);
      var tiles = shuffle(toy.word.split(''));
      for (var go = 0; go < 10 && tiles.join('') === toy.word; go++) tiles = shuffle(toy.word.split(''));
      return {
        mode: 'build',
        prompt: 'The letters fell off the label! Tap them in the right order.',
        visual: '<div class="word-pic">' + toy.emoji + '</div>',
        word: toy.word,
        tiles: tiles,
        hint: hintFor('unscramble', data),
        reward: toy.emoji
      };
    },

    extra: function (level, data) {
      var list = (data.extra || []).filter(function (q) { return q.level === level; });
      var fresh = list.filter(function (q) { return room.usedExtras.indexOf(q) === -1; });
      if (!list.length) return makers.count(level, data);
      var q = pick(fresh.length ? fresh : list);
      room.usedExtras.push(q);
      return {
        prompt: fill(q.text),
        visual: '<div class="word-pic">' + (q.emoji || '🎁') + '</div>',
        options: shuffle(q.options),
        answer: String(q.answer),
        hint: q.hint || hintFor('extra', data),
        reward: q.emoji || '🎁'
      };
    }
  };

  /* =======================================================
     8. ANSWERS AND FEEDBACK
     ======================================================= */

  function checkChoice(btn) {
    if (room.solved || btn.disabled) return;
    if (btn.getAttribute('data-value') === room.puzzle.answer) {
      btn.classList.add('right');
      solved();
    } else {
      btn.classList.add('tried');
      btn.disabled = true;
      nearly();
    }
  }

  function checkTile(tile) {
    if (room.solved || tile.disabled) return;
    var slots = app.querySelectorAll('.slot');
    var filled = app.querySelectorAll('.slot.filled').length;
    var wanted = room.puzzle.word[filled];
    if (tile.getAttribute('data-letter') === wanted) {
      play('tap');
      slots[filled].textContent = wanted;
      slots[filled].classList.add('filled');
      tile.disabled = true;
      tile.classList.add('used');
      if (filled + 1 === room.puzzle.word.length) solved();
    } else {
      tile.classList.remove('shake');
      void tile.offsetWidth;
      tile.classList.add('shake');
      nearly();
    }
  }

  function setHelper(mood) {
    var h = document.getElementById('helper');
    if (!h) return;
    h.innerHTML = ART.elf(room.puzzle.elf || 'elf1', mood);
    h.classList.remove('hop');
    void h.offsetWidth;
    if (mood === 'cheer') h.classList.add('hop');
  }

  function nearly() {
    room.tries++;
    room.wrongRun++;
    room.rightRun = 0;
    play('nearly');
    var msg = pick(W.nearly);
    var extra = '';
    if (room.tries >= 3 && room.puzzle.mode !== 'build') {
      var right = app.querySelector('.answer[data-value="' + room.puzzle.answer + '"]');
      if (right) right.classList.add('glow');
      extra = '<p>' + W.showMe + '</p>';
    }
    if (room.tries >= 3 && room.puzzle.mode === 'build') {
      var filled = app.querySelectorAll('.slot.filled').length;
      var wanted = room.puzzle.word[filled];
      var t = app.querySelector('.tile:not(.used)[data-letter="' + wanted + '"]');
      if (t) t.classList.add('glow');
      extra = '<p>' + W.showMe + '</p>';
    }
    var fb = document.getElementById('feedback');
    fb.className = 'feedback soft';
    fb.innerHTML = '<p class="fb-title">' + msg + '</p>' +
      '<p>💡 <b>' + W.hintPrefix + '</b> ' + room.puzzle.hint + '</p>' + extra;
    showFeedback(fb);
    speak(msg + ' ' + room.puzzle.hint);
  }

  // On small screens, scroll so the message and buttons are in view
  function showFeedback(fb) {
    try { fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (e) { /* ignore */ }
  }

  function solved() {
    room.solved = true;
    if (room.tries === 0) { room.rightRun++; room.wrongRun = 0; }
    room.stars++;
    room.toys.push(room.puzzle.reward);
    state.sleigh.push(room.puzzle.reward);
    save();
    play('right');
    setHelper('cheer');

    var msg = pick(W.praise);
    var fb = document.getElementById('feedback');
    fb.className = 'feedback happy';
    fb.innerHTML = '' +
      '<p class="fb-title">' + msg + '</p>' +
      '<p class="reward"><span class="fly">' + room.puzzle.reward + '</span> went into the sleigh!</p>' +
      '<button class="btn btn-go" id="next">' + W.next + ' ➜</button>';
    var head = app.querySelector('.stars');
    if (head) head.outerHTML = starsRow();
    var got = app.querySelectorAll('.star.got');
    if (got.length) got[got.length - 1].classList.add('pop');
    sparkle();
    speak(msg);
    on('#next', function () {
      stopSpeaking();
      room.index++;
      if (!maybeOfferLevel()) nextPuzzle();
    });
    showFeedback(fb);
  }

  function sparkle() {
    var box = document.querySelector('.puzzle');
    if (!box) return;
    for (var i = 0; i < 14; i++) {
      var s = document.createElement('span');
      s.className = 'sparkle';
      s.textContent = pick(['⭐', '✨', '❄️']);
      s.style.left = randInt(10, 90) + '%';
      s.style.top = randInt(20, 70) + '%';
      s.style.animationDelay = (Math.random() * 0.3).toFixed(2) + 's';
      box.appendChild(s);
    }
  }

  // After a run of right or wrong answers, an elf gently offers a change
  function maybeOfferLevel() {
    if (room.index >= room.rounds.length) return false;
    var i = levelIndex(state.level);
    var up = room.rightRun >= S.rightInARowToOfferHarder && i < S.levels.length - 1;
    var down = room.wrongRun >= S.wrongInARowToOfferEasier && i > 0;
    if (!up && !down) return false;

    room.rightRun = 0;
    room.wrongRun = 0;
    var newLevel = S.levels[up ? i + 1 : i - 1].id;
    var text = fill(up ? W.offerHarder : W.offerEasier);
    var fb = document.getElementById('feedback');
    fb.className = 'feedback offer';
    fb.innerHTML = '<p class="fb-title">' + text + '</p>' +
      '<div class="offer-row">' +
        '<button class="btn btn-go" id="offer-yes">' + W.yesPlease + '</button>' +
        '<button class="btn btn-soft" id="offer-no">' + W.stayHere + '</button>' +
      '</div>';
    showFeedback(fb);
    speak(text);
    on('#offer-yes', function () {
      state.level = newLevel;
      save();
      var left = room.rounds.length - room.index;
      var fresh = shuffleRounds(room.data.rounds[newLevel]);
      room.rounds = room.rounds.slice(0, room.index).concat(fresh.slice(0, left));
      play('right');
      nextPuzzle();
    });
    on('#offer-no', function () { play('tap'); nextPuzzle(); });
    return true;
  }

  /* =======================================================
     9. ROOM FINISHED AND THE BIG CELEBRATION
     ======================================================= */

  function showSceneDone() {
    var sc = sceneById(room.id);
    state.done[room.id] = true;
    save();
    play('sceneDone');
    var finished = allReadyDone();
    app.className = 'screen screen-done';
    var title = fill(W.sceneDoneTitle, { scene: sc.name });
    var text = fill(W.sceneDoneText, { count: room.toys.length });
    app.innerHTML = '' +
      topBar(true) +
      lights() +
      '<div class="card center done-card">' +
        '<div class="elf-pair">' + ART.elf('elf1', 'cheer') + ART.elf('elf2', 'cheer') + '</div>' +
        '<h2>' + title + '</h2>' +
        '<div class="stars big-stars">' + room.toys.map(function () { return '⭐'; }).join('') + '</div>' +
        '<p class="big">' + text + '</p>' +
        '<div class="sleigh-toys big-toys">' + room.toys.join('') + '</div>' +
        (finished
          ? '<button class="btn btn-go" id="finale">🛷 ' + W.allDoneButton + '</button>'
          : '<button class="btn btn-go" id="map">' + W.backToMap + '</button>') +
      '</div>';
    wireTopBar();
    on('#map', function () { play('tap'); showMap(); });
    on('#finale', function () { showCelebration(); });
    speak(title + ' ' + text);
  }

  function showCelebration() {
    state.celebrated = true;
    save();
    play('takeOff');
    app.className = 'screen screen-celebrate';
    var title = W.celebrateTitle;
    var text = fill(W.celebrateText);
    var deer = S.characters.reindeer.emoji;
    app.innerHTML = '' +
      '<div class="sky-scene" aria-hidden="true">' +
        '<span class="moon"></span>' +
        '<div class="flyer"><span class="deer">' + deer + deer + '</span>' + ART.sleigh() +
          '<span class="santa-rider">' + S.characters.santa.emoji + '</span></div>' +
      '</div>' +
      '<div class="card center celebrate-card">' +
        '<h1>' + title + '</h1>' +
        '<p class="big">' + text + '</p>' +
        '<p class="big">' + state.sleigh.length + ' toys are on their way! 🎁</p>' +
        '<div class="elf-pair">' + ART.elf('elf1', 'cheer') + ART.elf('elf2', 'cheer') + '</div>' +
        '<button class="btn btn-go" id="again">' + W.playAgain + '</button>' +
      '</div>';
    speak(title + ' ' + text);
    on('#again', function () {
      state.done = {};
      state.sleigh = [];
      state.celebrated = false;
      save();
      play('tap');
      showMap();
    });
  }

  /* =======================================================
     10. GROWN-UP SETTINGS
     Press and hold the button, so little fingers don't open
     it by accident.
     ======================================================= */

  function wireHold(btn, action) {
    if (!btn) return;
    var timer = null;
    function start(e) {
      e.preventDefault();
      btn.classList.add('holding');
      timer = setTimeout(function () { btn.classList.remove('holding'); action(); }, 1200);
    }
    function stop() { clearTimeout(timer); btn.classList.remove('holding'); }
    btn.addEventListener('pointerdown', start);
    btn.addEventListener('pointerup', stop);
    btn.addEventListener('pointerleave', stop);
    btn.addEventListener('pointercancel', stop);
    btn.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    btn.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') action(); });
  }

  function openGrownUps() {
    stopSpeaking();
    var levels = S.levels.map(function (lv) {
      return '<button class="btn level-btn small' + (lv.id === state.level ? ' chosen' : '') + '" data-level="' + lv.id + '">' +
        lv.icon + ' ' + lv.name + '<span class="level-label">' + lv.label + '</span></button>';
    }).join('');
    var panel = document.createElement('div');
    panel.className = 'modal';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.innerHTML = '' +
      '<div class="card modal-card">' +
        '<h2>' + W.grownUpsTitle + '</h2>' +
        '<h3>Level</h3><div class="level-row">' + levels + '</div>' +
        '<h3>Sound</h3>' +
        '<label class="switch"><input type="checkbox" id="opt-sound"' + (state.sound ? ' checked' : '') + '> Jingle sounds</label>' +
        '<label class="switch"><input type="checkbox" id="opt-read"' + (state.autoRead ? ' checked' : '') + '> Read every puzzle aloud automatically (good for younger readers)</label>' +
        '<p class="small-note">There is always a "Read to me" button on each puzzle.</p>' +
        '<p class="privacy">🔒 ' + W.privacyNote + '</p>' +
        '<div class="offer-row">' +
          '<button class="btn btn-soft" id="opt-reset">' + W.resetProgress + '</button>' +
          '<button class="btn btn-go" id="opt-close">' + W.close + '</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(panel);

    function close() { panel.remove(); refresh(); }
    panel.querySelectorAll('.level-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        state.level = b.getAttribute('data-level');
        save();
        panel.querySelectorAll('.level-btn').forEach(function (x) { x.classList.toggle('chosen', x === b); });
      });
    });
    panel.querySelector('#opt-sound').addEventListener('change', function (e) { state.sound = e.target.checked; save(); });
    panel.querySelector('#opt-read').addEventListener('change', function (e) { state.autoRead = e.target.checked; save(); });
    panel.querySelector('#opt-reset').addEventListener('click', function () {
      if (window.confirm(W.resetCheck)) {
        state.done = {}; state.sleigh = []; state.celebrated = false; state.level = null;
        save();
        panel.remove();
        room = null;
        showStart();
      }
    });
    panel.querySelector('#opt-close').addEventListener('click', close);
    panel.addEventListener('click', function (e) { if (e.target === panel) close(); });
  }

  // After grown-up changes, redraw what's on screen
  function refresh() {
    if (room && app.classList.contains('screen-scene')) {
      // a level change applies to the puzzles still to come in this room
      var left = room.rounds.length - room.index;
      var fresh = shuffleRounds(room.data.rounds[state.level]);
      room.rounds = room.rounds.slice(0, room.index).concat(fresh.slice(0, left));
      if (!room.solved) nextPuzzle(); else showPuzzleAgainTopOnly();
    } else if (app.classList.contains('screen-map')) {
      showMap();
    }
  }

  function showPuzzleAgainTopOnly() {
    var b = document.getElementById('sound-btn');
    if (b) b.innerHTML = state.sound ? '🔔 <span>Sound on</span>' : '🔕 <span>Sound off</span>';
  }

  /* =======================================================
     11. START THE GAME
     ======================================================= */

  load();
  applyColours();
  makeSnow();
  showStart();

})();
