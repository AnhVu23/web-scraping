/**
 * Swagger config
 *
 * @author Anh Vu <anh.vu@vertics.co>
 *
 * @copyright Vertics Oy 2020
 */

import * as swaggerJSDoc from 'swagger-jsdoc'
import * as swaggerUi from 'swagger-ui-express'

/**
 * Config swagger jsdoc
 *
 */
const swaggerDefinition: swaggerJSDoc.SwaggerDefinition = {
  openapi: '3.0.1',
  info: {
    title: 'Web scraping',
    version: '1.0.0',
    description: 'Web scraping documentation',
  },
  tags: [
    {
      name: 'Scrape',
      description: 'Scrape related endpoints',
    },
  ]
}

const options = {
  swaggerDefinition,
  apis: ['./src/controllers/**/*.ts', './src/docs/*.yaml'],
}

const swaggerSpec = swaggerJSDoc(options)

export default {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(swaggerSpec),
}
