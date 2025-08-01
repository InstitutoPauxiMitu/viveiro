// Arquivo: src/App.jsx
// Este é o componente principal da sua aplicação com roteamento refatorado.

import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { supabase } from "./supabaseClient";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/Auth/LoginPage";
import AnimalFormPage from "./pages/Animals/AnimalFormPage";
import AnimalListPage from "./pages/Animals/AnimalListPage";
import AnimalDetailsPage from "./pages/Animals/AnimalDetailsPage";
import Account from "./pages/Account";

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Listener para mudanças de estado de autenticação
    const handleAuthChange = (_event, newSession) => {
      setSession(newSession);
      setLoading(false);
    };

    // Adiciona o listener
    const { data: authListener } =
      supabase.auth.onAuthStateChange(handleAuthChange);

    // Obtém a sessão atual ao carregar a página
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Função de limpeza do listener
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Exibe uma tela de carregamento enquanto a sessão é verificada
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Carregando...</p>
      </div>
    );
  }

  // Define a URL de redirecionamento após o login
  const from = location.state?.from?.pathname || "/";

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      {session && <Header session={session} />}
      <main className="container mx-auto p-4 sm:p-8 flex-grow">
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/animal-details/:id" element={<AnimalDetailsPage />} />
          <Route path="/lista-animais" element={<AnimalListPage />} />

          {/* Rotas Protegidas - Acessíveis apenas com sessão ativa */}
          {/* Cada rota protegida agora verifica se há uma sessão. */}
          {/* Se houver, renderiza o componente. Se não, redireciona para o login. */}
          <Route
            path="/"
            element={session ? <HomePage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/account"
            element={session ? <Account /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/cadastro-animal"
            element={
              session ? <AnimalFormPage /> : <Navigate to="/login" replace />
            }
          />

          {/* Rota de fallback para páginas não encontradas */}
          <Route
            path="*"
            element={
              <p className="text-center text-xl font-bold mt-20">
                404 - Página não encontrada
              </p>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
