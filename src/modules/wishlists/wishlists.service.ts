import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
  ) {}

  async create(createWishlistDto: CreateWishlistDto): Promise<Wishlist> {
    return this.wishlistRepository.save(createWishlistDto);
  }

  async findAll(): Promise<Wishlist[]> {
    return this.wishlistRepository.find({
      relations: ['owner', 'items'],
    });
  }

  async findOne(id: number): Promise<Wishlist> {
    return this.wishlistRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });
  }

  async update(id: number, wishlist: Wishlist): Promise<Wishlist> {
    await this.wishlistRepository.save(wishlist);

    return this.findOne(id);
  }

  async remove(id: number): Promise<Wishlist> {
    const wishlist = this.findOne(id);

    this.wishlistRepository.delete({ id });

    return wishlist;
  }
}
