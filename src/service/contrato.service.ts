import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contrato } from '../entity/contrato/contrato.entity';
import { Cliente } from '../entity/cliente/client.entity';
import { User } from '../entity/user/user.entity';
import { CreateContratoDto } from '../entity/dto/contrato/createContratoDto';
import { UpdateContratoDto } from '../entity/dto/contrato/updateContratoDto';

@Injectable()
export class ContratoService {
  constructor(
    @InjectRepository(Contrato)
    private readonly contratoRepo: Repository<Contrato>,
    @InjectRepository(Cliente)
    private readonly clienteRepo: Repository<Cliente>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  /**
   * PASSO 1: Criar contrato com todos os dados necessários
   */
  async create(dto: CreateContratoDto) {
    const cliente = await this.clienteRepo.findOne({
      where: { id: dto.clienteId },
    });

    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

    const contrato = this.contratoRepo.create({
      descricao: dto.descricao,
      dataInicio: dto.dataInicio,
      dataFim: dto.dataFim,
      status: dto.status || 'ativo',
      valor: dto.valor,
      cliente,
      membros: [],
    });

    return this.contratoRepo.save(contrato);
  }

  /**
   * PASSO 2: Vincular membros ao contrato (N:N)
   */
  async adicionarMembro(contratoId: string, usuarioId: string) {
    const contrato = await this.contratoRepo.findOne({
      where: { id: contratoId },
      relations: ['membros'],
    });

    if (!contrato) {
      throw new NotFoundException('Contrato não encontrado');
    }

    const usuario = await this.userRepo.findOne({
      where: { id: usuarioId },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar se já existe
    if (contrato.membros.some((m) => m.id === usuarioId)) {
      throw new BadRequestException('Membro já vinculado a este contrato');
    }

    contrato.membros.push(usuario);
    return this.contratoRepo.save(contrato);
  }

  /**
   * Remover membro do contrato
   */
  async removerMembro(contratoId: string, usuarioId: string) {
    const contrato = await this.contratoRepo.findOne({
      where: { id: contratoId },
      relations: ['membros'],
    });

    if (!contrato) {
      throw new NotFoundException('Contrato não encontrado');
    }

    contrato.membros = contrato.membros.filter((m) => m.id !== usuarioId);
    return this.contratoRepo.save(contrato);
  }

  /**
   * Recuperar contrato com todos os dados
   */
  async findOne(id: string) {
    const contrato = await this.contratoRepo.findOne({
      where: { id },
      relations: ['cliente', 'membros', 'reembolso', 'reembolso.relatorios'],
    });

    if (!contrato) {
      throw new NotFoundException('Contrato não encontrado');
    }

    return contrato;
  }

  /**
   * Listar todos os contratos
   */
  async findAll() {
    return this.contratoRepo.find({
      relations: ['cliente', 'membros', 'reembolso'],
    });
  }

  /**
   * Atualizar contrato
   */
  async update(id: string, dto: UpdateContratoDto) {
    const contrato = await this.findOne(id);

    Object.assign(contrato, dto);

    return this.contratoRepo.save(contrato);
  }

  /**
   * Deletar contrato
   */
  async remove(id: string) {
    const contrato = await this.findOne(id);
    return this.contratoRepo.remove(contrato);
  }
}