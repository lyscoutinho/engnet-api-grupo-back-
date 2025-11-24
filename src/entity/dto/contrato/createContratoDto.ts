export class CreateContratoDto {
  clienteId: string;
  descricao: string;
  dataInicio: Date;
  dataFim?: Date;
  status?: string;
  valor: number;
}
