import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { User, CreateUserDto, UpdateUserDto, UserList, PaginationDto } from '@app/common';
import { Observable, Subject } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocialMediaEntity, UserEntity } from './entities';
import { UserMapper } from './mappers/user.mapper';
import * as bcrypt from 'bcrypt';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
@Injectable()
export class UsersService {
  // private readonly users: User[] = [];

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(SocialMediaEntity)
    private readonly socialMediaRepository: Repository<SocialMediaEntity>,
  ) { }

  // onModuleInit() {
  //   for (let i = 0; i < 40; i++) {
  //     this.create({
  //       username: randomUUID(),
  //       password: randomUUID(),
  //       age: 0,
  //       socialMedia: {
  //         email: i + '@example.com',
  //         phone: `+1234567890${i}`,
  //       }
  //     })
  //   }
  // }

  async checkUserCredentials(userName: string, userPassword: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username: userName },
      relations: ['socialMedia'],
    });
    if (!user) {
      throw new RpcException(
        {
          code: status.NOT_FOUND,
          message: `User with username ${userName} not found`,
        }
      )
    }
    const isPasswordValid = await bcrypt.compare(userPassword, user.password);
    if (!isPasswordValid) {
      throw new RpcException(
        {
          code: status.UNAUTHENTICATED,
          message: `Invalid password`,
        }
      )
    }
    return UserMapper.toGrpc(user);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userEntity = UserMapper.toEntity(createUserDto);
    userEntity.password = await bcrypt.hash(createUserDto.password, 10);
    const saved = await this.userRepository.save(userEntity);
    return UserMapper.toGrpc(saved);
  }

  async findAll(): Promise<UserList> {
    return {
      users: await this.userRepository.find().then(users => users.map(user => UserMapper.toGrpc(user))),
    }
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['socialMedia'],
    }).then(user => user ? UserMapper.toGrpc(user) : null);
    if (!user) {
      throw new RpcException(
        {
          code: status.NOT_FOUND,
          message: `User with id ${id} not found`,
        }
      )
    }
    return user;
  }

  async findByQuery(query: object): Promise<UserList> {
    const users = await this.userRepository.find({
      where: query,
      relations: ['socialMedia'],
    });
    return {
      users: users.map(user => UserMapper.toGrpc(user)),
    };
  }

  async findOneByQuery(query: object): Promise<User> {
    const user = await this.userRepository.findOne({
      where: query,
      relations: ['socialMedia'],
    });
    if (!user) {
      throw new RpcException(
        {
          code: status.NOT_FOUND,
          message: `User with query ${JSON.stringify(query)} not found`,
        }
      )
    }
    return UserMapper.toGrpc(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['socialMedia'],
    });
    if (!user) {
      throw new RpcException(
        {
          code: status.NOT_FOUND,
          message: `User with id ${id} not found`,
        }
      )
    }
    if (updateUserDto.socialMedia) {
      if (user.socialMedia) {
        // Nếu đã có SocialMedia thì cập nhật
        user.socialMedia.email = updateUserDto.socialMedia.email;
        user.socialMedia.phone = updateUserDto.socialMedia.phone;
        user.socialMedia.fbUri = updateUserDto.socialMedia.fbUri;
        user.socialMedia.twitterUri = updateUserDto.socialMedia.twitterUri;
      } else {
        const sm = new SocialMediaEntity();
        sm.email = updateUserDto.socialMedia.email;
        sm.phone = updateUserDto.socialMedia.phone;
        sm.fbUri = updateUserDto.socialMedia.fbUri;
        sm.twitterUri = updateUserDto.socialMedia.twitterUri;
        sm.user = user;
        user.socialMedia = sm;
      }
    }
    const savedUser = await this.userRepository.save(user);
    return UserMapper.toGrpc(savedUser);
  }

  async remove(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['socialMedia'],
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    await this.socialMediaRepository.remove(user.socialMedia);
    await this.userRepository.remove(user);
    return UserMapper.toGrpc(user);
  }

  queryUsers(paginationDtoStream: Observable<PaginationDto>): Observable<UserList> {
    const subject = new Subject<UserList>();

    const onNext = async (paginationDto: PaginationDto) => {
      const start = paginationDto.page * paginationDto.skip;
      subject.next({
        users: await this.userRepository.find({
          skip: start,
          take: paginationDto.skip,
          relations: ['socialMedia'],
        }).then(users => users.map(user => UserMapper.toGrpc(user))),
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
