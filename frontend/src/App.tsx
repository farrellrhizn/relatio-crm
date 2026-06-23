import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<div className="p-10 text-2xl font-bold">Ini Halaman Login</div>} />
        <Route path="/dashboard" element={<div className="p-10 text-2xl font-bold">Ini Halaman Dashboard</div>} />
        
        {/* Redirect dari root ke dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Halaman 404 sederhana */}
        <Route path="*" element={<div className="p-10 text-red-500">404 - Halaman Tidak Ditemukan</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;