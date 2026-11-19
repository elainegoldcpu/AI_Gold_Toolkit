/* =========================================================
   SANTA'S WORKSHOP: DRAWINGS
   ---------------------------------------------------------
   The elves, sacks and sleigh are drawn with simple shapes.
   Colours come from settings.js.

   If Elodie draws her own characters, save each picture in
   an "images" folder and swap a drawing for:
       return '<img src="images/pip.png" alt="Pip">';
   ========================================================= */

window.ART = {

  elf: function (who, mood) {
    var c = SETTINGS.characters[who] || SETTINGS.characters.elf1;
    var mouth = mood === 'cheer'
      ? '<path d="M42 66 Q50 76 58 66 Z" fill="#7a2b2b"/>'
      : '<path d="M43 66 Q50 72 57 66" stroke="#7a2b2b" stroke-width="2.5" fill="none" stroke-linecap="round"/>';
    var arms = mood === 'cheer'
      ? '<path d="M30 86 L16 64" stroke="' + c.tunic + '" stroke-width="8" stroke-linecap="round"/>' +
        '<path d="M70 86 L84 64" stroke="' + c.tunic + '" stroke-width="8" stroke-linecap="round"/>' +
        '<circle cx="15" cy="62" r="5" fill="' + c.skin + '"/><circle cx="85" cy="62" r="5" fill="' + c.skin + '"/>'
      : '<path d="M30 86 L22 104" stroke="' + c.tunic + '" stroke-width="8" stroke-linecap="round"/>' +
        '<path d="M70 86 L78 104" stroke="' + c.tunic + '" stroke-width="8" stroke-linecap="round"/>' +
        '<circle cx="22" cy="106" r="5" fill="' + c.skin + '"/><circle cx="78" cy="106" r="5" fill="' + c.skin + '"/>';
    return '' +
      '<svg class="elf-svg" viewBox="0 0 100 130" role="img" aria-label="' + c.name + ' the elf">' +
        arms +
        // body and belt
        '<path d="M30 80 Q50 74 70 80 L74 118 Q50 124 26 118 Z" fill="' + c.tunic + '"/>' +
        '<rect x="27" y="100" width="46" height="6" fill="#3a2a1a"/>' +
        '<rect x="45" y="99" width="10" height="8" fill="' + SETTINGS.colours.gold + '"/>' +
        // ears
        '<path d="M24 52 L12 44 L26 62 Z" fill="' + c.skin + '"/>' +
        '<path d="M76 52 L88 44 L74 62 Z" fill="' + c.skin + '"/>' +
        // head
        '<circle cx="50" cy="56" r="25" fill="' + c.skin + '"/>' +
        // cheeks, eyes, mouth
        '<circle cx="37" cy="62" r="4" fill="#ff9f9f" opacity=".6"/>' +
        '<circle cx="63" cy="62" r="4" fill="#ff9f9f" opacity=".6"/>' +
        '<circle cx="42" cy="54" r="3" fill="#2a2a3c"/><circle cx="58" cy="54" r="3" fill="#2a2a3c"/>' +
        mouth +
        // hat with fluffy trim and bobble
        '<path d="M24 42 Q46 -6 84 8 Q62 14 76 42 Z" fill="' + c.hat + '"/>' +
        '<rect x="22" y="36" width="56" height="10" rx="5" fill="#ffffff"/>' +
        '<circle cx="86" cy="9" r="7" fill="#ffffff"/>' +
      '</svg>';
  },

  sack: function (label) {
    return '' +
      '<svg class="sack-svg" viewBox="0 0 100 100" role="img" aria-label="a sack">' +
        '<path d="M22 34 Q12 90 30 94 L70 94 Q88 90 78 34 Z" fill="#b5835a"/>' +
        '<path d="M30 34 Q50 22 70 34" stroke="#7a5233" stroke-width="5" fill="none"/>' +
        '<path d="M34 26 L42 14 L50 24 L58 14 L66 26" fill="#c99467"/>' +
        '<rect x="30" y="32" width="40" height="6" rx="3" fill="' + SETTINGS.colours.red + '"/>' +
        (label !== undefined ? '<text x="50" y="74" text-anchor="middle" font-size="28" font-weight="bold" fill="#fff8e8">' + label + '</text>' : '') +
      '</svg>';
  },

  sleigh: function () {
    return '' +
      '<svg class="sleigh-svg" viewBox="0 0 160 80" role="img" aria-label="Santa\'s sleigh">' +
        '<path d="M20 20 L120 20 Q140 20 140 40 L140 50 L30 50 Q20 50 20 40 Z" fill="' + SETTINGS.colours.red + '"/>' +
        '<path d="M20 20 L120 20" stroke="' + SETTINGS.colours.gold + '" stroke-width="5"/>' +
        '<path d="M10 66 L146 66 Q158 66 154 54" stroke="' + SETTINGS.colours.gold + '" stroke-width="6" fill="none" stroke-linecap="round"/>' +
        '<path d="M40 50 L36 66 M118 50 L122 66" stroke="' + SETTINGS.colours.gold + '" stroke-width="5"/>' +
      '</svg>';
  }
};
