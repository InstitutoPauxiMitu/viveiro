// frontend/src/pages/Animals/AnimalDetailsPage.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { FaArrowLeft, FaEdit, FaTrash } from "react-icons/fa"; // Assumindo que a biblioteca react-icons está instalada

function AnimalDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const { data, error } = await supabase
          .from("animais")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setAnimal(data);
        } else {
          setError("Animal não encontrado.");
        }
      } catch (e) {
        console.error("Erro ao buscar detalhes do animal:", e);
        setError(
          "Erro ao buscar detalhes do animal. Tente novamente mais tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnimal();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-700">
          Carregando detalhes do animal...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-500">
        <p className="text-2xl font-bold">{error}</p>
        <button
          onClick={() => navigate("/lista-animais")}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Voltar para a lista
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-white rounded-xl shadow-2xl animate-fade-in">
      <div className="flex items-center mb-6 pb-4 border-b">
        <button
          onClick={() => navigate("/lista-animais")}
          className="text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Voltar para a lista"
        >
          <FaArrowLeft size={24} />
        </button>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 ml-4">
          {animal.nome_comum}
        </h1>
      </div>

      <div className="grid  gap-8 lg:gap-12">
        {/* Imagem do Animal */}
        <div className="flex justify-center items-start">
          {animal.imagem_url ? (
            <img
              src={animal.imagem_url}
              alt={`Imagem de ${animal.nome_comum}`}
              className="rounded-lg shadow-lg max-h-[500px] w-full object-cover transform hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center bg-gray-200 rounded-lg h-[400px] w-full text-gray-500 text-center p-4">
              Nenhuma imagem do animal disponível.
            </div>
          )}
        </div>

        {/* Detalhes do Animal - Lado Direito */}
        <div className="space-y-6">
          {/* Nova estrutura para exibir os detalhes */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              Informações do Animal
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">
                  Nome Científico:
                </span>{" "}
                {animal.nome_cientifico}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Família:</span>{" "}
                {animal.familia}
              </p>

              {/* Seção de Distribuição Geográfica com o mapa */}
              <div>
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-800">
                    Distribuição Geográfica:
                  </span>{" "}
                  {animal.distribuicao_geografica}
                </p>
                {animal.mapa_distribuicao_url && (
                  <div className="mt-4">
                    <img
                      src={animal.mapa_distribuicao_url}
                      alt={`Mapa de distribuição de ${animal.nome_comum}`}
                      className="rounded-lg shadow-lg w-full max-h-[400px] object-contain"
                    />
                  </div>
                )}
              </div>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Habitat:</span>{" "}
                {animal.habitat}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">
                  Alimentação:
                </span>{" "}
                {animal.alimentacao}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">
                  Tamanho/Aparência:
                </span>{" "}
                {animal.tamanho_aparencia}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Reprodução:</span>{" "}
                {animal.reproducao}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">
                  Conservação:
                </span>{" "}
                {animal.conservacao}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">
                  Curiosidades:
                </span>{" "}
                {animal.curiosidades}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-4 mt-8 justify-end"></div>
    </div>
  );
}

export default AnimalDetailsPage;
