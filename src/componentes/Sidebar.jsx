// src/componentes/Sidebar.jsx
import React, { useState } from 'react';
import Home from '../assets/Home_Fill_S.png';
import Logo from '../assets/logo.jpeg';
import { Link } from 'react-router-dom';

function Sidebar() {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    // Guardamos búsqueda en localStorage
    localStorage.setItem("search_query", query);

    // Disparamos evento personalizado
    window.dispatchEvent(new Event("search-updated"));
  };

  return (
    <div className="text-white rounded-[10px] w-full flex-col justify-between p-5 bg-black relative">
      <div className="flex gap-2.5 items-center">
        <div className="w-[80px] h-[80px] flex items-center justify-center cursor-pointer">
          <img src={Logo} alt="Logo" />
        </div>

        <div className="bg-[#191919] w-[50px] h-[50px] rounded-[10px] flex items-center justify-center cursor-pointer">
          <Link to={'/Home'}>
            <img src={Home} alt="Home" />
          </Link>
        </div>
      </div>

      {/* 🔹 Buscador */}
      <form onSubmit={handleSearch} className="mt-5">
        <input
          type="text"
          placeholder="Buscar canciones..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 rounded-md bg-[#191919] text-white focus:outline-none"
        />
      </form>
    </div>
  );
}

export default Sidebar;
