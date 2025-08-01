// Arquivo: frontend/src/pages/Animals/ListaAnimais.jsx
// Este componente exibe a lista de animais e agora navega para a rota correta.

import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

function ListaAnimais() {
  const [animais, setAnimais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchAnimais = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("animais")
      .select("*")
      .order("nome_comum", { ascending: true });

    if (error) {
      console.error("Erro ao buscar animais:", error);
      setError("Erro ao carregar a lista de animais.");
      setAnimais([]);
    } else {
      setAnimais(data || []);
      setError(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAnimais();
  }, []);

  // --- Funções de manipulação de ações (Ver, Editar, Excluir) ---

  // CORREÇÃO AQUI: A string de navegação deve ser "/animal-details/:id"
  // para coincidir com a rota em App.jsx.
  const handleVerDetalhes = (id) => {
    navigate(`/animal-details/${id}`);
  };

  const handleEditar = (id) => {
    navigate(`/editar-animal/${id}`);
  };

  const handleExcluir = async (id) => {
    const confirmation = window.confirm(
      "Tem certeza que deseja excluir este animal? Essa ação é irreversível."
    );
    if (!confirmation) {
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("animais").delete().eq("id", id);

    if (error) {
      console.error("Erro ao excluir animal:", error);
      alert("Erro ao excluir animal. Por favor, tente novamente.");
    } else {
      console.log("Animal excluído com sucesso!");
      fetchAnimais(); // Atualiza a lista após a exclusão
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-500 text-center">
        <h2 className="text-2xl font-bold">{error}</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-800 mb-8 text-center">
        Lista de Animais Cadastrados
      </h1>
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence>
          {animais.map((animal) => (
            <motion.div
              key={animal.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col"
            >
              <div className="p-4 flex-grow">
                <img
                  src={
                    animal.imagem_url ||
                    "https://placehold.co/400x300/e2e8f0/6b7280?text=Sem+Imagem"
                  }
                  alt={`Imagem de ${animal.nome_comum}`}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  onError={(e) =>
                    (e.target.src =
                      "https://placehold.co/400x300/e2e8f0/6b7280?text=Imagem+N%C3%A3o+Encontrada")
                  }
                />
                <h2 className="text-xl font-bold text-gray-800 mb-1">
                  {animal.nome_comum}
                </h2>
                <p className="text-sm italic text-gray-500">
                  {animal.nome_cientifico}
                </p>
              </div>

              <div className="p-4 border-t border-gray-200 mt-auto flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  onClick={() => handleVerDetalhes(animal.id)}
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
                >
                  Ver Mais Detalhes
                </button>
                <div className="flex space-x-2 w-full sm:w-auto">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditar(animal.id);
                    }}
                    className="flex-grow px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition-colors duration-300 flex items-center justify-center"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExcluir(animal.id);
                    }}
                    className="flex-grow px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors duration-300 flex items-center justify-center"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {animais.length === 0 && (
        <div className="text-center text-gray-500 mt-10 text-xl">
          Nenhum animal cadastrado ainda.
        </div>
      )}
    </div>
  );
}

export default ListaAnimais;
