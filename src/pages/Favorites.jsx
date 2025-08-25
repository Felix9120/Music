import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { usePlayer } from "../usePlayer";
import { Heart } from "lucide-react";

function Favorites() {
  const [favoriteSongs, setFavoriteSongs] = useState([]);
  const { playSong } = usePlayer();

  const fetchFavorites = async () => {
    const { data, error } = await supabase.from("favorites").select("*");
    if (!error) {
      setFavoriteSongs(data);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (songId) => {
    await supabase.from("favorites").delete().eq("song_id", songId);
    fetchFavorites();
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-white">Tus Canciones Favoritas</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {favoriteSongs.length > 0 ? (
          favoriteSongs.map((s) => (
            <div
              key={s.song_id}
              className="
                p-4
                rounded-lg
                bg-neutral-800
                hover:bg-neutral-700
                transition-colors
                cursor-pointer
                relative
                group
              "
            >
              <div onClick={() => playSong(s, favoriteSongs)}>
                {s.artwork_url && (
                  <div
                    className="w-full h-32 rounded-md mb-3 bg-cover bg-center"
                    style={{ backgroundImage: `url(${s.artwork_url})` }}
                  ></div>
                )}
                <div className="flex flex-col items-start">
                  <p className="font-bold text-white truncate w-full">{s.title}</p>
                  <p className="text-sm text-gray-400 truncate w-full">{s.artist}</p>
                </div>
              </div>

              <button
                onClick={() => handleRemoveFavorite(s.song_id)}
                className="absolute top-2 right-2 text-green-500 hover:text-white transition-colors"
                title="Quitar de favoritos"
              >
                <Heart size={20} fill="currentColor" />
              </button>
            </div>
          ))
        ) : (
          <p className="text-neutral-400 col-span-full text-center">No tienes canciones favoritas todavía.</p>
        )}
      </div>
    </div>
  );
}

export default Favorites;