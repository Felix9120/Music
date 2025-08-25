import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import SongList from "../componentes/SongList";
import UploadSong from "../componentes/UploadSong";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Home() {
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();

  const artistsRef = useRef(null);
  const genresRef = useRef(null);

  useEffect(() => {
    fetchSongs();
    fetchArtists();
    fetchGenres();
  }, []);

  const fetchSongs = async () => {
    let { data } = await supabase
      .from("songs")
      .select("*, artists(*), genres(*)");
    setSongs(data || []);
  };

  const fetchArtists = async () => {
    let { data } = await supabase.from("artists").select("*");
    setArtists(data || []);
  };

  const fetchGenres = async () => {
    let { data } = await supabase.from("genres").select("*");
    setGenres(data || []);
  };

  // Colores tipo Spotify para géneros
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

  const scrollLeft = (ref) => {
    if (ref.current) ref.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = (ref) => {
    if (ref.current) ref.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="p-2 sm:p-6"> 

      {/* Sección Canciones */}
      <div className="mb-8 sm:mb-10">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Canciones</h2>
        <SongList songs={songs} />
      </div>

      {/* Sección Artistas */}
      <div className="mb-8 sm:mb-10 relative group">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Artistas</h2>
        <div
          ref={artistsRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
        >
          {artists.map((artist) => (
            <div
              key={artist.id}
              className="flex-shrink-0 flex flex-col items-center cursor-pointer"
              onClick={() => navigate(`/artists/${artist.id}`)}
            >
              <div className="w-28 h-28 sm:w-40 sm:h-40 rounded-full overflow-hidden shadow-lg hover:scale-105 transition">
                {artist.image_url ? (
                  <img
                    src={artist.image_url}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-lg font-semibold flex items-center justify-center w-full h-full bg-neutral-700">
                    {artist.name[0]}
                  </span>
                )}
              </div>
              <p className="text-white mt-2 font-medium text-center text-sm sm:text-base">{artist.name}</p>
            </div>
          ))}
        </div>

        {/* Flechas que aparecen solo al pasar el mouse */}
        <button
          onClick={() => scrollLeft(artistsRef)}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/60 p-1 sm:p-2 rounded-full opacity-0 group-hover:opacity-100 transition hidden sm:block"
        >
          <ChevronLeft className="text-white w-4 h-4 sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={() => scrollRight(artistsRef)}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/60 p-1 sm:p-2 rounded-full opacity-0 group-hover:opacity-100 transition hidden sm:block"
        >
          <ChevronRight className="text-white w-4 h-4 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Sección Géneros */}
      <div className="relative group">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Explorar por Géneros</h2>
        <div
          ref={genresRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
        >
          {genres.map((g, index) => (
            <div
              key={g.id}
              onClick={() => navigate(`/genres/${g.id}`)}
              className={`flex-shrink-0 justify-center cursor-pointer rounded-xl p-4 w-32 h-24 sm:p-6 sm:w-48 sm:h-32 flex items-end font-semibold text-base sm:text-lg text-white bg-gradient-to-br ${
                genreColors[index % genreColors.length]
              }`}
            >
              {g.name}
            </div>
          ))}
        </div>

        {/* Flechas que aparecen solo al pasar el mouse */}
        <button
          onClick={() => scrollLeft(genresRef)}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/60 p-1 sm:p-2 rounded-full opacity-0 group-hover:opacity-100 transition hidden sm:block"
        >
          <ChevronLeft className="text-white w-4 h-4 sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={() => scrollRight(genresRef)}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/60 p-1 sm:p-2 rounded-full opacity-0 group-hover:opacity-100 transition hidden sm:block"
        >
          <ChevronRight className="text-white w-4 h-4 sm:w-6 sm:h-6" />
        </button>
      </div>
    </div>
  );
}

export default Home;