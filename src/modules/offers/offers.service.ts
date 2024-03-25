import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
  ) {}

  async create(createOfferDto: CreateOfferDto): Promise<Offer> {
    return this.offerRepository.save(createOfferDto);
  }

  async findAll(): Promise<Offer[]> {
    return this.offerRepository.find({
      relations: ['user', 'wish'],
    });
  }

  async findOne(id: number): Promise<Offer> {
    return this.offerRepository.findOne({
      where: { id },
      relations: ['user', 'wish'],
    });
  }

  async update(
    id: number,
    updateOfferDto: UpdateOfferDto,
  ): Promise<UpdateResult> {
    return this.offerRepository.update(id, updateOfferDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    return this.offerRepository.delete({ id });
  }
}
