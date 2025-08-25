import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { usePlayer } from "../usePlayer";

function SongList() {
  const { playSong } = usePlayer();
  const [songs, setSongs] = useState([]);

  const fetchSongs = async () => {
    const { data, error } = await supabase.from("songs").select("*");
    if (!error) setSongs(data);
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  return (
    <div>
      {songs.map((s) => (
        <div
          key={s.id}
          onClick={() => playSong(s, songs)}
          className="flex items-center justify-between p-2 sm: hover:bg-emerald-900 rounded cursor-pointer transition-colors"
        >
          <div className="flex items-center">
            <img
              src={s.artwork_url}
              alt=""
              className="w-8 h-8 mr-2 sm:w-10 sm:h-10 sm:mr-4"
            />
            <div>
              <p className="font-bold text-sm sm:text-base">{s.title}</p>
              <p className="text-xs text-gray-400">{s.artist}</p>
              
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SongList;