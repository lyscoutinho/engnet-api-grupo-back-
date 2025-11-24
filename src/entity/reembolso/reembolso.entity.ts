import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Contrato } from '../contrato/contrato.entity';
import { User } from '../user/user.entity'; 
import { Relatorio } from '../relatorios/relatorio.entity';
import { StatusReembolso } from '../enums/status-reembolso';

@Entity('reembolsos')
export class Reembolso {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  descricao: string;

  // Novo campo solicitado
  @Column()
  categoria: string;

  @Column('decimal', { precision: 10, scale: 2 })
  valor: number;

  @Column({ nullable: true })
  observacoes: string;

  // Novo campo de Status
  @Column({
    type: 'enum',
    enum: StatusReembolso,
    default: StatusReembolso.PENDENTE,
  })
  status: StatusReembolso;

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;

  // MUDANÇA: (N,1) -> Muitos reembolsos para Um contrato
  @ManyToOne(() => Contrato, (contrato) => contrato.reembolso, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'contrato_id' })
  contrato: Contrato;

  // NOVO: (N,1) -> Muitos reembolsos para Um solicitante (User)
  @ManyToOne(() => User, (user) => user.reembolsos, {
    nullable: false,
  })
  @JoinColumn({ name: 'solicitante_id' })
  solicitante: User;

  @OneToMany(() => Relatorio, (relatorio) => relatorio.reembolso, {
    cascade: true,
  })
  relatorios: Relatorio[];
}