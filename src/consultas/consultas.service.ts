import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateConsultaDto } from './dto/create-consulta.dto';
import { Consulta } from './entities/consulta.entity';

@Injectable()
export class ConsultasService {
  constructor(
    @InjectRepository(Consulta)
    private readonly consultaRepository: Repository<Consulta>,
  ) {}

  async create(
    createConsultaDto: CreateConsultaDto,
    pacienteId: string,
  ): Promise<Consulta> {
    const novaConsulta = this.consultaRepository.create({
      ...createConsultaDto,
      paciente: { id: pacienteId },
      profissional: { id: createConsultaDto.profissionalId },
    });

    return this.consultaRepository.save(novaConsulta);
  }
}