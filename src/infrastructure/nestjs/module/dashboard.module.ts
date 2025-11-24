import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from '../../../controllers/dashboard.controller';
import { DashboardService } from '../../../service/dashboard.service';
import { Contrato } from '../../../entity/contrato/contrato.entity';
import { Reembolso } from '../../../entity/reembolso/reembolso.entity';
import { User } from '../../../entity/user/user.entity';

@Module({
  imports: [
    // Disponibiliza os repositórios necessários para o DashboardService calcular os totais
    TypeOrmModule.forFeature([Contrato, Reembolso, User]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}