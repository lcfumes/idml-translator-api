const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'InDesign Project Translator API',
    version: '1.0.0',
    description: 'Automatically translates IDML files using Azure Translator.',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // define onde estão os comentários de rotas
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;

