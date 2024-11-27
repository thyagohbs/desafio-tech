import { Motorista } from "./motorista";

export interface Viagem {
  id: number;
  data: string;
  motorista: Motorista;
  origem: string;
  destino: string;
  distancia: number;
  duracao: number; // em segundos
  valor: number;
}
