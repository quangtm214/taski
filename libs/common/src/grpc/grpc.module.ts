import { GrpcClientWrapper } from './grpc-client-wrapper';
import { Module } from '@nestjs/common';

@Module({
    providers: [GrpcClientWrapper],
    exports: [GrpcClientWrapper],
})
export class GrpcModule { }
