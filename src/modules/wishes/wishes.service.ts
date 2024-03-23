import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { removeHiddenOffersOwners } from '../../common/helpers/removeHiddenOffersOwners';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto): Promise<Wish> {
    return this.wishRepository.save(createWishDto);
  }

  async findAll(userId: number): Promise<Wish[]> {
    const wishes = await this.wishRepository.find({
      relations: ['owner', 'offers', 'offers.owner'],
    });

    removeHiddenOffersOwners(wishes, userId);

    return wishes;
  }

  async findOne(id: number, userId: number): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: ['owner', 'offers', 'offers.owner'],
    });

    removeHiddenOffersOwners(wish, userId);

    return wish;
  }

  async update(
    id: number,
    userId: number,
    updateWishDto: UpdateWishDto,
  ): Promise<Wish> {
    this.wishRepository.update(id, updateWishDto);

    return this.findOne(id, userId);
  }

  async updateRaised(
    id: number,
    userId: number,
    raised: number,
  ): Promise<Wish> {
    this.wishRepository.update(id, { raised });

    return this.findOne(id, userId);
  }

  async remove(id: number, userId: number): Promise<Wish> {
    const wish = this.findOne(id, userId);

    this.wishRepository.delete({ id });

    return wish;
  }

  async findTopWishes(userId?: number): Promise<Wish[]> {
    const wishes = await this.wishRepository.find({
      order: {
        copied: 'DESC',
      },
      take: 20,
      relations: ['owner', 'offers', 'offers.owner'],
    });

    removeHiddenOffersOwners(wishes, userId);

    return wishes;
  }

  async findLastWishes(userId?: number): Promise<Wish[]> {
    const wishes = await this.wishRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: 40,
      relations: ['owner', 'offers', 'offers.owner'],
    });

    removeHiddenOffersOwners(wishes, userId);

    return wishes;
  }

  async copy(id: number, user): Promise<Wish> {
    const originalWish = await this.findOne(id, user.id);
    const { name, link, image, price, description } = originalWish;

    originalWish.copied++;

    const copiedWish: CreateWishDto = {
      name,
      link,
      image,
      price,
      description,
      owner: user,
    };

    this.wishRepository.save(originalWish);

    const resultWish = await this.create(copiedWish);

    removeHiddenOffersOwners(resultWish, user.id);

    return resultWish;
  }
}
