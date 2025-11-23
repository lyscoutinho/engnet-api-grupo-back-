import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user/user.entity';
import { CreateUserDto } from '../entity/dto/user/createUserDto';
import { UpdateUserDto } from '../entity/dto/user/updateUserDto';
import * as bcrypt from 'bcrypt';
import { DiretoriaEnum } from 'src/entity/enums/diretoria';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    const user = this.userRepo.create({
        ...dto,
        diretoria: dto.diretoria as DiretoriaEnum,
    });
    user.senha = await bcrypt.hash(dto.senha, 10);

    return this.userRepo.save(user);
  }

  findAll() {
    return this.userRepo.find();
  }

  async findOne(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findOne(id);

    if (dto.senha) {
      dto.senha = await bcrypt.hash(dto.senha, 10);
    }

    Object.assign(user, dto);
    return this.userRepo.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    return this.userRepo.remove(user);
  }
}
