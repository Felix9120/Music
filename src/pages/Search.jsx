import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import SongList from "../componentes/SongList";

function Search() {
  const [params] = useSearchParams();
  const query = params.get("q") || "";
  const [songs, setSongs] = useState([]);
  const [localSongs, setLocalSongs] = useState([]); // 👈 canciones subidas manualmente
  const [artists, setArtists] = useState([]);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    if (query.trim() !== "") {
      searchAll(query);
    }
  }, [query]);

  const searchAll = async (q) => {
    // 🔎 Buscar canciones (Spotify + relaciones)
    let { data: songData } = await supabase
      .from("songs")
      .select("*, artists(*), genres(*)")
      .ilike("title", `%${q}%`);

    // 🔎 Buscar canciones locales (subidas con file_url)
    let { data: localSongData } = await supabase
      .from("songs")
      .select("*")
      .ilike("title", `%${q}%`)
      .not("file_url", "is", null); // 👈 solo las que tienen archivo subido

    // 🔎 Buscar artistas
    let { data: artistData } = await supabase
      .from("artists")
      .select("*")
      .ilike("name", `%${q}%`);

    // 🔎 Buscar géneros
    let { data: genreData } = await supabase
      .from("genres")
      .select("*")
      .ilike("name", `%${q}%`);

    setSongs(songData || []);
    setLocalSongs(localSongData || []);
    setArtists(artistData || []);
    setGenres(genreData || []);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Resultados de: "{query}"</h1>

      {/* 🎵 Canciones Spotify */}
      {songs.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Canciones</h2>
          <SongList songs={songs} />
        </div>
      )}

      {/* 🎵 Canciones subidas localmente */}
      {localSongs.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Tus canciones subidas</h2>
          <SongList songs={localSongs} />
        </div>
      )}

      {/* 👩‍🎤 Artistas */}
      {artists.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Artistas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {artists.map((a) => (
              <Link
                to={`/artist/${a.id}`}
                key={a.id}
                className="flex flex-col items-center p-4 bg-neutral-900 rounded-lg hover:bg-neutral-800"
              >
                <img
                  src={a.image_url}
                  alt=""
                  className="w-24 h-24 rounded-full mb-2"
                />
                <p>{a.name}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 🎶 Géneros */}
      {genres.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Géneros</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {genres.map((g) => (
              <Link
                to={`/genre/${g.id}`}
                key={g.id}
                className="p-4 bg-neutral-900 rounded-lg hover:bg-neutral-800 text-center"
              >
                {g.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ❌ No hay resultados */}
      {songs.length === 0 &&
        localSongs.length === 0 &&
        artists.length === 0 &&
        genres.length === 0 && (
          <p className="text-gray-400">No se encontraron resultados.</p>
        )}
    </div>
  );
}

export default Search;
