import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contrato } from '../entity/contrato/contrato.entity';
import { Reembolso } from '../entity/reembolso/reembolso.entity';
import { User } from '../entity/user/user.entity';
import { StatusReembolso } from '../entity/enums/status-reembolso';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Contrato) private contratoRepo: Repository<Contrato>,
    @InjectRepository(Reembolso) private reembolsoRepo: Repository<Reembolso>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async getDashboardData() {
    // 1. Receita Total (Soma dos contratos ativos)
    const contratos = await this.contratoRepo.find();
    const receitaTotal = contratos.reduce((acc, curr) => acc + Number(curr.valor), 0);

    // 2. Reembolsos Pendentes (Valor total e quantidade)
    const reembolsosPendentes = await this.reembolsoRepo.find({
        where: { status: StatusReembolso.PENDENTE }
    });
    const valorPendentes = reembolsosPendentes.reduce((acc, curr) => acc + Number(curr.valor), 0);

    // 3. Funcionários Ativos
    const funcionariosAtivos = await this.userRepo.count({ where: { ativo: true } });

    // 4. Reembolsos Recentes (Para a tabela do dashboard)
    const recentes = await this.reembolsoRepo.find({
      relations: ['solicitante'],
      order: { criadoEm: 'DESC' },
      take: 5,
    });

    return {
      kpis: {
        receitaTotal,
        reembolsosPendentes: {
            total: valorPendentes,
            quantidade: reembolsosPendentes.length
        },
        funcionariosAtivos,
        // Substituindo o card de "Produtos" por "Total Contratos" já que não há estoque
        totalContratos: contratos.length 
      },
      reembolsosRecentes: recentes.map(r => ({
        id: r.id,
        funcionario: r.solicitante.nome,
        categoria: r.categoria,
        valor: r.valor,
        status: r.status,
        data: r.criadoEm
      }))
    };
  }
}