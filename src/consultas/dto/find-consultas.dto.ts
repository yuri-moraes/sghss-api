// src/consultas/dto/find-consultas.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';
import { ConsultaStatus } from '../entities/consulta.entity';

export class FindConsultasDto {
  @ApiPropertyOptional({ enum: ConsultaStatus })
  @IsOptional()
  @IsEnum(ConsultaStatus)
  status?: ConsultaStatus;

  @ApiPropertyOptional({
    description: 'Data inicial (ISO 8601)',
    example: '2025-01-01',
  })
  @IsOptional()
  @IsDateString()
  dataInicio?: string;

  @ApiPropertyOptional({
    description: 'Data final (ISO 8601)',
    example: '2025-12-31',
  })
  @IsOptional()
  @IsDateString()
  dataFim?: string;

  @ApiPropertyOptional({ description: 'ID do profissional' })
  @IsOptional()
  @IsUUID()
  profissionalId?: string;

  @ApiPropertyOptional({ description: 'Número da página', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Itens por página', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}
