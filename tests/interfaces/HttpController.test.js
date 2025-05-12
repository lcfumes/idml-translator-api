const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const { uploadController } = require('../../interfaces/HttpController');
const { openIDML } = require('../../infrastructure/IDMLUnzipper');
const { createTranslatedIDML } = require('../../domain/IDMLProcessor');
const logger = require('../../config/logger');

jest.mock('fs');
jest.mock('xml2js');
jest.mock('../../infrastructure/IDMLUnzipper');
jest.mock('../../domain/IDMLProcessor');
jest.mock('../../config/logger');

describe('uploadController', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    fs.promises = {
        rename: jest.fn()
      };
      
    openIDML.mockResolvedValue({
      files: [
        {
          path: 'Stories/story1.xml',
          buffer: () => Promise.resolve(Buffer.from('<xml>fake</xml>')),
        }
      ]
    });

    xml2js.parseStringPromise.mockResolvedValue({
      Story: {
        ParagraphStyleRange: [
          { Content: ['Texto de teste'] }
        ]
      }
    });

    createTranslatedIDML.mockResolvedValue('/tmp/documento-pt.idml');
  });

  it('deve processar o upload e responder com status ok', async () => {
    const req = {
      file: {
        path: '/tmp/upload123.idml',
        originalname: 'documento.idml',
      },
      body: {
        language: 'pt'
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await uploadController(req, res);

    expect(fs.promises.rename).toHaveBeenCalled();
    expect(openIDML).toHaveBeenCalled();
    expect(xml2js.parseStringPromise).toHaveBeenCalled();
    expect(createTranslatedIDML).toHaveBeenCalledWith(expect.any(String), 'pt', logger);
    expect(res.json).toHaveBeenCalledWith({ status: 'ok', filename: 'documento-pt.idml' });
  });

  it('deve retornar erro 500 se algo der errado', async () => {
    openIDML.mockRejectedValue(new Error('Falha ao abrir IDML'));

    const req = {
      file: {
        path: '/tmp/upload123.idml',
        originalname: 'documento.idml',
      },
      body: {
        language: 'pt'
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await uploadController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao processar o IDML.' });
  });
});
