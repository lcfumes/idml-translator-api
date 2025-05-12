const fs = require('fs');
const { renameFile, writeFile } = require('../../interfaces/FileStorage');

jest.mock('fs');

describe('FileStorage', () => {
  beforeEach(() => {
    fs.promises = {
      rename: jest.fn(),
      writeFile: jest.fn(),
    };
  });

  it('deve renomear um arquivo corretamente', async () => {
    await renameFile('/caminho/antigo.txt', '/caminho/novo.txt');

    expect(fs.promises.rename).toHaveBeenCalledWith('/caminho/antigo.txt', '/caminho/novo.txt');
  });

  it('deve escrever conteúdo em um arquivo corretamente', async () => {
    await writeFile('/caminho/arquivo.txt', 'conteúdo');

    expect(fs.promises.writeFile).toHaveBeenCalledWith('/caminho/arquivo.txt', 'conteúdo');
  });
});
