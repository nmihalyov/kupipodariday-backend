import {
  Body,
  Controller,
  Get,
  Header,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import * as bcrypt from 'bcryptjs';
import { JwtGuard } from 'src/guards/jwt.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private async checkUser(id: number) {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Header('Cache-Control', 'no-cache, max-age=86400')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Header('Cache-Control', 'no-cache, max-age=86400')
  @Get('me')
  findCurrent(@Req() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Patch('me')
  async updateCurrent(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const { id } = req.user;
    const { password } = updateUserDto;

    await this.checkUser(id);

    if (password) {
      updateUserDto.password = await bcrypt.hash(password, 10);
    }

    return this.usersService.update(id, updateUserDto);
  }

  @Header('Cache-Control', 'no-cache, max-age=86400')
  @Get('me/wishes')
  findCurrentWishes(@Req() req) {
    return this.usersService.findCurrentWishes(req.user.id);
  }

  @Header('Cache-Control', 'no-cache, max-age=86400')
  @Get(':username')
  findByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @Header('Cache-Control', 'no-cache, max-age=86400')
  @Get(':username/wishes')
  findWishesByUsername(@Param('username') username: string) {
    return this.usersService.findWishesByUsername(username);
  }

  @Header('Cache-Control', 'no-cache, max-age=86400')
  @Post('find')
  findByQuery(@Body() findUserDto: FindUserDto) {
    return this.usersService.findByQuery(findUserDto.query);
  }
}
