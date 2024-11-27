import { dbconnect } from "../db/connection";
import { Motorista } from "../models/Motorista";

type MotoristaDisponivel = {
  motorista: Motorista;
  valorCorrida: number;
};

export const listarMotoristasDisponiveis = async (
  distancia: number
): Promise<MotoristaDisponivel[]> => {
  if (!distancia || distancia <= 0) {
    throw new Error("A distância deve ser maior que zero.");
  }

  const motoristaRepository = dbconnect.getRepository(Motorista);

  const motoristas = await motoristaRepository
    .createQueryBuilder("motorista")
    .where("motorista.km_minimo <= :distancia", { distancia })
    .getMany();

  const motoristasDisponiveis: MotoristaDisponivel[] = motoristas
    .map((motorista) => ({
      motorista,
      valorCorrida: motorista.taxa * distancia,
    }))
    .sort((a, b) => a.valorCorrida - b.valorCorrida);

  return motoristasDisponiveis;
};
