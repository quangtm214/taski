import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, JwtAuthGuard, Roles, RolesGuard, UpdateUserDto } from '@app/common';
import { UserRoleEntity } from 'apps/api-gateway/src/users/enum/user.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEntity.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('personal-profile')
  @UseGuards(JwtAuthGuard)
  findPersonalProfile(@Req() req) {
    console.log('User ID from request:', req.user);
    const id = req.user.id;
    return this.usersService.findOne(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }



  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post('email')
  emailUser() {
    return this.usersService.emailUser();
  }
}
