import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { usePlayer } from "../usePlayer";
import {
  Heart, Pause, Play, SkipBack, SkipForward, Shuffle, Volume2,
} from "lucide-react";

function Player() {
  const { currentSong, isPlaying, togglePlay, next, prev, audioRef } = usePlayer();
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const progressPercent =
      (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setProgress(progressPercent || 0);
  };

  const handleSeek = (e) => {
    if (!audioRef.current) return;
    const newTime = (e.target.value / 100) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (!currentSong) return;
    const checkFavorite = async () => {
        const { data } = await supabase.from("favorites").select("*").eq("song_id", currentSong.id).single();
        setIsFavorite(!!data);
    };
    checkFavorite();
  }, [currentSong]);

  const toggleFavorite = async () => {
    if (!currentSong) return;
    
    if (isFavorite) {
      await supabase.from("favorites").delete().eq("song_id", currentSong.id);
    } 
    else {
      await supabase.from("favorites").insert([
        { 
          song_id: currentSong.id,
          title: currentSong.title,
          artist: currentSong.artist,
          artwork_url: currentSong.artwork_url,
          file_url: currentSong.file_url,
        }
      ]);
    }
    setIsFavorite(!isFavorite);
  };

  const SongInfo = () => (
    <div className="flex items-center">
      {currentSong ? (
        <>
          <img
            src={currentSong.artwork_url}
            className="w-12 h-12 rounded-md shadow-lg mr-3 object-cover"
          />
          <div>
            <p className="font-semibold text-sm truncate w-24 md:w-auto">{currentSong.title}</p>
            <p className="text-xs text-neutral-400 truncate w-24 md:w-auto">{currentSong.artist}</p>
          </div>
        </>
      ) : (
        <>
          <div className="w-12 h-12 bg-neutral-800 rounded-md mr-3 flex items-center justify-center">
            <span className="text-neutral-500 text-xs">🎵</span>
          </div>
          <div>
            <p className="font-semibold text-sm text-neutral-400">Nada en reproducción</p>
            <p className="text-xs text-neutral-600 hidden md:block">Selecciona una canción</p>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="bg-neutral-900 border-t border-neutral-800 px-4 py-3 flex items-center justify-between text-white fixed bottom-0 left-0 right-0 z-50">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={next}
      />

      <div className="w-1/3 flex items-center">
        <SongInfo />
        {currentSong && (
          <button
            onClick={toggleFavorite}
            className="ml-4 hidden md:block"
          >
            <Heart size={22} className={`${isFavorite ? "text-green-500" : "hover:text-green-500"}`} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        )}
      </div>

      <div className="flex flex-col items-center w-full md:w-1/3">
        <div className="flex items-center space-x-3 md:space-x-6">
          <button className="hover:text-green-500 hidden md:block"><Shuffle size={18} /></button>
          <button onClick={prev} className="hover:text-green-500"><SkipBack size={22} /></button>
          <button
            onClick={togglePlay}
            className="bg-white text-black rounded-full p-2 hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button onClick={next} className="hover:text-green-500"><SkipForward size={22} /></button>
          <button className="hover:text-green-500 hidden md:block"><Shuffle size={18} /></button>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="w-full mt-2 accent-green-500 cursor-pointer hidden md:block"
        />
      </div>

      <div className="flex items-center space-x-2 md:space-x-4 w-1/3 justify-end">
        {currentSong && (
          <button
            onClick={toggleFavorite}
            className="block md:hidden"
          >
            <Heart size={22} className={`${isFavorite ? "text-green-500" : "hover:text-green-500"}`} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        )}
        <div className="items-center space-x-2 w-32 hidden md:flex">
          <Volume2 size={20} />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full accent-green-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

export default Player;