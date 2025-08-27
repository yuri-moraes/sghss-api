import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Criar novo usuário',
    description:
      'Cria um novo usuário no sistema. Apenas administradores podem criar usuários.',
  })
  @ApiCreatedResponse({
    description: 'Usuário criado com sucesso',
    type: CreateUserDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados de entrada inválidos',
  })
  @ApiConflictResponse({
    description: 'E-mail já está em uso',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.PROFISSIONAL)
  @ApiOperation({
    summary: 'Listar usuários',
    description:
      'Retorna lista paginada de usuários. Disponível para administradores e profissionais.',
  })
  @ApiQuery({
    name: 'role',
    required: false,
    description: 'Filtrar por role do usuário',
    enum: UserRole,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número da página',
    type: 'number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Itens por página',
    type: 'number',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/User' },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  findAll(
    @Query('role') role?: UserRole,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.usersService.findAll(role, page, limit);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar usuário por ID',
    description: 'Retorna um usuário específico pelo seu ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do usuário',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado',
    type: CreateUserDto,
  })
  @ApiNotFoundResponse({
    description: 'Usuário não encontrado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Usuário não encontrado' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Atualizar usuário',
    description:
      'Atualiza os dados de um usuário. Apenas administradores podem atualizar usuários.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do usuário',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso',
  })
  @ApiNotFoundResponse({
    description: 'Usuário não encontrado',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Deletar usuário',
    description:
      'Remove um usuário do sistema. Apenas administradores podem deletar usuários.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do usuário',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário deletado com sucesso',
  })
  @ApiNotFoundResponse({
    description: 'Usuário não encontrado',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}
