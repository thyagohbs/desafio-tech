import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../types/api/api";
import ErrorMensagem from "../components/ErrorMensagem";

interface RotaResponse {
  rota: {
    duration: string;
    distanceMeters: number;
    polyline: {
      encodedPolyline: string;
    };
  };
  key: string;
}

const SolicitarViagem = () => {
  const [clienteId, setClienteId] = useState("");
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const calcularRota = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!clienteId && clienteId == "0" || !origem || !destino) {
      setError("Todos os campos são obrigatórios.");
      return;
    }

    if (clienteId == "0") {
      setError("O campo ID do cliente não pode ser 0(zero)!");
      return;
    }

    if (origem === destino) {
      setError("Origem e destino não podem ser iguais.");
      return;
    }

    setIsLoading(true); 

    try {
      const response = await api.post<RotaResponse>("/rota", {
        clienteId: parseInt(clienteId),
        origem,
        destino,
        travelMode: "DRIVE", 
      });

      setIsLoading(false); 

      navigate("/opcoes-viagem", {
        state: {
          clienteId: parseInt(clienteId),
          origem,
          destino,
          duracao: response.data.rota.duration.replace("s", ""), // Retirando o "s"
          distancia: response.data.rota.distanceMeters / 1000, // Transformando em KM
          rota: response.data.rota.polyline.encodedPolyline,
          key: response.data.key,
        },
      });
    } catch {
      setIsLoading(false); 
      setError("Erro ao calcular a rota. Por favor, tente novamente.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h1>Solicitação de Viagem</h1>
      
      {isLoading && (
        <div style={{ marginBottom: "20px" }}>
          <p>Carregando...</p> 
        </div>
      )}

      <form onSubmit={calcularRota}>
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
            <strong>Endereço de Origem:</strong>
          </label>
          <input
            type="text"
            value={origem}
            onChange={(e) => setOrigem(e.target.value)}
            placeholder="Informe o endereço de origem"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>
            <strong>Endereço de Destino:</strong>
          </label>
          <input
            type="text"
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
            placeholder="Informe o endereço de destino"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: isLoading ? "#aaa" : "#007BFF", 
            color: "#FFF",
            border: "none",
            borderRadius: "5px",
            cursor: isLoading ? "not-allowed" : "pointer", 
          }}
          disabled={isLoading} 
        >
          Calcular Rota
        </button>
      </form>

      <ErrorMensagem mensagem={error} />
    </div>
  );
};

export default SolicitarViagem;
