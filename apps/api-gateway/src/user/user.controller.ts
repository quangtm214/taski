import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

interface UserService {
    getUserInfo(data: { userId: string }): Observable<any>;
}

@Controller('user')
export class UserController {
    private userService: UserService;

    constructor(@Inject('USER_SERVICE') private client: ClientGrpc) { }

    onModuleInit() {
        this.userService = this.client.getService<UserService>('UserService');
    }

    @Get('/:id')
    getUser(@Param('id') userId: string) {
        return this.userService.getUserInfo({ userId });
    }
}
