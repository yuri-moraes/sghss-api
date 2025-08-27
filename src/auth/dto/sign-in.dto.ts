import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({
    description: 'E-mail do usuário',
    example: 'usuario@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'E-mail deve ter um formato válido' })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: '123456',
    minLength: 6,
    type: 'string',
    format: 'password',
  })
  @IsString()
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  password: string;
}
