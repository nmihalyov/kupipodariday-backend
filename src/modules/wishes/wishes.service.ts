import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
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
    return this.wishRepository.find();
  }

  async findOne(id: number): Promise<Wish> {
    return this.wishRepository.findOneBy({ id });
  }

  async update(
    id: number,
    updateWishDto: UpdateWishDto,
  ): Promise<UpdateResult> {
    return this.wishRepository.update(id, updateWishDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    return this.wishRepository.delete({ id });
  }
}
