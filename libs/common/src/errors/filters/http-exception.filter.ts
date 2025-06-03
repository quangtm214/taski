import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    InternalServerErrorException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status = exception instanceof HttpException
            ? exception.getStatus()
            : 500;

        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: exception?.response?.message || exception.message || 'Internal Server Error',
            errorCode: exception?.response?.errorCode || 'UNKNOWN',
        };

        response.status(status).json(errorResponse);
    }
}
