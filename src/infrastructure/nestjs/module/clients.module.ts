import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientService } from '../../../service/client.service';
import { ClientController } from '../../../controllers/client.controller';
import { Cliente } from '../../../entity/cliente/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente])],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService],
})
export class ClientsModule {}
