import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { ConsultasService } from './consultas.service';
import { CreateConsultaDto } from './dto/create-consulta.dto';
import { UpdateConsultaDto } from './dto/update-consulta.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { FindConsultasDto } from './dto/find-consultas.dto';

export interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    username: string;
    role: UserRole;
  };
}

@ApiTags('consultas')
@Controller('consultas')
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth('JWT-auth')
export class ConsultasController {
  constructor(private readonly consultasService: ConsultasService) {}

  @Post()
  @Roles(UserRole.PACIENTE)
  @ApiOperation({ summary: 'Agendar nova consulta' })
  @ApiCreatedResponse({ description: 'Consulta agendada com sucesso' })
  create(
    @Body() createConsultaDto: CreateConsultaDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const pacienteId = req.user.userId;
    return this.consultasService.create(createConsultaDto, pacienteId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar consultas' })
  findAll(
    @Query() findConsultasDto: FindConsultasDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.consultasService.findAll(findConsultasDto, req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar consulta por ID' })
  @ApiNotFoundResponse({ description: 'Consulta não encontrada' })
  @ApiForbiddenResponse({ description: 'Acesso negado' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.consultasService.findOne(id, req.user);
  }

  @Patch(':id')
  @Roles(UserRole.PROFISSIONAL, UserRole.ADMIN)
  @ApiOperation({ summary: 'Atualizar consulta' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateConsultaDto: UpdateConsultaDto,
  ) {
    return this.consultasService.update(id, updateConsultaDto);
  }

  @Delete(':id/cancel')
  @Roles(UserRole.ADMIN, UserRole.PACIENTE)
  @ApiOperation({ summary: 'Cancelar consulta' })
  cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.consultasService.cancel(id, req.user);
  }
}
