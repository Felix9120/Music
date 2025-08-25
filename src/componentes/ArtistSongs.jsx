import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { ChevronLeft } from "lucide-react";

function ArtistSongs() {
  const { id } = useParams(); // Obtiene el id del artista de la URL
  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchArtistAndSongs(id);
    }
  }, [id]);

  const fetchArtistAndSongs = async (artistId) => {
    setLoading(true);
    // 1. Obtener los datos del artista
    const { data: artistData, error: artistError } = await supabase
      .from("artists")
      .select("*")
      .eq("id", artistId)
      .single();

    if (artistError) {
      console.error("Error al cargar el artista:", artistError);
      setLoading(false);
      return;
    }
    setArtist(artistData);

    // 2. Obtener las canciones del artista
    const { data: songsData, error: songsError } = await supabase
      .from("songs")
      .select("*, artists(*)") // Selecciona también los datos del artista
      .eq("artist_id", artistId);

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
        <p>Cargando canciones del artista...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-neutral-900">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <ChevronLeft 
          className="text-white hover:text-green-500 cursor-pointer mr-2" 
          onClick={() => window.history.back()} 
          size={32}
        />
        Canciones de {artist ? artist.name : "..."}
      </h1>
      
      {songs.length > 0 ? (
        <SongGrid songs={songs} />
      ) : (
        <p className="text-neutral-400 text-center mt-10">No se encontraron canciones para este artista.</p>
      )}
    </div>
  );
}

export default ArtistSongs;