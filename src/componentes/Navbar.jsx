import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react"; // ícono de búsqueda estilo Spotify

function Navbar() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(search)}`);
    }
  };

  return (
    <div className="p-4 bg-neutral-900 border-b border-neutral-800">
      <form onSubmit={handleSubmit} className="relative max-w-lg mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
        <input
          type="text"
          placeholder="¿Qué quieres reproducir?"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-full bg-neutral-800 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </form>
    </div>
  );
}

export default Navbar;
