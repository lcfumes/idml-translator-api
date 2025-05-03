const fs = require('fs');
const path = require('path');

async function renameFile(oldPath, newPath) {
  await fs.promises.rename(oldPath, newPath);
}

async function writeFile(filePath, content) {
  await fs.promises.writeFile(filePath, content);
}

module.exports = {
  renameFile,
  writeFile
};
