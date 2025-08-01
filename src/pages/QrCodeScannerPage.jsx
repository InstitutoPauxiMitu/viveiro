// Arquivo: frontend/src/pages/QrCodeScannerPage.jsx

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCamera } from "react-icons/fa";

// Componente para a página de Leitura de QR Code
function QrCodeScannerPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [simulatedScanResult, setSimulatedScanResult] = useState(null);

  // Efeito para iniciar/parar a câmera quando o componente é montado/desmontado
  useEffect(() => {
    // Função para iniciar a câmera
    const startCamera = async () => {
      try {
        setLoading(true);
        // Acessa a câmera do usuário
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraActive(true);
        setError(null);
      } catch (err) {
        console.error("Erro ao acessar a câmera:", err);
        setError(
          "Não foi possível acessar a câmera. Por favor, verifique as permissões."
        );
        setCameraActive(false);
      } finally {
        setLoading(false);
      }
    };

    startCamera();

    // Função de limpeza para parar a câmera quando o componente for desmontado
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  // Função que simula a leitura de um QR Code e redireciona
  const handleSimulateScan = () => {
    // Em uma aplicação real, aqui você usaria uma biblioteca
    // como `jsqr` para ler o código do vídeo.
    // Exemplo de URL de QR Code: https://seuapp.com/animal-details/123
    const scannedUrl =
      "https://seuapp.com/animal-details/a5c0b78c-0f9c-4e8a-a75d-f192b1a1c9a6";

    // Extrai o ID da URL
    const parts = scannedUrl.split("/");
    const animalId = parts[parts.length - 1];

    setSimulatedScanResult(animalId);

    // Navega para a página de detalhes do animal correspondente
    setTimeout(() => {
      navigate(`/animal-details/${animalId}`);
    }, 1500); // Simula um pequeno atraso de processamento
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl p-6 relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Voltar"
        >
          <FaArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-extrabold text-blue-800 text-center mb-6 mt-4">
          Leitor de QR Code
        </h1>

        {/* Área de exibição da câmera */}
        <div className="relative w-full aspect-square bg-gray-300 rounded-lg overflow-hidden border-4 border-dashed border-gray-400 flex items-center justify-center">
          {loading && !error && (
            <div className="text-lg text-gray-600">Iniciando câmera...</div>
          )}
          {error && (
            <div className="text-lg text-red-500 text-center p-4">{error}</div>
          )}
          {cameraActive && !error && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover absolute top-0 left-0"
            />
          )}
        </div>

        {/* Feedback visual para o usuário */}
        <div className="mt-6 text-center">
          {simulatedScanResult ? (
            <p className="text-green-600 font-bold text-xl">
              QR Code lido com sucesso! Redirecionando...
            </p>
          ) : (
            <p className="text-gray-600">Aponte a câmera para um QR Code.</p>
          )}
        </div>

        {/* Botão de Simulação de Leitura */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSimulateScan}
            disabled={!cameraActive}
            className={`flex items-center px-6 py-3 font-bold text-lg rounded-lg shadow-lg transition-all transform hover:scale-105 ${
              cameraActive
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
          >
            <FaCamera className="mr-3" size={20} /> Simular Leitura
          </button>
        </div>
      </div>
    </div>
  );
}

export default QrCodeScannerPage;
