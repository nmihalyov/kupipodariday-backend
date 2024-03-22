import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { removeHiddenOffersOwners } from 'src/common/helpers/removeHiddenOffersOwners';
import { Repository } from 'typeorm';
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

  async findAll(userId: number): Promise<User[]> {
    const users = await this.userRepository.find();

    users.forEach((user) => removeHiddenOffersOwners(user.wishes, userId));

    return users;
  }

  async findOne(id: number, userId: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    removeHiddenOffersOwners(user.wishes, userId);

    return user;
  }

  async findByUsername(username: string, userId: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ username });

    removeHiddenOffersOwners(user.wishes, userId);

    return user;
  }

  async findByUsernameWithPassword(username: string): Promise<User> {
    return this.userRepository
      .createQueryBuilder('entity')
      .select(['entity', 'entity.password'])
      .where('entity.username = :username', { username })
      .getOne();
  }

  async findByEmail(email: string, userId: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });

    removeHiddenOffersOwners(user.wishes, userId);

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    this.userRepository.update(id, updateUserDto);

    return this.findOne(id, id);
  }

  async findCurrentWishes(id: number): Promise<Wish[]> {
    const { wishes } = await this.userRepository.findOne({
      where: { id },
      relations: ['wishes', 'wishes.offers'],
    });

    removeHiddenOffersOwners(wishes, id);

    return wishes;
  }

  async findWishesByUsername(
    username: string,
    userId: number,
  ): Promise<Wish[]> {
    const { wishes } = await this.userRepository.findOne({
      where: { username },
      relations: ['wishes', 'wishes.offers'],
    });

    removeHiddenOffersOwners(wishes, userId);

    return wishes;
  }

  async findByQuery(query: string, userId: number): Promise<User[]> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :query OR user.email = :query', { query })
      .getMany();

    users.forEach((user) => removeHiddenOffersOwners(user.wishes, userId));

    return users;
  }
}
