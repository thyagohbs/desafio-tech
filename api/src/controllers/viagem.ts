import { Request, Response } from "express";
import { dbconnect } from "../db/connection";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Viagem } from "../models/Viagem";
import { Motorista } from "../models/Motorista";

export const confirmarViagem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { origem, destino, distancia, duracao, cliente_id, motorista } =
      req.body;

    if (!origem || !destino) {
      res
        .status(400)
        .json({ error: "Os campos origem e destino são obrigatórios." });
      return;
    }

    if (origem === destino) {
      res
        .status(400)
        .json({ error: "Os campos origem e destino não podem ser iguais." });
      return;
    }

    if (!motorista) {
      res.status(400).json({ error: "O campo motorista é obrigatório." });
      return;
    }

    if (!cliente_id) {
      res.status(400).json({ error: "O campo cliente é obrigatório." });
      return;
    }

    if (!motorista) {
      res.status(400).json({ error: "O campo motorista é obrigatório." });
      return;
    }

    // Buscar motorista no banco
    const motoristaRepository = dbconnect.getRepository(Motorista);
    const motoristaEncontrado = await motoristaRepository.findOneBy({
      id: motorista,
    });

    if (!motoristaEncontrado) {
      res.status(404).json({ error: "Motorista não encontrado." });
      return;
    }

    // Calcular o valor total da corrida
    const valorTotalCorrida = motoristaEncontrado.taxa * distancia;

    // salva a viagem no banco
    const viagemRepository = dbconnect.getRepository(Viagem);
    const novaViagem = viagemRepository.create({
      origem,
      destino,
      distancia,
      duracao,
      valor: valorTotalCorrida,
      cliente_id,
      motorista: motoristaEncontrado,
      data: new Date(),
    });

    const viagemSalva = await viagemRepository.save(novaViagem);

    // Formatar a data para o padrão brasileiro
    const dataFormatada = format(
      new Date(viagemSalva.data),
      "dd/MM/yyyy HH:mm:ss",
      { locale: ptBR }
    );

    res.status(201).json({
      ...viagemSalva,
      data: dataFormatada,
    });
  } catch (error) {
    console.error("Erro ao salvar a viagem:", error);
    res.status(500).json({ error: "Erro ao salvar a viagem." });
  }
};

export const listarViagensPorCliente = async (req: Request, res: Response) => {
  try {
    const clienteId = req.query.clienteId
      ? parseInt(req.query.clienteId as string)
      : null;
    const motoristaId = req.query.motoristaId
      ? parseInt(req.query.motoristaId as string)
      : null;

    if (!clienteId || clienteId == 0) {
      res.status(400).json({ error: "O ID do cliente é obrigatório." });
      return;
    }

    if (motoristaId) {
      const motoristaRepository = dbconnect.getRepository(Motorista);
      const motoristaEncontrado = await motoristaRepository.findOneBy({
        id: motoristaId,
      });

      if (!motoristaEncontrado) {
        res.status(404).json({ error: "Motorista não encontrado." });
        return;
      }
    }

    const whereClause = motoristaId
      ? { cliente_id: clienteId, motorista: { id: motoristaId } }
      : { cliente_id: clienteId };

    const viagens = await dbconnect.getRepository(Viagem).find({
      where: whereClause,
      relations: ["motorista"],
      order: { id: "DESC" },
    });

    // Formatar a data para o padrão brasileiro
    const viagensFormatadas = viagens.map((viagem) => ({
      ...viagem,
      data: format(
        new Date(viagem.data).getTime() - 3 * 60 * 60 * 1000,
        "dd/MM/yyyy HH:mm:ss",
        {
          locale: ptBR,
        }
      ),
    }));

    res.status(200).json(viagensFormatadas);
  } catch (error) {
    console.error("Erro ao listar viagens:", error);
    res.status(500).json({ error: "Erro ao listar viagens." });
  }
};
