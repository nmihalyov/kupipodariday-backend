import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './modules/offers/entities/offer.entity';
import { OffersModule } from './modules/offers/offers.module';
import { User } from './modules/users/entities/user.entity';
import { UsersModule } from './modules/users/users.module';
import { Wish } from './modules/wishes/entities/wish.entity';
import { WishesModule } from './modules/wishes/wishes.module';
import { Wishlist } from './modules/wishlists/entities/wishlist.entity';
import { WishlistsModule } from './modules/wishlists/wishlists.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'admin',
      database: 'kpd_db',
      entities: [User, Wish, Offer, Wishlist],
      synchronize: true,
    }),
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
  ],
})
export class AppModule {}
