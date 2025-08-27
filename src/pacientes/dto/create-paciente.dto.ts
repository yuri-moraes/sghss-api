import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePacienteDto {
  @ApiProperty({
    description: 'Nome completo do paciente',
    example: 'João Silva Santos',
    minLength: 2,
    maxLength: 100,
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @Length(2, 100, { message: 'Nome deve ter entre 2 e 100 caracteres' })
  nome: string;

  @ApiProperty({
    description: 'CPF do paciente (apenas números)',
    example: '12345678901',
    pattern: '^[0-9]{11}$',
    minLength: 11,
    maxLength: 11,
  })
  @IsString({ message: 'CPF deve ser uma string' })
  @IsNotEmpty({ message: 'CPF é obrigatório' })
  @Length(11, 11, { message: 'CPF deve ter exatamente 11 dígitos' })
  @Matches(/^[0-9]{11}$/, { message: 'CPF deve conter apenas números' })
  cpf: string;

  @ApiProperty({
    description: 'E-mail do paciente',
    example: 'joao.silva@email.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'E-mail deve ter um formato válido' })
  email: string;
}
