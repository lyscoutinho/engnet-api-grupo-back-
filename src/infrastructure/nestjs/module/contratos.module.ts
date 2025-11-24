import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContratoService } from '../../../service/contrato.service';
import { ContratoController } from '../../../controllers/contrato.controller';
import { Contrato } from '../../../entity/contrato/contrato.entity';
import { Cliente } from '../../../entity/cliente/client.entity';
import { User } from '../../../entity/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contrato, Cliente, User])],
  controllers: [ContratoController],
  providers: [ContratoService],
  exports: [ContratoService],
})
export class ContratosModule {}
