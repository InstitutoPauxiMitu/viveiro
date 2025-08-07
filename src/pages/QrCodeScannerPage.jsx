// src/pages/QrCodeScannerPage.jsx

import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function QrCodeScannerPage() {
  const navigate = useNavigate();
  const qrRef = useRef(null);
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(false);
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    const config = {
      fps: 10,
      qrbox: 250,
      aspectRatio: 1.0,
    };

    const startScanner = async () => {
      if (!qrRef.current) return;

      const qrCodeScanner = new Html5Qrcode("qr-reader");

      try {
        await qrCodeScanner.start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            try {
              const url = new URL(decodedText);
              const id = url.pathname.split("/").pop();
              if (id) {
                qrCodeScanner.stop();
                navigate(`/animal-details/${id}`);
              }
            } catch {
              setError("QR Code inválido.");
            }
          },
          (errorMessage) => {
            // Silencia erros de leitura
          }
        );
        html5QrCodeRef.current = qrCodeScanner;
        setScanning(true);
      } catch (err) {
        console.error(err);
        setError("Erro ao acessar a câmera.");
      }
    };

    startScanner();

    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().then(() => {
          html5QrCodeRef.current.clear();
        });
      }
    };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-center mb-4">
          Leitor de QR Code
        </h1>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <div
          id="qr-reader"
          ref={qrRef}
          style={{ width: "100%", height: "300px" }}
          className="rounded-lg border border-gray-300"
        ></div>
        {!scanning && (
          <p className="text-center mt-4 text-gray-600">Aguardando câmera...</p>
        )}
      </div>
    </div>
  );
}

export default QrCodeScannerPage;
