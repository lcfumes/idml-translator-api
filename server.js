const app = require('./app'); // Sem src
const logger = require('./config/logger');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
});
