// Arquivo: frontend/src/pages/QrCodeScannerPage.jsx

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCamera, FaSync, FaKeyboard } from "react-icons/fa";
import QrScanner from "qr-scanner";

function QrCodeScannerPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const scannerRef = useRef(null); // ✅ Novo ref para manter o scanner entre renders
  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryAttempt, setRetryAttempt] = useState(0);

  // ✅ Função que inicia o scanner
  const startScanner = async () => {
    setLoading(true);
    setError(null);
    setCameraActive(false);

    const video = videoRef.current;

    if (!video) {
      setError("Erro: vídeo não encontrado.");
      setLoading(false);
      return;
    }

    try {
      const scanner = new QrScanner(
        video,
        (result) => {
          if (result?.data) {
            console.log("QR Code detectado:", result.data);
            try {
              const url = new URL(result.data);
              const id = url.pathname.split("/").pop();
              if (id) {
                navigate(`/animal-details/${id}`);
              } else {
                setError("QR Code inválido.");
              }
            } catch (e) {
              setError("QR Code inválido.");
            }
            scanner.stop();
          }
        },
        {
          onDecodeError: (err) => {},
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: "environment",
        }
      );

      await scanner.start(); // ✅ Solicita a permissão da câmera aqui
      video.play(); // ✅ Garante que o vídeo seja iniciado
      scannerRef.current = scanner; // ✅ Guarda o scanner para acesso posterior
      setCameraActive(true);
    } catch (err) {
      console.error("Erro ao iniciar o scanner:", err);
      if (err.name === "NotAllowedError" || err.name === "SecurityError") {
        setError("Permissão de câmera negada.");
      } else if (err.name === "NotFoundError") {
        setError("Nenhuma câmera disponível.");
      } else {
        setError("Erro ao acessar a câmera.");
      }
      setCameraActive(false);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Inicia scanner quando componente monta ou retry é clicado
  useEffect(() => {
    if (videoRef.current) {
      startScanner();
    } else {
      const delayStart = setTimeout(() => {
        if (videoRef.current) {
          startScanner();
        } else {
          setError("Erro: elemento de vídeo não disponível.");
          setLoading(false);
        }
      }, 500);
      return () => clearTimeout(delayStart);
    }

    // ✅ Limpa scanner ao desmontar
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current.destroy();
      }
    };
  }, [retryAttempt]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl p-6 relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-extrabold text-blue-800 text-center mb-6 mt-4">
          Leitor de QR Code
        </h1>

        {/* Video scanner */}
        <div
          className={`relative w-full aspect-square rounded-lg overflow-hidden border-4 flex items-center justify-center ${
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
              autoPlay
              muted
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
                : "Aguardando câmera..."}
            </p>
          )}
        </div>

        {/* Botões de ação */}
        <div className="mt-8 flex flex-col items-center space-y-4">
          {!cameraActive && (
            <button
              onClick={() => setRetryAttempt((prev) => prev + 1)}
              className="flex items-center px-6 py-3 font-bold text-lg rounded-lg shadow-lg bg-red-500 text-white hover:bg-red-600 transition-all"
            >
              <FaSync className="mr-3" size={20} /> Tentar Novamente
            </button>
          )}
          {!cameraActive && (
            <button
              onClick={startScanner}
              className="flex items-center px-6 py-3 font-bold text-lg rounded-lg shadow-lg bg-green-500 text-white hover:bg-green-600 transition-all"
            >
              <FaCamera className="mr-3" size={20} /> Ativar Câmera Manualmente
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default QrCodeScannerPage;
