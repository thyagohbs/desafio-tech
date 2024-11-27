import app from "./app";
import { initializeDbConnection } from "./db/createdb/init";

initializeDbConnection();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Bem-vindo a API da aplicação TAXI!");
});
