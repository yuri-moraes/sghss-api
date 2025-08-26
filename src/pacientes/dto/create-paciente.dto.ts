/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreatePacienteDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  @Length(11, 11)
  cpf: string;

  @IsEmail()
  email: string;
}
