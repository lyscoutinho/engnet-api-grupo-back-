import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config'; 
import { AuthController } from '../../../controllers/auth.controllers';
import { AuthServiceImplemantation } from '../../../application/auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../entity/user/user.entity';
import { JwtStrategy } from '../../../application/auth/jwt.strategy';
import { JwtAuthGuard } from '../../../application/auth/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  
    JwtModule.registerAsync({
      imports: [ConfigModule], 
      inject: [ConfigService], 
      global: true,
      useFactory: async (configService: ConfigService) => ({

        secret: configService.get<string>('JWT_SECRET')|| 'segredo_temporario', 
        signOptions: { expiresIn: '1000s' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthServiceImplemantation, JwtStrategy, JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class AuthModule {}