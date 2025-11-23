import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Contrato } from '../contrato/contrato.entity';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column({ nullable: true })
  cpf: string;

  @Column({ nullable: true })
  cnpj: string;

  @Column()
  email: string;

  @Column()
  telefone: string;

  @Column({ nullable: false})
  codigo: string;


  @OneToMany(() => Contrato, (contrato) => contrato.cliente)
  contratos: Contrato[];
}
