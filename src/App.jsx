// Arquivo: src/App.jsx
// IMPORTANTE: Certifique-se de que este arquivo SÓ contenha este código.

import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "./supabaseClient";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/Auth/LoginPage";
import AnimalFormPage from "./pages/Animals/AnimalFormPage";
import AnimalListPage from "./pages/Animals/AnimalListPage";
import AnimalDetailsPage from "./pages/Animals/AnimalDetailsPage";
import Account from "./pages/Account";

// Componente principal da aplicação
function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Listener para mudanças de estado de autenticação
    const handleAuthChange = (_event, newSession) => {
      setSession(newSession);
      setLoading(false);
    };

    // Define as rotas que não precisam de autenticação
    const publicPaths = ["/login", "/animal-details", "/lista-animais"];
    const isPublicPath = publicPaths.some((path) =>
      location.pathname.startsWith(path)
    );

    // Adiciona o listener
    const { data: authListener } =
      supabase.auth.onAuthStateChange(handleAuthChange);

    // Obtém a sessão atual ao carregar a página
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);

      // Se não houver sessão e a rota não for pública, redireciona para o login
      if (!session && !isPublicPath) {
        navigate("/login");
      }
    });

    // Função de limpeza do listener
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, location]);

  // Exibe uma tela de carregamento enquanto a sessão é verificada
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      {/* O cabeçalho é renderizado apenas se o usuário estiver logado */}
      {session && <Header session={session} />}
      <main className="container mx-auto p-4 sm:p-8 flex-grow">
        <Routes>
          {/* Rotas públicas que podem ser acessadas sem login */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/animal-details/:id" element={<AnimalDetailsPage />} />
          <Route path="/lista-animais" element={<AnimalListPage />} />

          {/* Rotas protegidas, que exigem uma sessão ativa */}
          {session ? (
            <>
              <Route path="/" element={<HomePage />} />
              <Route path="/account" element={<Account />} />
              <Route path="/cadastro-animal" element={<AnimalFormPage />} />
              {/* Rota para lidar com páginas não encontradas */}
              <Route
                path="*"
                element={
                  <p className="text-center text-xl font-bold mt-20">
                    404 - Página não encontrada
                  </p>
                }
              />
            </>
          ) : (
            // Redireciona para a página de login se o usuário tentar acessar uma rota protegida sem estar logado
            <Route path="*" element={<LoginPage />} />
          )}
        </Routes>
      </main>
    </div>
  );
}

export default App;
