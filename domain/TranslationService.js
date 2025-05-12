const AzureTranslator = require('../infrastructure/AzureTranslator');

class TranslationService {
  constructor(translator = new AzureTranslator()) {
    this.translator = translator;
  }

  async translateText(text, toLang, fromLang = 'en') {
    if (!text || !toLang) throw new Error('Missing required parameters');
    return await this.translator.translate(text, fromLang, toLang);
  }
}

async function translateContent(parsed, targetLang, logger, translator = new AzureTranslator()) {
  const story = parsed?.Story?.ParagraphStyleRange;
  if (!story || !Array.isArray(story)) return;

  for (const item of story) {
    const content = item?.Content?.[0];
    if (content) {
      const translated = await translator.translate(content, 'en', targetLang);
      item.Content[0] = translated;
      logger?.info?.(`Traduzido: "${content}" → "${translated}"`);
    }
  }
}

module.exports = {
  translateContent,
  TranslationService,
};
