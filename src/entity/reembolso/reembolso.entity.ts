import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { Contrato } from '../contrato/contrato.entity';

@Entity('reembolsos')
export class Reembolso {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  data: Date;

  @Column('decimal')
  valor: number;

  @Column()
  descricao: string;

  @Column({ default: false })
  recusa: boolean;

  @Column()
  status: string;

  @ManyToOne(() => User, (user) => user.reembolsos)
  user: User;

  @ManyToOne(() => Contrato, (contrato) => contrato.reembolsos)
  contrato: Contrato;
}
