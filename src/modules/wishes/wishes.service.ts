import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async findAll(): Promise<Wish[]> {
    return this.wishRepository.find({ relations: ['owner', 'offers'] });
  }

  async findOne(id: number): Promise<Wish> {
    const wish = (
      await this.wishRepository.find({
        where: { id },
        relations: ['owner', 'offers'],
        take: 1,
      })
    )[0];

    return wish;
  }

  async update(id: number, updateWishDto: UpdateWishDto): Promise<Wish> {
    this.wishRepository.update(id, updateWishDto);

    return this.findOne(id);
  }

  async remove(id: number): Promise<Wish> {
    const wish = this.findOne(id);

    this.wishRepository.delete({ id });

    return wish;
  }

  async findTopWishes(): Promise<Wish[]> {
    return this.wishRepository.find({
      order: {
        copied: 'DESC',
      },
      take: 20,
      relations: ['owner', 'offers'],
    });
  }

  async findLastWishes(): Promise<Wish[]> {
    return this.wishRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: 40,
      relations: ['owner', 'offers'],
    });
  }

  async copy(id: number, user): Promise<Wish> {
    const originalWish = await this.findOne(id);
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

    return this.create(copiedWish);
  }
}
