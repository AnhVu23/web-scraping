import * as bodyParser from 'body-parser' // pull information from HTML POST (express4)
import * as cors from 'cors' // Allow cors
import * as express from 'express' // framework
import * as helmet from 'helmet' // Security
import * as methodOverride from 'method-override' // simulate DELETE and PUT (express4)
import * as morgan from 'morgan' // log requests to the console (express4)
import { Server } from 'net'
import 'reflect-metadata' // required for class decorators to work
import { useExpressServer } from 'routing-controllers'

// Controllers
import { ScrapeController } from './controllers/Scrape'
// Middlewares
import swagger from './config/swagger'
import { GlobalErrorHandler } from './middlewares/ErrorHandler'

export default class App {
  private app: express.Application
  private server: Server

  public async getApp(): Promise<any> {
    await this.init()
    return this.app
  }

  public async run(): Promise<any> {
    await this.init()
    /**
     * START the server
     */
    this.server = this.app.listen(process.env.PORT, function () {
      console.log(
        'The server is running in port: ',
        process.env.PORT,
        ' In ',
        process.env.NODE_ENV,
        ' mode'
      )
    })
  }

  public async init(
    NODE_ENV: string = 'development',
    PORT: number = 3000
  ): Promise<express.Application> {
    /**
     * Setting environment for development|production
     */
    process.env.NODE_ENV = process.env.NODE_ENV || NODE_ENV

    /**
     * Setting port number
     */
    process.env.PORT = process.env.PORT || String(PORT)

    /**
     * Create our app w/ express
     */
    this.app = express()

    /**
     * HELMET
     */
    this.app.use(helmet())

    /**
     * CORS
     */
    this.app.use(cors())

    /**
     * LOGGING
     */
    this.app.use(morgan('combined'))
    /**
     * Documentation
     */
    this.app.use('/api-docs', swagger.serve, swagger.setup)

    /**
     * Body parsers and methods
     */
    this.app.use(
      bodyParser.urlencoded({
        extended: true,
        limit: '50MB',
      })
    ) // parse application/x-www-form-urlencoded
    this.app.use(bodyParser.json({ limit: '50MB' })) // parse application/json
    this.app.use(methodOverride())
    /**
     * Setting routes
     */

    useExpressServer(this.app, {
      classTransformer: true,
      development: false,
      middlewares: [GlobalErrorHandler],
      controllers: [ScrapeController],
      defaultErrorHandler: false,
    })

    return this.app
  }
}
