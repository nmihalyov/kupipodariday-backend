import {
  Body,
  ConflictException,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { LocalGuard } from '../../guards/local.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/sign-in.dto';

@Controller()
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  signin(@Req() req, @Body() signinDto: SigninDto) {
    return this.authService.auth(req.user);
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const userByName = await this.usersService.findByUsername(
      createUserDto.username,
    );
    const userByEmail = await this.usersService.findByEmail(
      createUserDto.email,
    );

    if (userByName || userByEmail) {
      throw new ConflictException(
        'Пользователь с таким email или username уже зарегистрирован',
      );
    }

    const hash = await bcrypt.hash(createUserDto.password, 10);

    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hash,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = newUser;

    this.authService.auth(newUser);

    return result;
  }
}
