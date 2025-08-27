import { Exclude } from 'class-transformer';
import {
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import bcrypt from 'bcrypt';

export enum UserRole {
  PACIENTE = 'paciente',
  PROFISSIONAL = 'profissional',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @ApiProperty({
    description: 'ID único do usuário',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva Santos',
  })
  @Column()
  nome: string;

  @ApiProperty({
    description: 'E-mail único do usuário',
    example: 'joao.silva@email.com',
  })
  @Column({ unique: true })
  email: string;

  @ApiHideProperty()
  @Column()
  @Exclude()
  password: string;

  @ApiProperty({
    description: 'Papel do usuário no sistema',
    enum: UserRole,
    example: UserRole.PACIENTE,
  })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PACIENTE,
  })
  role: UserRole;

  @ApiProperty({
    description: 'Data de criação do usuário',
    example: '2025-01-01T00:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização',
    example: '2025-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
