import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SolicitarViagem from "../pages/SolicitarViagem";
import OpcoesViagem from "../pages/OpcoesViagem";
import HistoricoViagens from "../pages/HistoricoViagens";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SolicitarViagem />} />
        <Route path="/opcoes-viagem" element={<OpcoesViagem />} />
        <Route path="/historico" element={<HistoricoViagens />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
