import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Reembolso } from '../reembolso/reembolso.entity';
import { StatusRelatorio } from '../enums/status-relatorio';
import { PeriodoRelatorio } from '../enums/periodo-relatorio';

@Entity('relatorios')
export class Relatorio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column()
  tipo: string;

  @Column({
    type: 'enum',
    enum: StatusRelatorio,
    default: StatusRelatorio.DISPONIVEL,
  })
  status: StatusRelatorio;

  @Column({
    type: 'enum',
    enum: PeriodoRelatorio,
  })
  periodo: PeriodoRelatorio;

  @Column()
  tamanho: number;

  @Column()
  urlArquivo: string;

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  ultimaAtualizacao: Date;

  @ManyToOne(() => Reembolso, (reembolso) => reembolso.relatorios, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'reembolso_id' })
  reembolso: Reembolso;
}