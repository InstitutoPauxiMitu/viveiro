// frontend/src/components/Header.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function Header({ session }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-green-500 to-green-700 p-4 shadow-lg rounded-b-lg">
      <div className="container mx-auto flex justify-between items-center flex-wrap">
        <Link
          to="/"
          className="text-white text-xl sm:text-2xl md:text-3xl font-bold rounded-md hover:scale-105 transition-transform duration-200"
        >
          Instituto Pauxi Mitu
        </Link>
        <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6 mt-2 sm:mt-0">
          {session ? (
            <>
              <Link
                to="/cadastro-animal"
                className="text-white text-sm sm:text-lg hover:text-green-200 transition-colors duration-200 rounded-md px-2 py-1 border border-transparent hover:border-green-200"
              >
                Cadastrar Animal
              </Link>
              <Link
                to="/lista-animais"
                className="text-white text-sm sm:text-lg hover:text-green-200 transition-colors duration-200 rounded-md px-2 py-1 border border-transparent hover:border-green-200"
              >
                Meus Animais
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 sm:py-2 sm:px-5 rounded-full shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 text-sm sm:text-base"
              >
                Sair
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 sm:py-2 sm:px-5 rounded-full shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 text-sm sm:text-base"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
