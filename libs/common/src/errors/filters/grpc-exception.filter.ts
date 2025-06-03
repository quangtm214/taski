import {
    Catch,
    ArgumentsHost,
    RpcExceptionFilter,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';

@Catch(RpcException)
export class GrpcExceptionFilter implements RpcExceptionFilter<RpcException> {
    catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
        const error = exception.getError() as any;
        console.log('Handling gRPC exception:', error);
        return throwError(() => ({
            code: error.code || 13, // INTERNAL
            message: error.message || 'Internal error',
            Metadata: error.metadata || new Metadata(),
        }));
    }
}
