// src/usePlayer.jsx
import { createContext, useContext, useRef, useState, useEffect } from "react";

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]); // lista de canciones cargadas
  const [currentIndex, setCurrentIndex] = useState(-1);

  const audioRef = useRef(null);

  // ▶️ reproducir una canción desde SongList
  const playSong = (song, songsList = []) => {
    setCurrentSong(song);
    setIsPlaying(true);

    if (songsList.length > 0) {
      setQueue(songsList);
      const idx = songsList.findIndex((s) => s.id === song.id);
      setCurrentIndex(idx);
    }
  };

  // ⏯ toggle play/pausa
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // ⏭ siguiente
  const next = () => {
    if (queue.length === 0) return;
    const newIndex = (currentIndex + 1) % queue.length;
    setCurrentIndex(newIndex);
    setCurrentSong(queue[newIndex]);
    setIsPlaying(true);
  };

  // ⏮ anterior
  const prev = () => {
    if (queue.length === 0) return;
    const newIndex = (currentIndex - 1 + queue.length) % queue.length;
    setCurrentIndex(newIndex);
    setCurrentSong(queue[newIndex]);
    setIsPlaying(true);
  };

  // 🎶 cuando cambia currentSong, actualizar src y reproducir
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;
    audioRef.current.src = currentSong.file_url;
    audioRef.current.play();
    setIsPlaying(true);
  }, [currentSong]);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        audioRef,
        playSong,
        togglePlay,
        next,
        prev,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}
