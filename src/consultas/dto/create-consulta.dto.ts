import { IsDateString, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConsultaDto {
  @ApiProperty({
    description: 'Data e hora da consulta (formato ISO 8601)',
    example: '2025-12-25T14:30:00.000Z',
    format: 'date-time',
  })
  @IsDateString(
    {},
    { message: 'Data e hora devem estar em formato válido (ISO 8601)' },
  )
  dataHora: Date;

  @ApiProperty({
    description: 'ID do profissional que realizará a consulta',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID(4, { message: 'ID do profissional deve ser um UUID válido' })
  profissionalId: string;

  @ApiProperty({
    description: 'Observações sobre a consulta',
    example: 'Paciente com histórico de hipertensão',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  observacoes?: string;
}
