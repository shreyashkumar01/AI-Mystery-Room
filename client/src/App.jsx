import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Home from "./pages/Home";
import CreateMystery from "./pages/CreateMystery";
import InvestigationRoom from "./pages/InvestigationRoom";
import Accusation from "./pages/Accusation";
import Results from "./pages/Results";

export function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-detective-bg text-detective-text antialiased font-sans">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateMystery />} />
            <Route path="/investigation/:id" element={<InvestigationRoom />} />
            <Route path="/investigation/:id/accuse" element={<Accusation />} />
            <Route path="/investigation/:id/results" element={<Results />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
