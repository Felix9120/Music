import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, Heart, Music, Disc, Menu, X } from "lucide-react";
import UploadSong from "./UploadSong";

function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Botón de menú para móviles */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 p-2 text-white bg-zinc-950 rounded-md sm:hidden"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Menú lateral */}
      <div 
        className={`
          fixed 
          top-0 
          left-0 
          h-full 
          w-60 
          bg-zinc-950 
          p-6 
          flex 
          flex-col 
          z-40 
          transition-transform 
          ease-in-out 
          duration-300
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          sm:translate-x-0 
          sm:relative 
          sm:flex
        `}
      >
        <h1 className="text-2xl font-bold mb-8 text-white">Music_Local 🎧</h1>

        {/* Este es el único contenedor que ahora tiene scroll */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-neutral-900">
          <nav className="flex flex-col space-y-4">
            <NavLink
              to="/"
              className="flex items-center space-x-3 text-gray-400 hover:text-white transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home size={20} /> <span>Inicio</span>
            </NavLink>
            <NavLink
              to="/artist"
              className="flex items-center space-x-3 text-gray-400 hover:text-white transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Music size={20} /> <span>Artistas</span>
            </NavLink>
            <NavLink
              to="/genre"
              className="flex items-center space-x-3 text-gray-400 hover:text-white transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Disc size={20} /> <span>Géneros</span>
            </NavLink>
            <NavLink
              to="/favorites"
              className="flex items-center space-x-3 text-gray-400 hover:text-white transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Heart size={20} /> <span>Favoritos</span>
            </NavLink>
            <NavLink
              to="/songs"
              className="flex items-center space-x-3 text-gray-400 hover:text-white transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Music size={20} /> <span>Canciones</span>
            </NavLink>
          </nav> 
        
          {/* El componente de subida de canciones ahora está dentro del contenedor de scroll */}
          <div className="pt-6">
            <UploadSong />
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;