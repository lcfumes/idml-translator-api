const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const archiver = require('archiver');
const { translateContent } = require('./TranslationService');
const { openIDML } = require('../infrastructure/IDMLUnzipper');

async function createTranslatedIDML(originalPath, targetLang, logger) {
  logger.info('Criando novo IDML traduzido');
  const { name, ext } = path.parse(originalPath);
  const outputPath = path.join(path.dirname(originalPath), `${name}-${targetLang}${ext}`);
  const tempDir = path.join(__dirname, '..', 'temp');

  const directory = await openIDML(originalPath);
  await fs.promises.rm(tempDir, { recursive: true, force: true });
  await fs.promises.mkdir(tempDir);

  for (const file of directory.files) {
    const content = await file.buffer();
    const outPath = path.join(tempDir, file.path);
    await fs.promises.mkdir(path.dirname(outPath), { recursive: true });

    if (file.path.startsWith('Stories/') && file.path.endsWith('.xml')) {
      const parsed = await xml2js.parseStringPromise(content);
      await translateContent(parsed, targetLang, logger);

      const builder = new xml2js.Builder();
      const xml = builder.buildObject(parsed);
      await fs.promises.writeFile(outPath, xml);
      logger.info(`Arquivo ${file.path} atualizado`);
    } else {
      await fs.promises.writeFile(outPath, content);
    }
  }

  const output = fs.createWriteStream(outputPath);
  const archive = archiver('zip');
  archive.pipe(output);
  archive.directory(tempDir, false);
  await archive.finalize();
  await fs.promises.rm(tempDir, { recursive: true, force: true });

  logger.info(`Novo IDML gerado: ${outputPath}`);
  return outputPath;
}

module.exports = { createTranslatedIDML };
