import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { Paciente } from './entities/paciente.entity';

@Injectable()
export class PacientesService {
  constructor(
    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,
  ) {}

  create(createPacienteDto: CreatePacienteDto): Promise<Paciente> {
    const paciente = this.pacienteRepository.create(createPacienteDto);
    return this.pacienteRepository.save(paciente);
  }

  findAll(): Promise<Paciente[]> {
    return this.pacienteRepository.find();
  }

  async findOne(id: string): Promise<Paciente> {
    const paciente = await this.pacienteRepository.findOneBy({ id });
    if (!paciente) {
      throw new NotFoundException(`Paciente com ID "${id}" não encontrado.`);
    }
    return paciente;
  }

  async update(
    id: string,
    updatePacienteDto: UpdatePacienteDto,
  ): Promise<Paciente> {
    const paciente = await this.pacienteRepository.preload({
      id,
      ...updatePacienteDto,
    });
    if (!paciente) {
      throw new NotFoundException(`Paciente com ID "${id}" não encontrado.`);
    }
    return this.pacienteRepository.save(paciente);
  }

  async remove(id: string) {
    const paciente = await this.findOne(id);
    await this.pacienteRepository.remove(paciente);
  }
}
