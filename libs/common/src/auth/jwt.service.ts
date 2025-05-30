import { jwtPayload } from './auth.interface';
import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
    constructor(private readonly jwtService: NestJwtService) { }

    sign(payload: jwtPayload) {
        return this.jwtService.sign(payload);
    }

    verify(token: string) {
        return this.jwtService.verify(token);
    }

    decode(token: string) {
        return this.jwtService.decode(token);
    }

    generatePairedTokens(payload: jwtPayload) {
        const accessToken = this.jwtService.sign(
            { ...payload, type: 'access' },
            { expiresIn: '15m' }
        );

        const refreshToken = this.jwtService.sign(
            { ...payload, type: 'refresh' },
            { expiresIn: '7d' }
        );

        return { accessToken, refreshToken };
    }
}
