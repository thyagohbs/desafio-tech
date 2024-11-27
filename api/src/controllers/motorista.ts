import { Request, Response } from "express";
import { listarMotoristasDisponiveis } from "../services/motorista";

export const getMotoristasDisponiveis = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { distancia } = req.body;

    if (!distancia || isNaN(Number(distancia))) {
      res.status(400).json({
        error: "A distância deve ser informada e ser um número válido.",
      });
      return;
    }

    const motoristas = await listarMotoristasDisponiveis(Number(distancia));

    if (motoristas.length === 0) {
      res.status(404).json({ message: "Nenhum motorista disponível." });
      return;
    }

    res.status(200).json(
      motoristas.map(({ motorista, valorCorrida }) => ({
        id: motorista.id,
        nome: motorista.nome,
        descricao: motorista.descricao,
        carro: motorista.carro,
        avaliacao: motorista.avaliacao,
        taxa: motorista.taxa,
        km_minimo: motorista.km_minimo,
        valorCorrida,
      }))
    );
  } catch (error) {
    console.error("Erro ao buscar motoristas disponíveis:", error);
    res
      .status(500)
      .json({ error: "Erro interno ao buscar motoristas disponíveis." });
  }
};
