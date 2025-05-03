const { translateText } = require('../infrastructure/AzureTranslator');

async function translateContent(obj, targetLang, logger) {
  for (const key in obj) {
    if (key === 'Content') {
      logger.debug(`Traduzindo conteúdo original: ${obj[key]}`);
      obj[key][0] = await translateText(obj[key][0], targetLang);
    } else if (typeof obj[key] === 'object') {
      await translateContent(obj[key], targetLang, logger);
    }
  }
}

module.exports = { translateContent };
