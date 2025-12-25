import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse<Response>();

    console.log(`[DomainExceptionFilter] Exception caught for ${request.method} ${request.path}`);
    console.log(`[DomainExceptionFilter] Exception type: ${exception?.constructor?.name || 'unknown'}`);

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const responseObj = exception.getResponse();
      const message = typeof responseObj === 'string' 
        ? responseObj 
        : (responseObj as any)?.message || exception.message;
      console.log(`[DomainExceptionFilter] HttpException: ${status} - ${message}`);
      response.status(status).json({
        statusCode: status,
        message,
      });
      return;
    }

    // Handle domain exceptions
    const message = exception instanceof Error ? exception.message : 'Internal server error';
    const status = this.mapDomainExceptionToHttpStatus(message);

    response.status(status).json({
      statusCode: status,
      message,
    });
  }

  private mapDomainExceptionToHttpStatus(message: string): HttpStatus {
    if (message.includes('not found')) {
      return HttpStatus.NOT_FOUND;
    }
    if (message.includes('mismatch') || message.includes('Invalid')) {
      return HttpStatus.BAD_REQUEST;
    }
    if (message.includes('already') || message.includes('overlap')) {
      return HttpStatus.CONFLICT;
    }
    if (message.includes('credentials') || message.includes('Unauthorized')) {
      return HttpStatus.UNAUTHORIZED;
    }
    if (message.includes('required')) {
      return HttpStatus.BAD_REQUEST;
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}

