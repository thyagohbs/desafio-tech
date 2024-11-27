import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Motorista } from "./Motorista";

@Entity("viagem")
export class Viagem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  origem!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  destino!: string;

  @Column({ type: "int", nullable: true })
  distancia!: number;

  @Column({ type: "varchar", length: 100, nullable: true })
  duracao!: string;

  @Column({ type: "double", nullable: true, default: 0 })
  valor!: number;

  @Column({ type: "int", nullable: false })
  cliente_id!: number;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  data!: Date;

  @ManyToOne(() => Motorista, (motorista) => motorista.viagens)
  @JoinColumn({ name: "motorista_id" })
  motorista!: Motorista;
}
