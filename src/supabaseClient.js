// Arquivo: src/supabaseClient.js
// Este arquivo lida com a conexão com o Supabase.

// Importe a função createClient do Supabase
import { createClient } from "@supabase/supabase-js";

// Obtenha as variáveis de ambiente do Vercel.
// Use process.env para o ambiente de execução
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Verifique se as variáveis de ambiente estão definidas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Erro: As variáveis de ambiente do Supabase não estão definidas.");
}

// Crie a instância do cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/*
  Para que as variáveis de ambiente sejam reconhecidas em uma aplicação
  React, é preciso prefixá-las com REACT_APP_ (se você estiver usando
  Create React App) ou VITE_ (se estiver usando Vite).
  
  Certifique-se de que no seu Vercel, as variáveis estão definidas
  sem o prefixo:
  
  SUPABASE_URL = <sua-url-do-supabase>
  SUPABASE_ANON_KEY = <sua-anon-key>
*/

// ---

// Arquivo: src/App.jsx
// Este é o componente principal da sua aplicação.

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

// Componente principal
function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Configura um listener para mudanças de autenticação
    const handleAuthChange = (_event, newSession) => {
      setSession(newSession);
      setLoading(false);
    };

    // Rotas públicas que não precisam de autenticação
    const publicPaths = ["/login", "/animal-details", "/lista-animais"];
    const isPublicPath = publicPaths.some((path) =>
      location.pathname.startsWith(path)
    );

    // Adiciona o listener de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(handleAuthChange);

    // Obtém a sessão atual ao iniciar a aplicação
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      
      // Se não há sessão e a rota não é pública, redireciona para o login
      if (!session && !isPublicPath) {
        navigate("/login");
      }
    });

    // Limpa o listener quando o componente é desmontado
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, location]);

  // Mostra "Carregando..." enquanto a autenticação é verificada
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      {/* Renderiza o cabeçalho se houver uma sessão ativa */}
      {session && <Header session={session} />}
      <main className="container mx-auto p-4 sm:p-8 flex-grow">
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/animal-details/:id" element={<AnimalDetailsPage />} />
          <Route path="/lista-animais" element={<AnimalListPage />} />

          {/* Rotas protegidas (acessíveis apenas com sessão) */}
          {session ? (
            <>
              <Route path="/" element={<HomePage />} />
              <Route path="/account" element={<Account />} />
              <Route path="/cadastro-animal" element={<AnimalFormPage />} />
              {/* Rota 404 para URLs não encontradas */}
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