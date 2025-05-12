const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const xml2js = require('xml2js');
const { createTranslatedIDML } = require('../../domain/IDMLProcessor');
const { openIDML } = require('../../infrastructure/IDMLUnzipper');
const { translateContent } = require('../../domain/TranslationService');

jest.mock('fs', () => ({
  promises: {
    rm: jest.fn(),
    mkdir: jest.fn(),
    writeFile: jest.fn()
  },
  createWriteStream: jest.fn(() => ({ on: jest.fn(), end: jest.fn() }))
}));

jest.mock('archiver', () => jest.fn(() => ({
  pipe: jest.fn(),
  directory: jest.fn(),
  finalize: jest.fn().mockResolvedValue()
})));

jest.mock('xml2js', () => ({
  parseStringPromise: jest.fn(),
  Builder: jest.fn().mockImplementation(() => ({
    buildObject: jest.fn(() => '<translated></translated>')
  }))
}));

jest.mock('../../infrastructure/IDMLUnzipper', () => ({
  openIDML: jest.fn()
}));

jest.mock('../../domain/TranslationService', () => ({
  translateContent: jest.fn()
}));

describe('createTranslatedIDML', () => {
  const mockLogger = {
    info: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    openIDML.mockResolvedValue({
      files: [
        {
          path: 'Stories/Story1.xml',
          buffer: jest.fn().mockResolvedValue('<xml>original</xml>')
        },
        {
          path: 'META-INF/manifest.xml',
          buffer: jest.fn().mockResolvedValue('<xml>manifest</xml>')
        }
      ]
    });

    xml2js.parseStringPromise.mockResolvedValue({ Story: {} });
  });

  it('deve criar um novo IDML traduzido', async () => {
    const output = await createTranslatedIDML('/tmp/exemplo.idml', 'pt', mockLogger);

    expect(openIDML).toHaveBeenCalledWith('/tmp/exemplo.idml');
    expect(translateContent).toHaveBeenCalled();
    expect(fs.promises.writeFile).toHaveBeenCalledWith(
      expect.stringContaining('Story1.xml'),
      '<translated></translated>'
    );
    expect(fs.promises.writeFile).toHaveBeenCalledWith(
      expect.stringContaining('manifest.xml'),
      '<xml>manifest</xml>'
    );
    expect(output).toContain('-pt.idml');
  });
});
