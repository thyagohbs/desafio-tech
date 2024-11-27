import React, { useState, useEffect } from "react";
import api from "../types/api/api";
import { useLocation } from "react-router-dom";
import { Viagem } from "../types/models/viagem";
import { Motorista } from "../types/models/motorista";
import { converterSegundos } from "../uteis/util";

const Historico = () => {
  const { state } = useLocation();
  const [clienteId, setClienteId] = useState(state?.clienteId || "");
  const [motoristaId, setMotoristaId] = useState("");
  const [historico, setHistorico] = useState<Viagem[]>([]);
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMotoristas, setLoadingMotoristas] = useState(false);

  
  useEffect(() => {
    const fetchMotoristas = async () => {
      setLoadingMotoristas(true);
      try {
        const response = await api.post("/motoristas", {
          distancia: state?.distancia || 0,
        });
        setMotoristas(response.data);
      } catch (err: any) {
        setError(
          err.response?.data?.error || "Erro ao carregar motoristas. Tente novamente."
        );
      } finally {
        setLoadingMotoristas(false);
      }
    };

    fetchMotoristas();
  }, [state?.distancia]);

  const aplicarFiltro = async () => {
    if (!clienteId && !motoristaId) {
      setError("Por favor, informe pelo menos um filtro!");
      return;
    }

    if (clienteId && isNaN(parseInt(clienteId))) {
      setError("O ID do Cliente deve ser um número válido.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(`/cliente/${clienteId}`, {
        params: {
          clienteId: clienteId ? parseInt(clienteId) : undefined,
          motoristaId: motoristaId ? parseInt(motoristaId) : undefined,
        },
      });
      setHistorico(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Erro ao carregar histórico de viagens. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
      <h1>Histórico de Viagens</h1>

      <div style={{ marginBottom: "15px" }}>
        <label>
          <strong>ID do Cliente:</strong>
        </label>
        <input
          type="text"
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
          placeholder="Informe o ID do cliente"
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>
          <strong>Motorista:</strong>
        </label>
        {loadingMotoristas ? (
          <p>Carregando motoristas...</p>
        ) : (
          <select
            value={motoristaId}
            onChange={(e) => setMotoristaId(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          >
            <option value="">Todos</option>
            {motoristas.map((motorista) => (
              <option key={motorista.id} value={motorista.id}>
                {motorista.nome}
              </option>
            ))}
          </select>
        )}
      </div>

      <button
        onClick={aplicarFiltro}
        style={{
          padding: "10px",
          backgroundColor: "#007BFF",
          color: "#FFF",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          width: "100%",
        }}
        disabled={loading}
      >
        {loading ? "Carregando..." : "Aplicar Filtro"}
      </button>

      {error && <div style={{ color: "red", marginTop: "20px" }}>{error}</div>}

      <ul style={{ listStyleType: "none", padding: 0, marginTop: "20px" }}>
        {historico.length === 0 && !loading && !error && (
          <p>Nenhuma viagem encontrada. Tente aplicar um filtro diferente.</p>
        )}
        {historico.map((viagem, index) => (
          <li
            key={index}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
              textAlign: "left",
            }}
          >
            <p>
              <strong>Data e hora:</strong> {viagem.data || "Não informado"}
            </p>
            <p>
              <strong>Nome do Motorista:</strong> {viagem.motorista?.nome || "Não informado"}
            </p>
            <p>
              <strong>Origem:</strong> {viagem.origem || "Não informado"}
            </p>
            <p>
              <strong>Destino:</strong> {viagem.destino || "Não informado"}
            </p>
            <p>
              <strong>Distância:</strong> {viagem.distancia || "Não informado"} km
            </p>
            <p>
              <strong>Tempo de duração:</strong> {converterSegundos(viagem.duracao) || "Não informado"}
            </p>
            <p>
              <strong>Valor:</strong> R$ {viagem.valor ? viagem.valor.toFixed(2) : "Não informado"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Historico;
