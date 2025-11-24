import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from 'typeorm';
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

  // (1, n) -> contratos
  @ManyToMany(() => Contrato, (contrato) => contrato.membros)
  contratos: Contrato[];

  @Column({
    type: 'enum',
    enum: DiretoriaEnum,
    nullable: false,
  })
  diretoria: DiretoriaEnum;

  @OneToMany(()=> Reembolso, (reembolso) => reembolso.solicitante)
  reembolsos: Reembolso[];
}
