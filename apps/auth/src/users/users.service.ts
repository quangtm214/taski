import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { User, CreateUserDto, UpdateUserDto, UserList, PaginationDto } from '@app/common';
import { randomUUID } from 'crypto';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly users: User[] = [];

  onModuleInit() {
    for (let i = 0; i < 10; i++) {
      this.create({
        username: randomUUID(),
        password: randomUUID(),
        age: 0,
        socialMedia: {
          email: i + '@example.com',
          phone: `+1234567890${i}`,
        }
      })
    }
  }

  create(createUserDto: CreateUserDto): User {
    const user: User = {
      ...createUserDto,
      id: randomUUID(),
      isActive: true,
      socialMedia: {
        email: createUserDto.socialMedia?.email || '',
        phone: createUserDto.socialMedia?.phone || '',
        fbUri: createUserDto.socialMedia?.fbUri || '',
        twitterUri: createUserDto.socialMedia?.twitterUri || '',
      }
    }
    this.users.push(user);
    return user;
  }

  findAll(): UserList {
    return {
      users: this.users,
    }
  }

  findOne(id: string): User {
    const user = this.users.find(user => user.id === id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto): User {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const updatedUser = {
      ...this.users[userIndex],
      ...updateUserDto,
      id: id,
    };
    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  remove(id: string): User {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.users.splice(userIndex, 1)[0];
  }

  queryUsers(paginationDtoStream: Observable<PaginationDto>): Observable<UserList> {
    const subject = new Subject<UserList>();

    const onNext = (paginationDto: PaginationDto) => {
      const start = paginationDto.page * paginationDto.skip;
      subject.next({
        users: this.users.slice(start, start + paginationDto.skip)
      });
    }

    const onComplete = () => {
      subject.complete();
    }
    paginationDtoStream.subscribe({
      next: onNext,
      complete: onComplete,
    })
    return subject.asObservable();
  }
}
