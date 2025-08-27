import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('pacientes')
export class Paciente {
  @ApiProperty({
    description: 'ID único do paciente',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nome completo do paciente',
    example: 'João Silva Santos',
  })
  @Column({ length: 100 })
  nome: string;

  @ApiProperty({
    description: 'CPF único do paciente',
    example: '12345678901',
  })
  @Column({ unique: true, length: 11 })
  cpf: string;

  @ApiProperty({
    description: 'E-mail do paciente',
    example: 'joao.silva@email.com',
  })
  @Column()
  email: string;

  @ApiProperty({
    description: 'Data de criação do registro',
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
}
