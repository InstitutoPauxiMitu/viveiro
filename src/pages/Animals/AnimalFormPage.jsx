// frontend/src/pages/Animals/AnimalForm.jsx

import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

function AnimalForm() {
  const [nome_comum, setNomeComum] = useState("");
  const [nome_cientifico, setNomeCientifico] = useState("");
  const [familia, setFamilia] = useState("");
  const [distribuicao_geografica, setDistribuicaoGeografica] = useState("");
  const [habitat, setHabitat] = useState("");
  const [alimentacao, setAlimentacao] = useState("");
  const [tamanho_aparencia, setTamanhoAparencia] = useState("");
  const [reproducao, setReproducao] = useState("");
  const [conservacao, setConservacao] = useState("");
  const [curiosidades, setCuriosidades] = useState("");

  const [animalImageFile, setAnimalImageFile] = useState(null);
  const [mapaImageFile, setMapaImageFile] = useState(null);
  const [animalImagePreview, setAnimalImagePreview] = useState(null);
  const [mapaImagePreview, setMapaImagePreview] = useState(null);
  const [currentAnimalImageUrl, setCurrentAnimalImageUrl] = useState("");
  const [currentMapaImageUrl, setCurrentMapaImageUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      const fetchAnimal = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from("animais")
          .select("*")
          .eq("id", id)
          .single();

        if (data) {
          setNomeComum(data.nome_comum || "");
          setNomeCientifico(data.nome_cientifico || "");
          setFamilia(data.familia || "");
          setDistribuicaoGeografica(data.distribuicao_geografica || "");
          setHabitat(data.habitat || "");
          setAlimentacao(data.alimentacao || "");
          setTamanhoAparencia(data.tamanho_aparencia || "");
          setReproducao(data.reproducao || "");
          setConservacao(data.conservacao || "");
          setCuriosidades(data.curiosidades || "");
          setCurrentAnimalImageUrl(data.imagem_url || "");
          setCurrentMapaImageUrl(data.mapa_distribuicao_url || "");
        } else {
          console.error("Erro ao buscar animal para edição:", error);
        }
        setLoading(false);
      };
      fetchAnimal();
    }
  }, [id]);

  const handleAnimalImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAnimalImageFile(file);
      setAnimalImagePreview(URL.createObjectURL(file));
      setCurrentAnimalImageUrl("");
    } else {
      setAnimalImageFile(null);
      setAnimalImagePreview(null);
    }
  };

  const handleMapaImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMapaImageFile(file);
      setMapaImagePreview(URL.createObjectURL(file));
      setCurrentMapaImageUrl("");
    } else {
      setMapaImageFile(null);
      setMapaImagePreview(null);
    }
  };

  const uploadImage = async (file) => {
    if (!file) return null;
    const filePath = `${uuidv4()}-${file.name}`;

    // Corrigido: Usando o nome correto do bucket 'animais.fotos'
    const { error } = await supabase.storage
      .from("animais.fotos")
      .upload(filePath, file);

    if (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      throw error;
    }

    // Corrigido: Usando o nome correto do bucket 'animais.fotos'
    const { data: publicUrlData } = supabase.storage
      .from("animais.fotos")
      .getPublicUrl(filePath);
    return publicUrlData.publicUrl;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      let imagem_url = currentAnimalImageUrl;
      let mapa_distribuicao_url = currentMapaImageUrl;

      if (animalImageFile) {
        imagem_url = await uploadImage(animalImageFile);
      }

      if (mapaImageFile) {
        mapa_distribuicao_url = await uploadImage(mapaImageFile);
      }

      const animalData = {
        nome_comum,
        nome_cientifico,
        familia,
        distribuicao_geografica,
        habitat,
        alimentacao,
        tamanho_aparencia,
        reproducao,
        conservacao,
        curiosidades,
        imagem_url,
        mapa_distribuicao_url,
      };

      if (isEditing) {
        const { error } = await supabase
          .from("animais")
          .update(animalData)
          .eq("id", id);

        if (error) throw error;
        alert("Animal atualizado com sucesso!");
      } else {
        const { error } = await supabase.from("animais").insert([animalData]);

        if (error) throw error;
        alert("Animal criado com sucesso!");
      }
      navigate("/lista-animais");
    } catch (error) {
      console.error("Erro ao salvar animal:", error.message);
      alert("Erro ao salvar animal. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-white rounded-xl shadow-2xl animate-fade-in">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-6 border-b pb-4">
        {isEditing ? "Editar Animal" : "Cadastrar Novo Animal"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Nome Comum"
          value={nome_comum}
          onChange={(e) => setNomeComum(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />
        <input
          type="text"
          placeholder="Nome Científico"
          value={nome_cientifico}
          onChange={(e) => setNomeCientifico(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />
        <input
          type="text"
          placeholder="Família"
          value={familia}
          onChange={(e) => setFamilia(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />
        <textarea
          placeholder="Distribuição Geográfica"
          value={distribuicao_geografica}
          onChange={(e) => setDistribuicaoGeografica(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors h-24"
        />
        <textarea
          placeholder="Habitat"
          value={habitat}
          onChange={(e) => setHabitat(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors h-24"
        />
        <textarea
          placeholder="Alimentação"
          value={alimentacao}
          onChange={(e) => setAlimentacao(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors h-24"
        />
        <textarea
          placeholder="Tamanho e Aparência"
          value={tamanho_aparencia}
          onChange={(e) => setTamanhoAparencia(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors h-24"
        />
        <textarea
          placeholder="Reprodução"
          value={reproducao}
          onChange={(e) => setReproducao(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors h-24"
        />
        <textarea
          placeholder="Conservação"
          value={conservacao}
          onChange={(e) => setConservacao(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors h-24"
        />
        <textarea
          placeholder="Curiosidades"
          value={curiosidades}
          onChange={(e) => setCuriosidades(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors h-24"
        />

        <div className="flex flex-col gap-2">
          <label className="text-gray-700 font-semibold">
            Imagem do Animal:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleAnimalImageChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {(animalImagePreview || currentAnimalImageUrl) && (
            <div className="mt-4 p-4 border border-gray-200 rounded-lg">
              <p className="font-semibold text-gray-600 mb-2">
                Pré-visualização:
              </p>
              <img
                src={animalImagePreview || currentAnimalImageUrl}
                alt="Pré-visualização da imagem do animal"
                className="w-full h-48 object-contain rounded-lg"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-gray-700 font-semibold">
            Mapa de Distribuição:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleMapaImageChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {(mapaImagePreview || currentMapaImageUrl) && (
            <div className="mt-4 p-4 border border-gray-200 rounded-lg">
              <p className="font-semibold text-gray-600 mb-2">
                Pré-visualização:
              </p>
              <img
                src={mapaImagePreview || currentMapaImageUrl}
                alt="Pré-visualização do mapa de distribuição"
                className="w-full h-48 object-contain rounded-lg"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          {loading
            ? "Salvando..."
            : isEditing
            ? "Salvar Alterações"
            : "Cadastrar Animal"}
        </button>
      </form>
    </div>
  );
}

export default AnimalForm;
