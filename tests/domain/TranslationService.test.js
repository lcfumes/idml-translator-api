const { translateContent } = require('../../domain/TranslationService');

describe('translateContent', () => {
  const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
  };

  const mockTranslator = {
    translate: jest.fn(),
  };

  beforeEach(() => {
    mockTranslator.translate.mockReset();
    mockLogger.info.mockReset();
    mockLogger.error.mockReset();
  });

  it('traduz corretamente um objeto XML com conteúdo simples', async () => {
    const parsedXML = {
      Story: {
        ParagraphStyleRange: [
          {
            Content: ['Hello world'],
          },
        ],
      },
    };

    // Mock do tradutor
    mockTranslator.translate.mockResolvedValue('Olá mundo');

    // Seta manual do translator (injeção simulada)
    await translateContent(parsedXML, 'pt', mockLogger, mockTranslator);

    expect(mockTranslator.translate).toHaveBeenCalledWith('Hello world', 'en', 'pt');
    expect(parsedXML.Story.ParagraphStyleRange[0].Content[0]).toBe('Olá mundo');
    expect(mockLogger.info).toHaveBeenCalled();
  });

  it('ignora se não houver conteúdo para traduzir', async () => {
    const parsedXML = {
      Story: {},
    };

    await translateContent(parsedXML, 'pt', mockLogger, mockTranslator);
    expect(mockTranslator.translate).not.toHaveBeenCalled();
  });
});
