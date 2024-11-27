import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Viagem } from "./Viagem";

@Entity("motorista")
export class Motorista {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  nome!: string;

  @Column({ type: "longtext", nullable: true })
  descricao!: string;

  @Column({ type: "varchar", length: 200, nullable: true })
  carro!: string;

  @Column({ type: "longtext", nullable: true })
  avaliacao!: string;

  @Column({ type: "double", nullable: true })
  taxa!: number;

  @Column({ type: "int", nullable: true })
  km_minimo!: number;

  @OneToMany(() => Viagem, (viagem) => viagem.motorista)
  viagens!: Viagem[];
}
