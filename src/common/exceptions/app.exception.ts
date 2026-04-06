import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from './error-code';

interface AppExceptionOptions {
  message: string;
  errorCode: ErrorCode;
  statusCode?: number;
}

export class AppException extends HttpException {
  public readonly errorCode: ErrorCode;

  constructor(options: AppExceptionOptions) {
    const statusCode = options.statusCode ?? HttpStatus.BAD_REQUEST;

    super(
      {
        success: false,
        message: options.message,
        errorCode: options.errorCode,
      },
      statusCode,
    );

    this.errorCode = options.errorCode;
  }
}