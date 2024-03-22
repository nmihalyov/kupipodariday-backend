import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Wish } from '../wishes/entities/wish.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.save(createUserDto);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async findByUsername(username: string): Promise<User> {
    return this.userRepository.findOneBy({ username });
  }

  async findByUsernameWithPassword(username: string): Promise<User> {
    return this.userRepository
      .createQueryBuilder('entity')
      .select(['entity', 'entity.password'])
      .where('entity.username = :username', { username })
      .getOne();
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    this.userRepository.update(id, updateUserDto);

    return this.findOne(id);
  }

  async remove(id: number): Promise<DeleteResult> {
    return this.userRepository.delete({ id });
  }

  async findCurrentWishes(id: number): Promise<Wish[]> {
    const user = (
      await this.userRepository.find({
        where: { id },
        relations: ['wishes', 'wishes.offers'],
        take: 1,
      })
    )[0];

    return user.wishes;
  }

  async findWishesByUsername(username: string): Promise<Wish[]> {
    const user = (
      await this.userRepository.find({
        where: { username },
        relations: ['wishes', 'wishes.offers'],
        take: 1,
      })
    )[0];

    return user.wishes;
  }

  async findByQuery(query: string): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :query OR user.email = :query', { query })
      .getMany();
  }
}
