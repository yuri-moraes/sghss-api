import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ConsultaStatus } from '../entities/consulta.entity';

export class UpdateConsultaDto {
  @ApiPropertyOptional({ enum: ConsultaStatus })
  @IsOptional()
  @IsEnum(ConsultaStatus)
  status?: ConsultaStatus;

  @ApiPropertyOptional({ description: 'Observações sobre a consulta' })
  @IsOptional()
  @IsString()
  observacoes?: string;
}
