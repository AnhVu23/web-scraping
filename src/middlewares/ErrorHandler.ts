/**
 * Created by Hai Anh on 6/8/20
 */

import {
  ExpressErrorMiddlewareInterface,
  Middleware,
} from 'routing-controllers'
import { HTTP_STATUS, HttpError } from '../models/Error'

@Middleware({ type: 'after' })
export class GlobalErrorHandler implements ExpressErrorMiddlewareInterface {
  public error(
    error: any,
    request: any,
    response: any,
    next: (err: any) => any
  ) {
    if (error) {
      console.log(error)
      const developmentMode = process.env.NODE_ENV === 'development'
      if (error instanceof HttpError) {
        return response.status(error.status).json({
          message: error.message,
          code: error.code,
          stack: developmentMode ? error.stack : null,
        })
      } else {
        const httpError = new HttpError(
          error.message,
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        )
        return response.status(httpError.status).json({
          message: httpError.message,
          stack: developmentMode ? httpError.stack : null,
        })
      }
    }
  }
}
