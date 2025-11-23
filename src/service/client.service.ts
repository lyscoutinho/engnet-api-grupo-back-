import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from '../entity/cliente/client.entity';
import { CreateClientDto } from '../entity/dto/cliente/createClientDto';
import { UpdateClientDto } from '../entity/dto/cliente/updateClientDto';
import { ClienteResponseDto } from '../entity/dto/cliente/CienteResponseDto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clientRepo: Repository<Cliente>,
  ) {}

  // -------------------------------
  // Gera o código CLI001, CLI002, ...
  // -------------------------------
  private async gerarCodigoCliente(): Promise<string> {
    const ultimo = await this.clientRepo.find({
      order: { id: 'DESC' }, // garante o último criado
      take: 1,
    });

    if (!ultimo.length || !ultimo[0].codigo) {
      return 'CLI001';
    }

    const ultimoCodigo = ultimo[0].codigo; // ex: CLI015
    const numero = parseInt(ultimoCodigo.replace('CLI', ''), 10);

    const novoNumero = isNaN(numero) ? 1 : numero + 1;

    return `CLI${novoNumero.toString().padStart(3, '0')}`;
  }

  // -------------------------------
  // Mapeia o entity para DTO
  // -------------------------------
  private toResponse(entity: Cliente): ClienteResponseDto {
    return {
      codigo: entity.codigo,
      nome: entity.nome,
      telefone: entity.telefone,
      documento: entity.cnpj || entity.cpf || ''
    };
  }

  // -------------------------------
  // CREATE
  // -------------------------------
  async create(dto: CreateClientDto): Promise<ClienteResponseDto> {
    const client = this.clientRepo.create(dto);
    client.codigo = await this.gerarCodigoCliente();
    
    const saved = await this.clientRepo.save(client);
    return this.toResponse(saved);
  }

  // -------------------------------
  // FIND ALL
  // -------------------------------
  async findAll(): Promise<ClienteResponseDto[]> {
    const clients = await this.clientRepo.find();
    return clients.map(c => this.toResponse(c));
  }

  // -------------------------------
  // FIND ONE
  // -------------------------------
  async findOne(id: string): Promise<ClienteResponseDto> {
    const client = await this.clientRepo.findOne({ where: { id } });
    if (!client) throw new NotFoundException('Cliente não encontrado');

    return this.toResponse(client);
  }

  // -------------------------------
  // UPDATE
  // -------------------------------
  async update(id: string, dto: UpdateClientDto): Promise<ClienteResponseDto> {
    const client = await this.clientRepo.findOne({ where: { id } });

    if (!client) throw new NotFoundException('Cliente não encontrado');

    Object.assign(client, dto);

    const saved = await this.clientRepo.save(client);
    return this.toResponse(saved);
  }

  // -------------------------------
  // DELETE
  // -------------------------------
  async remove(id: string): Promise<{ message: string }> {
    const client = await this.clientRepo.findOne({ where: { id } });

    if (!client) throw new NotFoundException('Cliente não encontrado');

    await this.clientRepo.remove(client);

    return { message: 'Cliente removido com sucesso' };
  }
}
