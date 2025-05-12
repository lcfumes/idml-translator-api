const app = require('./app'); // aqui vem o express já configurado com rotas
const logger = require('./config/logger');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// Adiciona a rota da documentação
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
});
