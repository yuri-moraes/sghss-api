import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva Santos',
    minLength: 2,
    maxLength: 100,
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  nome: string;

  @ApiProperty({
    description: 'E-mail único do usuário',
    example: 'joao.silva@email.com',
    format: 'email',
    uniqueItems: true,
  })
  @IsEmail({}, { message: 'E-mail deve ter um formato válido' })
  email: string;

  @ApiProperty({
    description:
      'Senha do usuário (mínimo 6 caracteres, deve conter ao menos uma letra e um número)',
    example: 'minhaSenh@123',
    minLength: 6,
    format: 'password',
  })
  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)/, {
    message: 'Senha deve conter pelo menos uma letra e um número',
  })
  password: string;

  @ApiProperty({
    description: 'Papel do usuário no sistema',
    enum: UserRole,
    example: UserRole.PACIENTE,
    enumName: 'UserRole',
  })
  @IsEnum(UserRole, { message: 'Role deve ser um valor válido' })
  role: UserRole;
}
