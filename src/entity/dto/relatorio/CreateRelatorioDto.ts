import { PeriodoRelatorio } from '../../enums/periodo-relatorio';

export class CreateRelatorioDto {
  nome: string;
  tipo: string;
  periodo: PeriodoRelatorio;
  tamanho: number;
  urlArquivo: string;
}