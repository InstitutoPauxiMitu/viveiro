// src/App.jsx
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

// O componente App principal, que lida com a autenticação e roteamento
function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleAuthChange = (_event, newSession) => {
      setSession(newSession);
      setLoading(false);
    };

    // Define as rotas que podem ser acessadas sem autenticação
    const publicPaths = ["/login", "/animal-details"];
    const isPublicPath = publicPaths.some((path) =>
      location.pathname.startsWith(path)
    );

    // Configura o listener para mudanças na autenticação
    const { data: authListener } =
      supabase.auth.onAuthStateChange(handleAuthChange);

    // Obtém a sessão inicial do usuário
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);

      // Se não houver sessão e o usuário não estiver em uma rota pública, redireciona para o login
      if (!session && !isPublicPath) {
        navigate("/login");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, location]);

  // Exibe um estado de carregamento enquanto a autenticação é verificada
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      {/* O Header só será renderizado se houver uma sessão ativa */}
      {session && <Header session={session} />}
      <main className="container mx-auto p-4 sm:p-8 flex-grow">
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/animal-details/:id" element={<AnimalDetailsPage />} />

          {/* Rotas protegidas (só acessíveis se houver uma sessão) */}
          {session ? (
            <>
              <Route path="/" element={<HomePage />} />
              <Route path="/account" element={<Account />} />
              <Route path="/lista-animais" element={<AnimalListPage />} />
              <Route path="/cadastro-animal" element={<AnimalFormPage />} />
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
            // Redireciona para o login se a rota não for pública e não houver sessão
            <Route path="*" element={<LoginPage />} />
          )}
        </Routes>
      </main>
    </div>
  );
}

export default App;
