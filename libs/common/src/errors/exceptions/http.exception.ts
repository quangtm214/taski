import { HttpException, HttpStatus } from '@nestjs/common';

export class HttpAppException extends HttpException {
    constructor(message: string, status: HttpStatus, errorCode?: string) {
        super({ message, errorCode }, status);
    }
}
