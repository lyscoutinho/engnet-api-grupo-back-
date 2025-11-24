import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReembolsoService } from '../../../service/reembolso.service';
import { ReembolsoController } from '../../../controllers/reembolso.controller';
import { Reembolso } from '../../../entity/reembolso/reembolso.entity';
import { Contrato } from '../../../entity/contrato/contrato.entity';
import { RelatorioService } from '../../../service/relatorio.service';
import { Relatorio } from '../../../entity/relatorios/relatorio.entity';
import { User } from 'src/entity/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reembolso, Contrato, Relatorio, User])],
  controllers: [ReembolsoController],
  providers: [ReembolsoService, RelatorioService],
  exports: [ReembolsoService, RelatorioService],
})
export class ReembolsosModule {}
