const path = require('path');
const { createTranslatedIDML } = require('../domain/IDMLProcessor');
const logger = require('../config/logger');
const { openIDML } = require('../infrastructure/IDMLUnzipper');
const fs = require('fs');
const xml2js = require('xml2js');

async function uploadController(req, res) {
  const filePath = req.file.path;
  const originalName = req.file.originalname;
  const targetLang = req.body.language || 'pt';
  const extension = path.extname(originalName);
  const nameWithoutExt = path.basename(originalName, extension);
  const renamedPath = path.join(path.dirname(filePath), `${nameWithoutExt}${extension}`);

  await fs.promises.rename(filePath, renamedPath);

  try {
    const directory = await openIDML(renamedPath);
    let totalCharacters = 0;

    for (const file of directory.files) {
      if (file.path.startsWith('Stories/') && file.path.endsWith('.xml')) {
        const content = await file.buffer();
        const parsed = await xml2js.parseStringPromise(content);

        const countContent = (obj) => {
          let count = 0;
          for (const key in obj) {
            if (key === 'Content') {
              count += obj[key].join('').length;
            } else if (typeof obj[key] === 'object') {
              count += countContent(obj[key]);
            }
          }
          return count;
        };

        totalCharacters += countContent(parsed);
      }
    }

    logger.info(`Total de caracteres: ${totalCharacters}`);

    const newIDMLPath = await createTranslatedIDML(renamedPath, targetLang, logger);
    res.json({ status: 'ok', filename: path.basename(newIDMLPath) });

  } catch (error) {
    logger.error(`Erro no processamento: ${error.message}`);
    res.status(500).json({ error: 'Erro ao processar o IDML.' });
  }
}

module.exports = { uploadController };
