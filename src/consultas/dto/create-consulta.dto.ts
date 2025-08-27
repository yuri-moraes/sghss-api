import { IsDateString, IsUUID } from 'class-validator';

export class CreateConsultaDto {
  @IsDateString()
  dataHora: Date;

  @IsUUID()
  profissionalId: string;
}
