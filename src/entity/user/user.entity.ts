import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { DiretoriaEnum } from '../enums/diretoria';
import { Contrato } from '../contrato/contrato.entity';
import { Reembolso } from '../reembolso/reembolso.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column({ unique: true })
  email: string;

  @Column()
  senha: string;

  @Column({ default: true })
  ativo: boolean;

  @Column({ type: 'enum', enum: DiretoriaEnum })
  cargo: DiretoriaEnum;

  // (1, n) -> contratos
  @OneToMany(() => Contrato, (contrato) => contrato.membro)
  contratos: Contrato[];

  // (1, n) -> reembolsos
  @OneToMany(() => Reembolso, (reembolso) => reembolso.user)
  reembolsos: Reembolso[];
}
