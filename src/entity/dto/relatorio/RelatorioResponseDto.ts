import { StatusRelatorio } from '../../enums/status-relatorio';
import { PeriodoRelatorio } from '../../enums/periodo-relatorio';

export class RelatorioResponseDto {
  id: string;
  nome: string;
  tipo: string;
  status: StatusRelatorio;
  periodo: PeriodoRelatorio;
  tamanho: number;
  urlArquivo: string;
  criadoEm: Date;
  ultimaAtualizacao: Date;
}