// Arquivo: frontend/src/pages/QrCodeScannerPage.jsx

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCamera, FaSync, FaKeyboard } from "react-icons/fa"; // Adicionado FaKeyboard para o input manual
import QrScanner from "qr-scanner"; // Assumindo que a biblioteca 'qr-scanner' está instalada e pode ser importada

function QrCodeScannerPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [scanner, setScanner] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(false); // ⬅️ Mudado: scanner agora inicia sob demanda
  const [error, setError] = useState(null);
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [manualId, setManualId] = useState(""); // ⬅️ Campo de entrada manual do ID

  // Função para iniciar o scanner de QR Code — chamada somente via clique do usuário
  const startScanner = async () => {
    setLoading(true);
    setError(null);
    setCameraActive(false);

    if (!videoRef.current) {
      setError("Elemento de vídeo não encontrado.");
      setLoading(false);
      return;
    }

    try {
      const qrScanner = new QrScanner(
        videoRef.current,
        (result) => {
          if (result.data) {
            console.log("QR Code detectado:", result.data);
            const url = new URL(result.data);
            const pathSegments = url.pathname.split("/");
            const animalId = pathSegments[pathSegments.length - 1];

            if (animalId) {
              navigate(`/animal-details/${animalId}`);
            } else {
              setError("QR Code inválido: ID do animal não encontrado.");
            }
            qrScanner.stop();
          }
        },
        {
          onDecodeError: (err) => {
            // silencioso
          },
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: "environment",
        }
      );

      await qrScanner.start();
      videoRef.current.play();
      setScanner(qrScanner);
      setCameraActive(true);
    } catch (err) {
      console.error("Erro ao iniciar o scanner:", err);
      if (err.name === "NotAllowedError" || err.name === "SecurityError") {
        setError("Permissão de acesso à câmera negada.");
      } else if (err.name === "NotFoundError") {
        setError("Nenhuma câmera encontrada.");
      } else if (err.name === "OverconstrainedError") {
        setError("Não foi possível encontrar uma câmera adequada.");
      } else {
        setError("Erro desconhecido ao iniciar a câmera.");
      }
      setCameraActive(false);
    } finally {
      setLoading(false);
    }
  };

  // ⬇️ Alterado: removido o startScanner automático para não bloquear o mobile
  useEffect(() => {
    // Somente cuida da limpeza ao desmontar
    return () => {
      if (scanner) {
        scanner.stop();
        scanner.destroy();
      }
    };
  }, [scanner]);

  const handleManualSubmit = () => {
    if (manualId) {
      navigate(`/animal-details/${manualId}`);
    } else {
      setError("Por favor, digite um ID de animal válido.");
    }
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
        <div
          className={`relative w-full aspect-square rounded-lg overflow-hidden border-4 flex items-center justify-center transition-colors duration-300 ${
            error ? "border-red-500" : "border-gray-400 border-dashed"
          }`}
        >
          {loading && !error && (
            <div className="text-lg text-gray-600 animate-pulse">
              Iniciando câmera...
            </div>
          )}
          {error && (
            <div className="text-lg text-red-500 text-center p-4">{error}</div>
          )}
          {cameraActive && !error && (
            <video
              ref={videoRef}
              autoPlay // ⬅️ Necessário para mobile
              playsInline // ⬅️ Necessário para iOS
              muted // ⬅️ Sem áudio para permitir autoplay
              className="w-full h-full object-cover absolute top-0 left-0"
            />
          )}
        </div>

        <div className="mt-6 text-center">
          {cameraActive ? (
            <p className="text-gray-600">Aponte a câmera para um QR Code.</p>
          ) : (
            <p className="text-gray-600">
              {error
                ? "Não foi possível iniciar o leitor."
                : "Aguardando ativação da câmera..."}
            </p>
          )}
        </div>

        {/* Botões e entrada manual */}
        <div className="mt-8 flex flex-col items-center space-y-4">
          {/* Botão Tentar Novamente */}
          {!cameraActive && (
            <button
              onClick={() => setRetryAttempt((prev) => prev + 1)}
              className="flex items-center px-6 py-3 font-bold text-lg rounded-lg shadow-lg bg-red-500 text-white hover:bg-red-600 transition-all transform hover:scale-105"
            >
              <FaSync className="mr-3" size={20} /> Tentar Novamente
            </button>
          )}

          {/* ✅ Botão para ativar a câmera manualmente */}
          {!cameraActive && (
            <button
              onClick={startScanner}
              className="flex items-center px-6 py-3 font-bold text-lg rounded-lg shadow-lg bg-green-500 text-white hover:bg-green-600 transition-all transform hover:scale-105"
            >
              <FaCamera className="mr-3" size={20} /> Ativar Câmera Manualmente
            </button>
          )}

          {/* Entrada manual do ID */}
          <div className="w-full">
            <p className="text-center text-gray-600 mb-2">
              Ou digite o ID do animal manualmente:
            </p>
            <div className="flex space-x-2">
              <input
                type="text"
                value={manualId}
                onChange={(e) => setManualId(e.target.value)}
                placeholder="ID do Animal"
                className="flex-grow px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg transition-all duration-200"
              />
              <button
                onClick={handleManualSubmit}
                className="flex-shrink-0 px-4 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <FaKeyboard className="mr-2" size={20} /> Ir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QrCodeScannerPage;
