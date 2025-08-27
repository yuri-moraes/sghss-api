import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum ConsultaStatus {
  AGENDADA = 'agendada',
  REALIZADA = 'realizada',
  CANCELADA = 'cancelada',
}

@Entity('consultas')
export class Consulta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  dataHora: Date;

  @Column({
    type: 'enum',
    enum: ConsultaStatus,
    default: ConsultaStatus.AGENDADA,
  })
  status: ConsultaStatus;

  @ManyToOne(() => User)
  paciente: User;

  @ManyToOne(() => User)
  profissional: User;
}