import dotenv from "dotenv";

import { Request, Response } from "express";
import axios from "axios";

// Carregar as variáveis do arquivo .env
dotenv.config();

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_API_KEY;


if (!GOOGLE_MAPS_API_KEY) {
  console.error("GOOGLE_API_KEY não foi definida.");
  process.exit(1);
}

export const calcularRota = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { origem, destino, travelMode } = req.body;

  if (!origem || !destino) {
    res
      .status(400)
      .json({ error: "Os campos 'origem' e 'destino' são obrigatórios." });
    return;
  }

  try {
    const response = await axios.post(
      `https://routes.googleapis.com/directions/v2:computeRoutes`,
      {
        origin: { address: origem },
        destination: { address: destino },
        travelMode: "DRIVE",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
          "X-Goog-FieldMask":
            "routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline",
        },
      }
    );

    res.status(200).json({
      rota: response.data.routes[0],
      key: GOOGLE_MAPS_API_KEY,
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao calcular a rota." });
  }
};
