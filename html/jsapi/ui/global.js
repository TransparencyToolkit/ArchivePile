/* Mailpile - UI - Make fingerprints nicer */
Mailpile.nice_fingerprint = function(fingerprint) {
  // FIXME: I'd really love to make these individual pieces color coded
  // Pertaining to the hex value pairings & even perhaps toggle-able icons
  return fingerprint.split(/(....)/).join(' ');
};
