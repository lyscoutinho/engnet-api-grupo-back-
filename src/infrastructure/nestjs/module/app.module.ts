import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from '../config/database.config';
import { AuthModule } from './auth.module';
import { UsersModule } from './users.module';
import { ClientsModule } from './clients.module';
import { ContratosModule } from './contratos.module';
import { ReembolsosModule } from './reembolsos.module';
import { DashboardModule } from './dashboard.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ClientsModule,
    ContratosModule,
    ReembolsosModule,
    DashboardModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        entities: [__dirname + '/../../../entity/**/*.entity.{ts,js}'],
        synchronize: true,
        logging: true,
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
