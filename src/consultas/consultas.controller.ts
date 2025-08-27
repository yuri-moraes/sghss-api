import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ConsultasService } from './consultas.service';
import { CreateConsultaDto } from './dto/create-consulta.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('consultas')
export class ConsultasController {
  constructor(private readonly consultasService: ConsultasService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createConsultaDto: CreateConsultaDto, @Request() req) {
    const pacienteId = req.user.userId;
    return this.consultasService.create(createConsultaDto, pacienteId);
  }
}