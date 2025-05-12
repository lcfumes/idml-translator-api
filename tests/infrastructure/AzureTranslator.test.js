// Força as variáveis de ambiente antes do require do módulo
process.env.AZURE_TRANSLATOR_KEY = 'fake-key';
process.env.AZURE_TRANSLATOR_REGION = 'brazilsouth';

const axios = require('axios');
const { translateText } = require('../../infrastructure/AzureTranslator');

jest.mock('axios');
jest.mock('../../config/logger', () => ({
  error: jest.fn(),
}));

describe('translateText', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('traduz texto com sucesso', async () => {
    axios.post.mockResolvedValue({
      data: [{ translations: [{ text: 'Olá mundo' }] }]
    });

    const result = await translateText('Hello world', 'pt');

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('to=pt'),
      [{ Text: 'Hello world' }],
      expect.objectContaining({
        headers: expect.objectContaining({
          'Ocp-Apim-Subscription-Key': 'fake-key',
          'Ocp-Apim-Subscription-Region': 'brazilsouth',
          'Content-Type': 'application/json'
        })
      })
    );

    expect(result).toBe('Olá mundo');
  });

  it('retorna o texto original em caso de erro', async () => {
    axios.post.mockRejectedValue(new Error('API Error'));

    const result = await translateText('Hello world', 'pt');

    expect(result).toBe('Hello world');
  });
});
