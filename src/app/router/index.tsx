import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "@/pages/login";
import { GamePage } from "@/pages/game";
import { HistoryPage } from "@/pages/history";
import { MatchPage } from "@/pages/match";

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/game" element={<GamePage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/history/:id" element={<MatchPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </BrowserRouter>
);
