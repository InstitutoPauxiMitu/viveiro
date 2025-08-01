// frontend/src/pages/Auth/LoginPage.jsx
import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setMessage("Login bem-sucedido!");
      navigate("/"); // Redireciona para a página inicial após o login
    } catch (error) {
      setMessage(`Erro ao fazer login: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // A função handleSignUp foi removida, pois não está sendo utilizada no frontend.
  // Se precisar de cadastro pelo frontend no futuro, ela pode ser adicionada novamente.

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-100">
      <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md border border-green-200">
        <h2 className="text-4xl font-extrabold text-center text-black mb-8">
          Acessar Plataforma
        </h2>
        <form className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-4 py-3 border border-green-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-lg transition-all duration-200"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Senha
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-4 py-3 border border-green-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-lg transition-all duration-200"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {message && (
            <p
              className={`text-center text-md font-semibold ${
                message.includes("Erro") ? "text-red-600" : "text-green-600"
              } mt-4`}
            >
              {message}
            </p>
          )}
          {/* Div para o único botão, ocupando toda a largura */}
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-green-200 hover:bg-green-400 font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Carregando..." : "Entrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
