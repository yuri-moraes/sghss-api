import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({
    summary: 'Realizar login',
    description:
      'Autentica um usuário e retorna um token JWT para acesso aos endpoints protegidos',
  })
  @ApiBody({
    type: SignInDto,
    description: 'Credenciais do usuário',
    examples: {
      exemplo1: {
        summary: 'Login de Paciente',
        description: 'Exemplo de login para um paciente',
        value: {
          email: 'paciente@example.com',
          password: '123456',
        },
      },
      exemplo2: {
        summary: 'Login de Profissional',
        description: 'Exemplo de login para um profissional de saúde',
        value: {
          email: 'medico@hospital.com',
          password: 'senhaSegura123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Token JWT para autenticação',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciais inválidas',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Credenciais inválidas.' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Dados de entrada inválidos',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'email must be an email',
            'password must be longer than or equal to 6 characters',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Obter perfil do usuário',
    description: 'Retorna as informações do usuário autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil do usuário retornado com sucesso',
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', format: 'uuid' },
        username: { type: 'string' },
        role: { type: 'string', enum: ['paciente', 'profissional', 'admin'] },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou expirado',
  })
  getProfile(
    @Request()
    req: {
      user: { userId: string; username: string; role: string };
    },
  ) {
    return req.user;
  }
}
