import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PacientesModule } from './pacientes/pacientes.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConsultasModule } from './consultas/consultas.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT!, 10) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'secret',
      database: process.env.DB_DATABASE || 'sghss',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
    PacientesModule,
    UsersModule,
    AuthModule,
    ConsultasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
