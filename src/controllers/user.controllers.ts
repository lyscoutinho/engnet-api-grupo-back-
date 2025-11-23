import {
  UseGuards,
  Controller,
  Get,
  Req,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../application/auth/jwt-auth.guard';
import { UserService } from '../service/user.service';
import { CreateUserDto } from '../entity/dto/user/createUserDto';
import { UpdateUserDto } from '../entity/dto/user/updateUserDto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req) {
    return req.user;
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
