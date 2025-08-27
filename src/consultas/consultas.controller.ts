import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ConsultasService } from './consultas.service';
import { CreateConsultaDto } from './dto/create-consulta.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('consultas')
@Controller('consultas')
export class ConsultasController {
  constructor(private readonly consultasService: ConsultasService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Agenda uma nova consulta' })
  create(@Body() createConsultaDto: CreateConsultaDto, @Request() req) {
    const pacienteId = req.user.userId;
    return this.consultasService.create(createConsultaDto, pacienteId);
  }
}
