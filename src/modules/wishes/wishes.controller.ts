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

  private async checkWish(id: number) {
    const wish = await this.wishesService.findOne(id);

    if (!wish) {
      throw new NotFoundException('Желание не найдено');
    }
  }

  private async checkWishOwner(wishId: number, userId: number) {
    const wish = await this.wishesService.findOne(wishId);

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
  findAll() {
    return this.wishesService.findAll();
  }

  @Header('Cache-Control', 'no-cache, max-age=86400')
  @Get('top')
  findTopWishes() {
    return this.wishesService.findTopWishes();
  }

  @Header('Cache-Control', 'no-cache, max-age=86400')
  @Get('last')
  findLastWishes() {
    return this.wishesService.findLastWishes();
  }

  @UseGuards(JwtGuard)
  @Header('Cache-Control', 'no-cache, max-age=86400')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.wishesService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    await this.checkWishOwner(id, req.user.id);

    return this.wishesService.update(id, updateWishDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    await this.checkWishOwner(id, req.user.id);

    return this.wishesService.remove(id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copyWish(@Param('id') id: number, @Req() req) {
    const user = req.user;

    return this.wishesService.copy(id, user);
  }
}
