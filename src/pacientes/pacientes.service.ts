/* eslint-disable prettier/prettier */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { Paciente } from './entities/paciente.entity';
import { FindPacienteDto } from './dto/find-paciente.dto'; 

@Injectable()
export class PacientesService {
  constructor(
    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,
  ) {}

  async create(createPacienteDto: CreatePacienteDto): Promise<Paciente> {
    const existingPaciente = await this.pacienteRepository.findOneBy({
      cpf: createPacienteDto.cpf,
    });
    if (existingPaciente) {
      throw new ConflictException('CPF já cadastrado');
    }
    const paciente = this.pacienteRepository.create(createPacienteDto);
    return this.pacienteRepository.save(paciente);
  }

  async findAll(query: FindPacienteDto) {
    const { nome, cpf, page = 1, limit = 10 } = query;
    const where: FindManyOptions<Paciente>['where'] = {};

    if (nome) {
      where.nome = ILike(`%${nome}%`);
    }

    if (cpf) {
      where.cpf = cpf;
    }

    const [data, total] = await this.pacienteRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
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
    if (updatePacienteDto.cpf) {
      const existing = await this.pacienteRepository.findOne({
        where: { cpf: updatePacienteDto.cpf },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('CPF já está em uso por outro paciente.');
      }
    }

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
    return { message: 'Paciente removido com sucesso' };
  }
}