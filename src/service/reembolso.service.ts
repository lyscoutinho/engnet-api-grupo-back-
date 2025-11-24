import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reembolso } from '../entity/reembolso/reembolso.entity';
import { StatusReembolso } from 'src/entity/enums/status-reembolso';
import { Contrato } from '../entity/contrato/contrato.entity';
import { User } from '../entity/user/user.entity';
import { CreateReembolsoDto } from '../entity/dto/reembolso/createReembolsoDto';
import { UpdateReembolsoDto } from '../entity/dto/reembolso/updateReembolsoDto';

@Injectable()
export class ReembolsoService {
  constructor(
    @InjectRepository(Reembolso)
    private readonly reembolsoRepo: Repository<Reembolso>,
    @InjectRepository(Contrato)
    private readonly contratoRepo: Repository<Contrato>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(contratoId: string, userId: string, dto: CreateReembolsoDto) {
    const contrato = await this.contratoRepo.findOne({
      where: { id: contratoId },
    });
    if (!contrato) throw new NotFoundException('Contrato não encontrado');

    const solicitante = await this.userRepo.findOne({ where: { id: userId } });
    if (!solicitante) throw new NotFoundException('Usuário não encontrado');

    // Não há mais verificação de "se já existe", pois é 1:N

    const reembolso = this.reembolsoRepo.create({
      ...dto,
      status: StatusReembolso.PENDENTE,
      contrato,
      solicitante,
    });

    return this.reembolsoRepo.save(reembolso);
  }
  /**
   * Recuperar reembolso de um contrato
   */
  async findByContrato(contratoId: string) {
    const reembolso = await this.reembolsoRepo.findOne({
      where: { contrato: { id: contratoId } },
      relations: ['contrato', 'relatorios'],
    });

    if (!reembolso) {
      throw new NotFoundException('Reembolso não encontrado para este contrato');
    }

    return reembolso;
  }

  /**
   * Recuperar reembolso por ID
   */
  async findOne(id: string) {
    const reembolso = await this.reembolsoRepo.findOne({
      where: { id },
      relations: ['contrato', 'relatorios'],
    });

    if (!reembolso) {
      throw new NotFoundException('Reembolso não encontrado');
    }

    return reembolso;
  }

  /**
   * Listar todos os reembolsos
   */
  async findAll() {
    return this.reembolsoRepo.find({
      relations: ['contrato', 'solicitante', 'relatorios'],
      order: { criadoEm: 'DESC' }
    });
  }

  /**
   * Atualizar reembolso
   */
  async update(id: string, dto: UpdateReembolsoDto) {
    const reembolso = await this.findOne(id);

    Object.assign(reembolso, dto);

    return this.reembolsoRepo.save(reembolso);
  }
  async updateStatus(id: string, status: StatusReembolso) {
    const reembolso = await this.reembolsoRepo.findOne({ where: { id } });
    if (!reembolso) throw new NotFoundException('Reembolso não encontrado');
    
    reembolso.status = status;
    return this.reembolsoRepo.save(reembolso);
  }

  /**
   * Deletar reembolso
   */
  async remove(id: string) {
    const reembolso = await this.findOne(id);
    return this.reembolsoRepo.remove(reembolso);
  }
}
