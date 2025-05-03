const axios = require('axios');
const logger = require('../config/logger');
require('dotenv').config(); // carrega o .env

const subscriptionKey = process.env.AZURE_TRANSLATOR_KEY;
const region = process.env.AZURE_TRANSLATOR_REGION;
const endpoint = 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0';

async function translateText(text, targetLang = 'pt') {
  try {
    const response = await axios.post(
      `${endpoint}&from=de&to=${targetLang}`,
      [{ Text: text }],
      {
        headers: {
          'Ocp-Apim-Subscription-Key': subscriptionKey,
          'Ocp-Apim-Subscription-Region': region,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data[0].translations[0].text;
  } catch (error) {
    logger.error('Erro ao traduzir texto');
    if (error.response) {
      logger.error(`Status: ${error.response.status}`);
      logger.error(`Data: ${JSON.stringify(error.response.data)}`);
    } else {
      logger.error(`Mensagem: ${error.message}`);
    }
    return text;
  }
}

module.exports = { translateText };
