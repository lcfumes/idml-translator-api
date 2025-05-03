const unzipper = require('unzipper');

async function openIDML(filePath) {
  return unzipper.Open.file(filePath);
}

module.exports = { openIDML };
