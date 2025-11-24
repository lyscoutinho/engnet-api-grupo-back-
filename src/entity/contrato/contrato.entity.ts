import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Cliente } from '../cliente/client.entity';
import { Reembolso } from '../reembolso/reembolso.entity';

@Entity('contratos')
export class Contrato {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  descricao: string;

  @Column()
  dataInicio: Date;

  @Column({ nullable: true })
  dataFim: Date;

  @Column()
  status: string;

  @Column('decimal', { precision: 10, scale: 2 })
  valor: number;

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;

  // (n,n) -> Users (membros) - Um contrato pode ter vários membros
  @ManyToMany(() => User, (user) => user.contratos)
  @JoinTable({
    name: 'contratos_membros',
    joinColumn: { name: 'contrato_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  membros: User[];

  // (n,1) -> Cliente - Um contrato tem apenas um cliente
  @ManyToOne(() => Cliente, (cliente) => cliente.contratos, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  // (1,1) -> Reembolso - Um contrato tem apenas um reembolso
  @OneToMany(() => Reembolso, (reembolso) => reembolso.contrato, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  reembolso: Reembolso;
}
