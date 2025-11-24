import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { Relatorio } from '../entity/relatorios/relatorio.entity';
import { Reembolso } from '../entity/reembolso/reembolso.entity';
import { CreateRelatorioDto } from '../entity/dto/relatorio/CreateRelatorioDto';
import { RelatorioResponseDto } from '../entity/dto/relatorio/RelatorioResponseDto';

@Injectable()
export class RelatorioService {
  constructor(
    @InjectRepository(Relatorio)
    private readonly relatorioRepo: Repository<Relatorio>,
    @InjectRepository(Reembolso)
    private readonly reembolsoRepo: Repository<Reembolso>,
  ) {}

  async create(
    reembolsoId: string,
    dto: CreateRelatorioDto,
  ): Promise<RelatorioResponseDto> {
    const reembolso = await this.reembolsoRepo.findOne({
      where: { id: reembolsoId },
      relations: ['contrato'],
    });

    if (!reembolso) {
      throw new NotFoundException('Reembolso não encontrado');
    }

    const relatorio = this.relatorioRepo.create({
      ...dto,
      reembolso,
    });

    const saved = await this.relatorioRepo.save(relatorio);
    return this.mapToDto(saved);
  }

  async findAll(reembolsoId: string): Promise<RelatorioResponseDto[]> {
    const relatorios = await this.relatorioRepo.find({
      where: { reembolso: { id: reembolsoId } },
    });

    return relatorios.map((r) => this.mapToDto(r));
  }

  async findOne(id: string): Promise<RelatorioResponseDto> {
    const relatorio = await this.relatorioRepo.findOne({ where: { id } });

    if (!relatorio) {
      throw new NotFoundException('Relatório não encontrado');
    }

    return this.mapToDto(relatorio);
  }

  async remove(id: string): Promise<void> {
    const relatorio = await this.findOne(id);
    await this.relatorioRepo.remove(relatorio as any);
  }

  /**
   * Exporta um relatório para Excel com dados do reembolso
   * Simples e completo com formatação
   */
  async exportToExcel(reembolsoId: string): Promise<Buffer> {
    const reembolso = await this.reembolsoRepo.findOne({
      where: { id: reembolsoId },
      relations: ['contrato', 'contrato.cliente', 'contrato.membros', 'relatorios'],
    });

    if (!reembolso) {
      throw new NotFoundException('Reembolso não encontrado');
    }

    const workbook = new ExcelJS.Workbook();

    // Aba 1: Informações do Reembolso
    const reembolsoSheet = workbook.addWorksheet('Reembolso');
    reembolsoSheet.columns = [
      { header: 'Campo', key: 'campo', width: 20 },
      { header: 'Valor', key: 'valor', width: 30 },
    ];

    reembolsoSheet.addRows([
      { campo: 'ID Reembolso', valor: reembolso.id },
      { campo: 'Valor', valor: `R$ ${reembolso.valor.toFixed(2)}` },
      { campo: 'Descrição', valor: reembolso.descricao },
      { campo: 'Criado em', valor: reembolso.criadoEm.toLocaleDateString('pt-BR') },
      { campo: 'Atualizado em', valor: reembolso.atualizadoEm.toLocaleDateString('pt-BR') },
    ]);

    // Aba 2: Informações do Contrato
    const contratoSheet = workbook.addWorksheet('Contrato');
    contratoSheet.columns = [
      { header: 'Campo', key: 'campo', width: 20 },
      { header: 'Valor', key: 'valor', width: 30 },
    ];

    contratoSheet.addRows([
      { campo: 'ID Contrato', valor: reembolso.contrato.id },
      { campo: 'Cliente', valor: reembolso.contrato.cliente.nome },
      { campo: 'Descrição', valor: reembolso.contrato.descricao },
      { campo: 'Status', valor: reembolso.contrato.status },
      { campo: 'Criado em', valor: reembolso.contrato.criadoEm.toLocaleDateString('pt-BR') },
    ]);

    // Aba 3: Membros do Contrato
    const membrosSheet = workbook.addWorksheet('Membros');
    membrosSheet.columns = [
      { header: 'Nome', key: 'nome', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Diretoria', key: 'diretoria', width: 20 },
    ];

    reembolso.contrato.membros.forEach((membro) => {
      membrosSheet.addRow({
        nome: membro.nome,
        email: membro.email,
        diretoria: membro.diretoria,
      });
    });

    // Aba 4: Relatórios Vinculados
    const relatoriosSheet = workbook.addWorksheet('Relatórios');
    relatoriosSheet.columns = [
      { header: 'Nome', key: 'nome', width: 25 },
      { header: 'Tipo', key: 'tipo', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Período', key: 'periodo', width: 15 },
      { header: 'Tamanho (MB)', key: 'tamanho', width: 15 },
      { header: 'Criado em', key: 'criadoEm', width: 15 },
    ];

    reembolso.relatorios.forEach((rel) => {
      relatoriosSheet.addRow({
        nome: rel.nome,
        tipo: rel.tipo,
        status: rel.status,
        periodo: rel.periodo,
        tamanho: (rel.tamanho / 1024 / 1024).toFixed(2),
        criadoEm: rel.criadoEm.toLocaleDateString('pt-BR'),
      });
    });

    // Aplicar formatação
    [reembolsoSheet, contratoSheet, membrosSheet, relatoriosSheet].forEach((sheet) => {
      sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
      sheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' },
      };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer as unknown as Buffer;
  }

  private mapToDto(relatorio: Relatorio): RelatorioResponseDto {
    return {
      id: relatorio.id,
      nome: relatorio.nome,
      tipo: relatorio.tipo,
      status: relatorio.status,
      periodo: relatorio.periodo,
      tamanho: relatorio.tamanho,
      urlArquivo: relatorio.urlArquivo,
      criadoEm: relatorio.criadoEm,
      ultimaAtualizacao: relatorio.ultimaAtualizacao,
    };
  }
}