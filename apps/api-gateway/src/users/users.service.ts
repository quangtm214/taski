import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateUserDto, PaginationDto, UpdateUserDto, USER_SERVICE_NAME, UserServiceClient } from '@app/common';
import { USER_SERVICE } from './constant';
import { ClientGrpc } from '@nestjs/microservices';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class UsersService implements OnModuleInit {
  private usersService: UserServiceClient;

  constructor(@Inject(USER_SERVICE) private client: ClientGrpc) { }

  onModuleInit() {
    this.usersService = this.client.getService<UserServiceClient>(
      USER_SERVICE_NAME
    );
  }

  create(createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  findAll() {
    return this.usersService.findAllUsers({});
  }

  findOne(id: string) {
    return this.usersService.findOneUser({ id });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    updateUserDto.id = id;
    return this.usersService.updateUser(updateUserDto);
  }

  remove(id: string) {
    return this.usersService.removeUser({ id });
  }

  emailUser() {
    const user$ = new ReplaySubject<PaginationDto>();

    user$.next({ page: 0, skip: 10 });
    user$.next({ page: 1, skip: 10 });
    user$.next({ page: 2, skip: 10 });
    user$.next({ page: 3, skip: 10 });

    user$.complete();

    let chunkNumber = 1;

    return this.usersService.queryUsers(user$).subscribe((users) => {
      console.log('chunk', chunkNumber, users);
      chunkNumber++;
    })
  }
}
