import { AppExceptionPayload } from "@app/common/errors/exceptions/base.exception";
import { Metadata, status } from "@grpc/grpc-js";
import { RpcException } from "@nestjs/microservices";

export class GrpcAppException extends RpcException {
    constructor(payload: AppExceptionPayload) {
        const metadata = new Metadata();
        if (payload.errorCode) {
            metadata.set('errorCode', payload.errorCode);
        }
        if (payload.details) {
            metadata.set('details', payload.details);
        }
        super({
            code: payload.code,
            message: payload.message,
            metadata,
        });
    }

    static notFound(message: string, errorCode?: string): GrpcAppException {
        return new GrpcAppException({
            code: status.NOT_FOUND,
            message,
            errorCode,
        });
    }

    static alreadyExists(message: string, errorCode?: string): GrpcAppException {
        const error = new GrpcAppException({
            code: status.ALREADY_EXISTS,
            message,
            errorCode,
        });
        return error;
    }

    static invalidCredentials(message: string, errorCode?: string): GrpcAppException {
        return new GrpcAppException({
            code: status.UNAUTHENTICATED,
            message,
            errorCode,
        });
    }
}