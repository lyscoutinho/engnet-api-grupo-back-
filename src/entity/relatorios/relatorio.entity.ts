import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('relatorios')
export class Relatorio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  dataGeracao: Date;
}
