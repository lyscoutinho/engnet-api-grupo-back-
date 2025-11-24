import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Contrato } from '../contrato/contrato.entity';
import { StatusClient } from '../enums/status-client';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column({ nullable: true, unique: true })
  cpf: string;

  @Column({ nullable: true, unique: true })
  cnpj: string;

  @Column({ unique: true })
  email: string;

  @Column()
  telefone: string;

  @Column({ nullable: false })
  codigo: string;

  @Column({
    type: 'enum',
    enum: StatusClient,
    default: StatusClient.NOVO,
  })
  status: StatusClient;

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;

  // (1,n) -> Contratos - Um cliente pode ter vários contratos
  @OneToMany(() => Contrato, (contrato) => contrato.cliente, {
    cascade: true,
  })
  contratos: Contrato[];
}
