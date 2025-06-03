import {
    HttpStatus,
    InternalServerErrorException,
} from '@nestjs/common';
import { UserErrorCode } from '../error-codes';
import { HttpAppException } from '@app/common/errors/exceptions';

const errorMapping = {
    [UserErrorCode.USER_NOT_FOUND]: () =>
        new HttpAppException('User not found', HttpStatus.NOT_FOUND, UserErrorCode.USER_NOT_FOUND),

    [UserErrorCode.USER_ALREADY_EXISTS]: () =>
        new HttpAppException('User already exists', HttpStatus.BAD_REQUEST, UserErrorCode.USER_ALREADY_EXISTS),

    [UserErrorCode.INVALID_CREDENTIALS]: () =>
        new HttpAppException('Invalid credentials', HttpStatus.UNAUTHORIZED, UserErrorCode.INVALID_CREDENTIALS),
};


export function mapGrpcErrorToHttp(error: any): any {
    const metadata = error?.metadata;
    let errorCode: string | undefined;
    if (metadata?.get) {
        const rawCode = metadata.get('errorcode');
        errorCode = Array.isArray(rawCode) ? rawCode[0] as string : rawCode;
    }
    if (!errorCode) {
        return new InternalServerErrorException(error.message || 'Unknown error');
    }
    const mapped = errorMapping[errorCode];
    if (mapped) {
        return mapped();
    }

    return new InternalServerErrorException(error.message || 'Unknown error');
}
