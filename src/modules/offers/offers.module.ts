import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from '../wishes/entities/wish.entity';
import { WishesModule } from '../wishes/wishes.module';
import { Offer } from './entities/offer.entity';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Offer]),
    TypeOrmModule.forFeature([Wish]),
    WishesModule,
  ],
  controllers: [OffersController],
  providers: [OffersService],
})
export class OffersModule {}
