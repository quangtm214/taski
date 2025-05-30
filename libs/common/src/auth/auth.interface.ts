import { UserRole } from "@app/common/types";

export interface jwtPayload {
    userId: string;
    username: string;
    role: UserRole;
}
