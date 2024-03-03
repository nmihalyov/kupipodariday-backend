import { IsInt, IsUrl, Length } from 'class-validator';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { User } from '../../users/entities/user.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';

@Entity()
export class Wish extends BaseEntity {
  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column()
  price: number;

  @Column()
  raised: number;

  @Column()
  @IsUrl()
  owner: string;

  @Column()
  @Length(1, 1024)
  description: string;

  @Column()
  @IsInt()
  copied: number;

  @OneToMany(() => Offer, (offer) => offer.wish)
  offers: Offer[];

  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items)
  @JoinTable()
  wishlists: Wishlist[];

  @ManyToOne(() => User, (user) => user.wishes)
  user: number;
}
