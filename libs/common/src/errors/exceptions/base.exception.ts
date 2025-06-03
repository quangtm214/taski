export interface AppExceptionPayload {
    code: number;
    message: string;
    errorCode?: string;
    details?: string;
}

export class BaseAppException extends Error {
    constructor(public readonly payload: AppExceptionPayload) {
        super(payload.message);
    }
}
