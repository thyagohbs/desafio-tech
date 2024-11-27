import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../types/api/api";
import ErrorMensagem from "../components/ErrorMensagem";

import { Motorista } from "../types/models/motorista";

const OpcoesViagem = () => {
  const { state } = useLocation();  // Tipagem explícita do estado vindo do useLocation
  const navigate = useNavigate();
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [error, setError] = useState("");
  const [valorTotal, setValorTotal] = useState<number>(0);

  useEffect(() => {
    const fetchMotoristas = async () => {
      try {
        const response = await api.post<Motorista[]>("/motoristas", { distancia: state.distancia });
        setMotoristas(response.data);
      } catch {
        setError("Erro ao carregar motoristas. Tente novamente.");
      }
    };

    fetchMotoristas();
  }, [state.distancia]);

  const confirmarViagem = async (motoristaId: number) => {
    if (valorTotal === null) {
      setError("Por favor, selecione um motorista.");
      return;
    }

    try {
      await api.post("/viagens/confirmar", {
        motorista: motoristaId,
        cliente_id: state.clienteId,
        origem: state.origem,
        destino: state.destino,
        distancia: state.distancia,
        duracao: state.duracao,
        valor: valorTotal,
      });
      navigate("/historico", { state: { distancia: state.distancia } });
    } catch {
      setError("Erro ao confirmar a viagem. Tente novamente.");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
      <h1>Opções de Viagem</h1>
      <ErrorMensagem mensagem={error} />
      <div style={{ marginBottom: "20px" }}>
        <h2>Detalhes da Rota</h2>
        <p><strong>Origem:</strong> {state.origem}</p>
        <p><strong>Destino:</strong> {state.destino}</p>
        <p><strong>Distância:</strong> {state.distancia} KM</p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <img
          src={`https://maps.googleapis.com/maps/api/staticmap?path=enc:${encodeURIComponent(state.rota)}&markers=color:blue|label:A|${encodeURIComponent(state.origem)}&markers=color:red|label:B|${encodeURIComponent(state.destino)}&zoom=12&size=600x300&key=${state.key}`}
          alt="Mapa da Rota"
        />
      </div>

      <h2>Motoristas Disponíveis</h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {motoristas.map((motorista) => (
          <li key={motorista.id} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px" }}>
            <h2>{motorista.nome}</h2>
            <p><strong>Descrição:</strong> {motorista.descricao}</p>
            <p><strong>Veículo:</strong> {motorista.carro}</p>
            <p><strong>Avaliação:</strong> {motorista.avaliacao}</p>
            <p><strong>Taxa:</strong> R$ {(motorista.taxa).toFixed(2)}</p>
            <p><strong>KM Mínimo:</strong> {motorista.km_minimo}</p>
            <p><strong>Valor da viagem:</strong> R$ {motorista.valorCorrida.toFixed(2)}</p>
            <button
              onClick={() => {
                setValorTotal(motorista.valorCorrida);
                confirmarViagem(motorista.id);
              }}
              style={{ padding: "10px", backgroundColor: "#007BFF", color: "#FFF", border: "none", borderRadius: "5px" }}
            >
              Escolher
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OpcoesViagem;
