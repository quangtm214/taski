import { BadRequestException, Inject, Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { CreateUserDto, PaginationDto, UpdateUserDto, USER_SERVICE_NAME, UserServiceClient } from '@app/common';
import { USER_SERVICE } from './constant';
import { ClientGrpc } from '@nestjs/microservices';
import { ReplaySubject } from 'rxjs';
import { status } from '@grpc/grpc-js';

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

  async findOne(id: string) {
    try {
      return await this.usersService.findOneUser({ id });

    } catch (error) {
      if (error.code === status.ALREADY_EXISTS) {
        throw new BadRequestException(error.details)
      }
      throw new InternalServerErrorException('An unexpected error occurred during registration.')
    }
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
