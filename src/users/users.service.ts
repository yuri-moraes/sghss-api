import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll(role?: UserRole, page: number = 1, limit: number = 10) {
    const options: FindManyOptions<User> = {
      skip: (page - 1) * limit,
      take: limit,
    };

    if (role) {
      options.where = { role };
    }

    const [data, total] = await this.userRepository.findAndCount(options);

    return {
      data,
      total,
      page,
      limit,
    };
  }

  findOne(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
