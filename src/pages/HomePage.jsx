// frontend/src/pages/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="text-center py-20 bg-white rounded-lg shadow-xl p-10">
      <h1 className="text-5xl font-extrabold text-blue-700 mb-6 animate-fade-in-down">
        Bem-vindo ao Meu Projeto Animais!
      </h1>
      <p className="text-xl text-gray-600 mb-8 animate-fade-in-up">
        Gerencie e compartilhe informações sobre a fauna de forma fácil e
        interativa.
      </p>
      <div className="flex justify-center space-x-6 animate-fade-in-up delay-200">
        <Link
          to="/cadastro-animal"
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
        >
          Cadastrar Novo Animal
        </Link>
        <Link
          to="/lista-animais"
          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
        >
          Ver Meus Animais
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
