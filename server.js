const express = require('express');
const next = require('next');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Dynamic Swagger spec from JSDoc comments
const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PudheKai API',
      version: '1.0.0',
      description: 'API documentation for PudheKai Next.js backend',
    },
  },
  apis: ['./src/app/api/**/*.ts'], // Path to your API route files
});

app.prepare().then(() => {
  const server = express();

  // Serve Swagger UI
  server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Handle all Next.js routes
  server.all('*', (req, res) => handle(req, res));

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
    console.log('> Swagger docs at http://localhost:3000/api-docs');
  });
});