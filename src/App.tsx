
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Home from './pages/Home';
import Reader from './pages/Reader';
import './App.css';

// Componente de redirección tipado
const RedirectToLeer = () => {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/leer/${id}`} replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/leer/:edicion_id" element={<Reader />} />
        {/* Redirección para mantener compatibilidad con enlaces antiguos */}
        <Route path="/read/:id" element={<RedirectToLeer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
