import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindManyOptions, Repository } from 'typeorm';
import { CreateConsultaDto } from './dto/create-consulta.dto';
import { Consulta, ConsultaStatus } from './entities/consulta.entity';
import { UserRole } from '../users/entities/user.entity';
import { FindConsultasDto } from './dto/find-consultas.dto';
import { UpdateConsultaDto } from './dto/update-consulta.dto';

interface AuthenticatedUser {
  userId: string;
  username: string;
  role: UserRole;
}

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

  async findAll(query: FindConsultasDto, user: AuthenticatedUser) {
    const {
      status,
      dataInicio,
      dataFim,
      profissionalId,
      page = 1,
      limit = 10,
    } = query;

    const where: FindManyOptions<Consulta>['where'] = {};

    if (user.role === UserRole.PACIENTE) {
      where.paciente = { id: user.userId };
    }

    if (status) where.status = status;
    if (profissionalId) where.profissional = { id: profissionalId };
    if (dataInicio && dataFim)
      where.dataHora = Between(new Date(dataInicio), new Date(dataFim));

    const [data, total] = await this.consultaRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      relations: ['paciente', 'profissional'],
    });

    return { data, total, page, limit };
  }

  async findOne(id: string, user: AuthenticatedUser): Promise<Consulta> {
    const consulta = await this.consultaRepository.findOne({
      where: { id },
      relations: ['paciente', 'profissional'],
    });

    if (!consulta) {
      throw new NotFoundException(`Consulta com ID "${id}" não encontrada.`);
    }

    if (
      user.role === UserRole.PACIENTE &&
      consulta.paciente.id !== user.userId
    ) {
      throw new ForbiddenException(
        'Você não tem permissão para ver esta consulta.',
      );
    }

    return consulta;
  }

  async update(
    id: string,
    updateConsultaDto: UpdateConsultaDto,
  ): Promise<Consulta> {
    const consulta = await this.consultaRepository.preload({
      id,
      ...updateConsultaDto,
    });

    if (!consulta) {
      throw new NotFoundException(`Consulta com ID "${id}" não encontrada.`);
    }
    return this.consultaRepository.save(consulta);
  }

  async cancel(id: string, user: AuthenticatedUser): Promise<Consulta> {
    const consulta = await this.findOne(id, user);
    consulta.status = ConsultaStatus.CANCELADA;
    return this.consultaRepository.save(consulta);
  }
}
