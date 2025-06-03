import { mapGrpcErrorToHttp } from "@app/common/errors/utils/error.util";
import { Injectable, LoggerService } from "@nestjs/common";
import { lastValueFrom, Observable } from "rxjs";

@Injectable()
export class GrpcClientWrapper {

    async handle<T>(fn: () => Promise<T> | Observable<T>): Promise<T> {
        try {
            const result = fn();
            if (result instanceof Promise) return await result;
            return await lastValueFrom(result);
        } catch (error) {
            throw mapGrpcErrorToHttp(error);
        }
    }
}
