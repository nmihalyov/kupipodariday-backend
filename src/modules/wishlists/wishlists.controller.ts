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
import { WishesService } from '../wishes/wishes.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { WishlistsService } from './wishlists.service';

@UseGuards(JwtGuard)
@Controller('wishlists')
export class WishlistsController {
  constructor(
    private readonly wishlistsService: WishlistsService,
    private readonly wishesService: WishesService,
  ) {}

  private async checkWishlist(wishId: number) {
    const wishlist = await this.wishlistsService.findOne(wishId);

    if (!wishlist) {
      throw new NotFoundException('Вишлист не найден');
    }

    return wishlist;
  }

  private async checkWishlistOwner(wishId: number, userId: number) {
    const wishlist = await this.checkWishlist(wishId);

    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException('Доступ запрещен');
    }

    return wishlist;
  }

  private async addWishesToWishlist<
    T extends CreateWishlistDto | UpdateWishlistDto,
  >(dto: T, userId: number) {
    const { itemsId } = dto;

    if (!itemsId?.length) {
      return;
    }

    dto.items = [];

    for (let i = 0; i < itemsId.length; i++) {
      const wishId = itemsId[i];
      const wish = await this.wishesService.findOne(wishId, userId);

      if (!wish) {
        throw new NotFoundException(`Подарок с ID: ${wishId} не найден`);
      }

      if (wish.owner.id !== userId) {
        throw new ForbiddenException('Невозможно добавить чужой подарок');
      }

      dto.items.push(wish);
    }
  }

  @Post()
  async create(@Req() req, @Body() createWishlistDto: CreateWishlistDto) {
    const { id: userId } = req.user;

    createWishlistDto.owner = req.user;
    createWishlistDto.description = createWishlistDto.description || '';
    await this.addWishesToWishlist(createWishlistDto, userId);

    return this.wishlistsService.create(createWishlistDto);
  }

  @Header('Cache-Control', 'no-cache, max-age=86400')
  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @Header('Cache-Control', 'no-cache, max-age=86400')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.wishlistsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    const userId = req.user.id;

    const wishlist = await this.checkWishlistOwner(id, userId);
    await this.addWishesToWishlist(updateWishlistDto, userId);

    return this.wishlistsService.update(id, {
      ...wishlist,
      ...updateWishlistDto,
    });
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    await this.checkWishlistOwner(id, req.user.id);

    return this.wishlistsService.remove(id);
  }
}
