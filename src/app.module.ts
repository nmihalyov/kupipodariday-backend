import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import configuration from './configuration';
import { Offer } from './modules/offers/entities/offer.entity';
import { OffersModule } from './modules/offers/offers.module';
import { User } from './modules/users/entities/user.entity';
import { UsersModule } from './modules/users/users.module';
import { Wish } from './modules/wishes/entities/wish.entity';
import { WishesModule } from './modules/wishes/wishes.module';
import { Wishlist } from './modules/wishlists/entities/wishlist.entity';
import { WishlistsModule } from './modules/wishlists/wishlists.module';

config({ path: `.env${process.env.NODE_ENV === 'dev' ? '.dev' : ''}` });

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService) => ({
        type: configService.get('database.type'),
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [User, Wish, Offer, Wishlist],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
  ],
})
export class AppModule {}
