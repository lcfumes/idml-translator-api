const fs = require('fs');
const unzipper = require('unzipper');
const { openIDML } = require('../../infrastructure/IDMLUnzipper');

jest.mock('unzipper', () => ({
  Open: {
    file: jest.fn()
  }
}));

describe('openIDML', () => {
  it('deve abrir e retornar conteúdo de um arquivo IDML', async () => {
    const fakeDirectory = { files: ['file1.xml', 'file2.xml'] };
    unzipper.Open.file.mockResolvedValue(fakeDirectory);

    const result = await openIDML('/caminho/arquivo.idml');

    expect(unzipper.Open.file).toHaveBeenCalledWith('/caminho/arquivo.idml');
    expect(result).toBe(fakeDirectory);
  });
});
