import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Header,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HideOwner } from 'src/common/interceptors/hideOwner.interceptor';
import { JwtGuard } from 'src/guards/jwt.guard';
import { WishesService } from '../wishes/wishes.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OffersService } from './offers.service';

@UseGuards(JwtGuard)
@Controller('offers')
export class OffersController {
  constructor(
    private readonly offersService: OffersService,
    private readonly wishesService: WishesService,
  ) {}

  @Post()
  async create(@Req() req, @Body() createOfferDto: CreateOfferDto) {
    const { id } = req.user;
    const { itemId, amount } = createOfferDto;
    const wish = await this.wishesService.findOne(itemId, id);

    if (!wish) {
      throw new NotFoundException('Желание по указанному ID не найдено');
    }

    if (id === wish.owner.id) {
      throw new ForbiddenException(
        'Нельзя добавить предложение на свое желание',
      );
    }

    if (wish.raised + amount > wish.price) {
      throw new ForbiddenException(
        `Нельзя добавить предложение более, чем на ${wish.price - wish.raised}₽`,
      );
    }

    const updatedWish = await this.wishesService.updateRaised(
      itemId,
      id,
      amount + wish.raised,
    );

    createOfferDto.owner = req.user;
    createOfferDto.wish = updatedWish;

    return this.offersService.create(createOfferDto);
  }

  @UseInterceptors(HideOwner)
  @Header('Cache-Control', 'no-cache, max-age=86400')
  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @UseInterceptors(HideOwner)
  @Header('Cache-Control', 'no-cache, max-age=86400')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.offersService.findOne(id);
  }
}
