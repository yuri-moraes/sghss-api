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
import { PacientesService } from './pacientes.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
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
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { FindPacienteDto } from './dto/find-paciente.dto';

@ApiTags('pacientes')
@Controller('pacientes')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth('JWT-auth')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.PROFISSIONAL)
  @ApiOperation({
    summary: 'Cadastrar novo paciente',
    description:
      'Cadastra um novo paciente no sistema. Disponível para administradores e profissionais de saúde.',
  })
  @ApiCreatedResponse({
    description: 'Paciente cadastrado com sucesso',
    type: CreatePacienteDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados de entrada inválidos ou CPF já cadastrado',
  })
  create(@Body() createPacienteDto: CreatePacienteDto) {
    return this.pacientesService.create(createPacienteDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.PROFISSIONAL)
  @ApiOperation({
    summary: 'Listar pacientes',
    description:
      'Retorna lista paginada de pacientes. Disponível para administradores e profissionais.',
  })
  @ApiQuery({
    name: 'nome',
    required: false,
    description: 'Filtrar por nome do paciente',
    type: 'string',
    example: 'João',
  })
  @ApiQuery({
    name: 'cpf',
    required: false,
    description: 'Buscar por CPF específico',
    type: 'string',
    example: '12345678901',
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
    description: 'Itens por página (máximo 100)',
    type: 'number',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de pacientes retornada com sucesso',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Paciente' },
        },
        total: { type: 'number', example: 150 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 },
        totalPages: { type: 'number', example: 15 },
      },
    },
  })
  findAll(@Query() findPacienteDto: FindPacienteDto) {
    return this.pacientesService.findAll(findPacienteDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar paciente por ID',
    description: 'Retorna um paciente específico pelo seu ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do paciente',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Paciente encontrado',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        nome: { type: 'string', example: 'João Silva Santos' },
        cpf: { type: 'string', example: '12345678901' },
        email: { type: 'string', example: 'joao@email.com' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Paciente não encontrado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: {
          type: 'string',
          example:
            'Paciente com ID "123e4567-e89b-12d3-a456-426614174000" não encontrado.',
        },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.pacientesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.PROFISSIONAL)
  @ApiOperation({
    summary: 'Atualizar paciente',
    description:
      'Atualiza os dados de um paciente. Disponível para administradores e profissionais.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do paciente',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Paciente atualizado com sucesso',
  })
  @ApiNotFoundResponse({
    description: 'Paciente não encontrado',
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos ou CPF já em uso por outro paciente',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePacienteDto: UpdatePacienteDto,
  ) {
    return this.pacientesService.update(id, updatePacienteDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Remover paciente',
    description:
      'Remove um paciente do sistema. Apenas administradores podem remover pacientes.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do paciente',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Paciente removido com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Paciente removido com sucesso' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Paciente não encontrado',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.pacientesService.remove(id);
  }
}
