import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function Genre() {
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    supabase
      .from("genres")
      .select("*")
      .then(({ data, error }) => {
        if (error) {
          console.error("Error al cargar géneros:", error);
          alert("No se pudieron cargar los géneros");
        } else {
          setGenres(data);
        }
      })
      .catch((err) => {
        console.error("Error inesperado:", err);
        alert("Ocurrió un error al cargar");
      });
  }, []);

  const handleVerId = (id) => {
    navigate(`/genres/${id}`);
  };

  // Colores tipo Spotify para los géneros
  const genreColors = [
    "from-pink-500 to-yellow-500",
    "from-purple-500 to-indigo-500",
    "from-green-500 to-emerald-700",
    "from-red-500 to-orange-500",
    "from-blue-500 to-cyan-500",
    "from-fuchsia-600 to-pink-700",
    "from-amber-500 to-yellow-600",
    "from-teal-500 to-green-600",
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Explorar por Géneros</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {genres.map((g, index) => (
          <div
            key={g.id}
            onClick={() => handleVerId(g.id)}
            className={`cursor-pointer rounded-xl p-6 h-32 flex items-end font-semibold text-lg text-white bg-gradient-to-br ${
              genreColors[index % genreColors.length]
            }`}
          >
            {g.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Genre;
