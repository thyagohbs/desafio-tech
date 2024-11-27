import express from "express";
import cors from "cors";
import helmet from "helmet";
import rotas from "./routes/rotas";

const app = express();

// Middlewares globais
app.use(cors());
app.use(helmet());
app.use(express.json());

// Rotas
app.use("/api", rotas);

export default app;
