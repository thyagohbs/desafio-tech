import express from "express";
import { getMotoristasDisponiveis } from "../controllers/motorista";
import {
  confirmarViagem,
  listarViagensPorCliente,
} from "../controllers/viagem";
import { calcularRota } from "../utils/util";

const router = express.Router();

router.post("/motoristas", getMotoristasDisponiveis);

router.post("/viagens/confirmar", confirmarViagem);

router.get("/cliente/:clienteId", listarViagensPorCliente);

router.post("/rota", calcularRota);

export default router;
