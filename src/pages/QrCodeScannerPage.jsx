// Arquivo: frontend/src/pages/QrCodeScannerPage.jsx

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCamera, FaSync } from "react-icons/fa";
import QrScanner from "qr-scanner"; // Assumindo que a biblioteca 'qr-scanner' está instalada e pode ser importada

function QrCodeScannerPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [scanner, setScanner] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryAttempt, setRetryAttempt] = useState(0);

  // Função para iniciar o scanner de QR Code
  const startScanner = async () => {
    setLoading(true);
    setError(null); // Limpa o erro anterior
    setCameraActive(false);

    if (!videoRef.current) {
      setError(
        "Elemento de vídeo não encontrado. Verifique a renderização do componente."
      );
      setLoading(false);
      return;
    }

    try {
      // Tenta iniciar a câmera e o scanner
      const qrScanner = new QrScanner(
        videoRef.current,
        (result) => {
          // Quando um QR Code é lido, esta função é chamada
          if (result.data) {
            console.log("QR Code detectado:", result.data);
            // Navega para a URL contida no QR Code
            window.location.href = result.data;
            qrScanner.stop(); // Para o scanner após a leitura
          }
        },
        {
          onDecodeError: (err) => {
            // Ignora erros de decodificação para não poluir o console
            // console.error("Erro ao decodificar QR Code:", err);
          },
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: "environment", // Prefere a câmera traseira
        }
      );

      // Inicia o scanner
      await qrScanner.start();
      videoRef.current.play(); // Garante que o vídeo comece a tocar
      setScanner(qrScanner);
      setCameraActive(true);
    } catch (err) {
      console.error("Erro ao iniciar o scanner:", err);
      if (err.name === "NotAllowedError" || err.name === "SecurityError") {
        setError(
          "Permissão de acesso à câmera negada. Por favor, habilite a câmera nas configurações do seu navegador e tente novamente."
        );
      } else if (err.name === "NotFoundError") {
        setError(
          "Nenhuma câmera encontrada no dispositivo. Verifique se o dispositivo possui uma câmera ou se ela está em uso por outro aplicativo."
        );
      } else if (err.name === "OverconstrainedError") {
        setError(
          "Não foi possível encontrar uma câmera que atenda aos requisitos (ex: câmera traseira). Tente novamente."
        );
      } else {
        setError("Erro desconhecido ao iniciar a câmera. Tente novamente.");
      }
      setCameraActive(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    startScanner();

    // Função de limpeza para parar o scanner quando o componente for desmontado
    return () => {
      if (scanner) {
        scanner.stop();
        scanner.destroy(); // Libera os recursos da biblioteca
      }
    };
  }, [retryAttempt]); // Reinicia o scanner se o usuário clicar em "Tentar Novamente"

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

        {/* Área de exibição da câmera com feedback visual */}
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
              playsInline
              className="w-full h-full object-cover absolute top-0 left-0"
            />
          )}
        </div>

        {/* Mensagem de status */}
        <div className="mt-6 text-center">
          {cameraActive ? (
            <p className="text-gray-600">Aponte a câmera para um QR Code.</p>
          ) : (
            <p className="text-gray-600">
              {error
                ? "Não foi possível iniciar o leitor."
                : "Aguardando câmera..."}
            </p>
          )}
        </div>

        {/* Botão de Tentar Novamente */}
        <div className="mt-8 flex justify-center space-x-4">
          {!cameraActive && (
            <button
              onClick={() => setRetryAttempt((prev) => prev + 1)}
              className="flex items-center px-6 py-3 font-bold text-lg rounded-lg shadow-lg bg-red-500 text-white hover:bg-red-600 transition-all transform hover:scale-105"
            >
              <FaSync className="mr-3" size={20} /> Tentar Novamente
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default QrCodeScannerPage;
