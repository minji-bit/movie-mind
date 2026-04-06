import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  import { AppException } from './app.exception';
  import { ErrorCode } from './error-code';
  
  @Catch()
  export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
  
      if (exception instanceof AppException) {
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse() as {
          success: boolean;
          message: string;
          errorCode: ErrorCode;
        };
  
        response.status(status).json({
          timestamp: new Date().toISOString(),
          path: request.url,
          ...exceptionResponse,
        });
  
        return;
      }
  
      if (exception instanceof HttpException) {
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();
  
        let message = 'HTTP Exception';
        let errorCode = ErrorCode.INTERNAL_SERVER_ERROR;
  
        if (typeof exceptionResponse === 'string') {
          message = exceptionResponse;
        } else if (
          typeof exceptionResponse === 'object' &&
          exceptionResponse !== null
        ) {
          const responseObj = exceptionResponse as Record<string, unknown>;
  
          if (typeof responseObj.message === 'string') {
            message = responseObj.message;
          } else if (Array.isArray(responseObj.message)) {
            message = responseObj.message.join(', ');
          }
        }
  
        response.status(status).json({
          success: false,
          message,
          errorCode,
          timestamp: new Date().toISOString(),
          path: request.url,
        });
  
        return;
      }
  
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '서버 내부 오류가 발생했습니다.',
        errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }