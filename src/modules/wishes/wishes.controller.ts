import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Header,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/guards/jwt.guard';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { WishesService } from './wishes.service';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  private async checkWishOwner(wishId: number, userId: number) {
    const wish = await this.wishesService.findOne(wishId, userId);

    if (!wish) {
      throw new NotFoundException('Желание не найдено');
    }

    if (wish.owner.id !== userId) {
      throw new ForbiddenException('Доступ запрещен');
    }
  }

  @UseGuards(JwtGuard)
  @Post()
  create(@Req() req, @Body() createWishDto: CreateWishDto) {
    const { user } = req;
    createWishDto.owner = user;

    return this.wishesService.create(createWishDto);
  }

  @UseGuards(JwtGuard)
  @Header('Cache-Control', 'no-cache, max-age=86400')
  @Get()
  findAll(@Req() req) {
    return this.wishesService.findAll(req.user.id);
  }

  @Header('Cache-Control', 'no-cache, max-age=86400')
  @Get('top')
  findTopWishes(@Req() req) {
    return this.wishesService.findTopWishes(req.user.id);
  }

  @Header('Cache-Control', 'no-cache, max-age=86400')
  @Get('last')
  findLastWishes(@Req() req) {
    return this.wishesService.findLastWishes(req.user.id);
  }

  @UseGuards(JwtGuard)
  @Header('Cache-Control', 'no-cache, max-age=86400')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const userId = req.user.id;

    return this.wishesService.findOne(id, userId);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    const userId = req.user.id;
    const wish = await this.wishesService.findOne(id, userId);
    await this.checkWishOwner(id, userId);

    if (wish.offers.length && updateWishDto.price !== undefined) {
      throw new ForbiddenException(
        'Нельзя изменить цену, так как уже есть предложения',
      );
    }

    return this.wishesService.update(id, userId, updateWishDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const userId = req.user.id;
    await this.checkWishOwner(id, userId);

    return this.wishesService.remove(id, userId);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copyWish(@Param('id') id: number, @Req() req) {
    const user = req.user;

    return this.wishesService.copy(id, user);
  }
}
