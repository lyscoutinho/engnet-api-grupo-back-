import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
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
  dataInicio: Date;

  @Column({ nullable: true })
  dataFim: Date;

  @Column()
  status: string;

  @Column('decimal')
  valor: number;

  // (1,n) -> Users (membros)
  @ManyToOne(() => User, (user) => user.contratos)
  membro: User;

  // (1,n) -> Clientes
  @ManyToOne(() => Cliente, (cliente) => cliente.contratos)
  cliente: Cliente;

  // (1,n) Reembolsos
  @OneToMany(() => Reembolso, (reembolso) => reembolso.contrato)
  reembolsos: Reembolso[];
}
