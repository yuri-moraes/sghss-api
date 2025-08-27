import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum ConsultaStatus {
  AGENDADA = 'agendada',
  REALIZADA = 'realizada',
  CANCELADA = 'cancelada',
}

@Entity('consultas')
export class Consulta {
  @ApiProperty({
    description: 'ID único da consulta',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Data e hora da consulta',
    example: '2025-12-25T14:30:00.000Z',
    format: 'date-time',
  })
  @Column()
  dataHora: Date;

  @ApiProperty({
    description: 'Status atual da consulta',
    enum: ConsultaStatus,
    example: ConsultaStatus.AGENDADA,
  })
  @Column({
    type: 'enum',
    enum: ConsultaStatus,
    default: ConsultaStatus.AGENDADA,
  })
  status: ConsultaStatus;

  @ApiProperty({
    description: 'Observações sobre a consulta',
    example: 'Paciente com histórico de hipertensão',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  observacoes?: string;

  @ApiProperty({
    description: 'Dados do paciente',
    type: () => User,
  })
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'pacienteId' })
  paciente: User;

  @ApiProperty({
    description: 'Dados do profissional',
    type: () => User,
  })
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'profissionalId' })
  profissional: User;

  @ApiProperty({
    description: 'Data de criação da consulta',
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
