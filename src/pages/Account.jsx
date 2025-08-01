// frontend/src/pages/Account.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

function Account() {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    async function getProfile() {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("id", user.id)
        .single();

      if (error) {
        console.warn(error);
      } else if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }

      setLoading(false);
    }

    getProfile();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-xl max-w-2xl mx-auto">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6">
        Minha Conta
      </h1>
      {loading ? (
        <p className="text-gray-600">Carregando dados da conta...</p>
      ) : (
        <div className="w-full space-y-4">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-gray-700 font-semibold mb-1">
              Email
            </label>
            <input
              id="email"
              type="text"
              value={supabase.auth.getUser()?.email}
              disabled
              className="p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="username"
              className="text-gray-700 font-semibold mb-1"
            >
              Nome de Usuário
            </label>
            <input
              id="username"
              type="text"
              value={username || ""}
              disabled
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
            />
          </div>
          {/* Você pode adicionar mais campos aqui, como website ou avatar */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Para atualizar suas informações, por favor, edite diretamente no
            Supabase.
          </p>
        </div>
      )}
    </div>
  );
}

export default Account;
