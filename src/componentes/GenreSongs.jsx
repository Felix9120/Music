import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { ChevronLeft } from "lucide-react";
import SongList from "./SongList";

function GenreSongs() {
  const { id } = useParams(); // Obtiene el id del género de la URL
  const [genre, setGenre] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchGenreAndSongs(id);
    }
  }, [id]);

  const fetchGenreAndSongs = async (genreId) => {
    setLoading(true);
    // 1. Obtener el nombre del género
    const { data: genreData, error: genreError } = await supabase
      .from("genres")
      .select("*")
      .eq("id", genreId)
      .single();

    if (genreError) {
      console.error("Error al cargar el género:", genreError);
      setLoading(false);
      return;
    }
    setGenre(genreData);

    // 2. Obtener las canciones asociadas a ese género
    const { data: songsData, error: songsError } = await supabase
      .from("songs")
      .select("*, artists(*)") // Selecciona también los datos del artista
      .eq("genre_id", genreId);

    if (songsError) {
      console.error("Error al cargar las canciones:", songsError);
      setLoading(false);
      return;
    }
    setSongs(songsData);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="text-center mt-10">
        <p>Cargando canciones...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-neutral-900">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        {/* Botón para volver atrás */}
        <ChevronLeft 
          className="text-white hover:text-green-500 cursor-pointer mr-2" 
          onClick={() => window.history.back()} 
          size={32}
        />
        Canciones del género: {genre ? genre.name : "..."}
      </h1>
      
      {songs.length > 0 ? (
        <SongList songs={songs} />
      ) : (
        <p className="text-neutral-400 text-center mt-10">No se encontraron canciones para este género.</p>
      )}
    </div>
  );
}

export default GenreSongs;