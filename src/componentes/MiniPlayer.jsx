import React, { useState, useEffect, useRef } from "react";

export default function MiniPlayer() {
    const audioRef = useRef(null);
    const [songs, setSongs] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [shuffle, setShuffle] = useState(false);
    const [volume, setVolume] = useState(1);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    // 🔹 Recibe evento de Playlist
    useEffect(() => {
        const handlePlaySong = ({ detail }) => {
            setSongs(detail.songs || []);
            setCurrentIndex(detail.index ?? 0);
            setIsPlaying(true);
        };
        window.addEventListener("play-song", handlePlaySong);
        return () => window.removeEventListener("play-song", handlePlaySong);
    }, []);

    // 🔹 Carga y reproduce canción
    useEffect(() => {
        if (!audioRef.current || currentIndex === null || !songs.length) return;
        const src = songs[currentIndex]?.file_url || songs[currentIndex]?.fileUrl || songs[currentIndex]?.url;
        if (!src) return;

        audioRef.current.src = src;
        audioRef.current.load();
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }, [currentIndex, songs]);

    // 🔹 Actualiza progreso y maneja fin de canción
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateProgress = () => {
            setProgress(audio.currentTime || 0);
            setDuration(audio.duration || 0);
        };
        const handleEnded = () => {
            setCurrentIndex(shuffle ? Math.floor(Math.random() * songs.length) : (prev) => (prev + 1) % songs.length);
        };

        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("loadedmetadata", updateProgress);
        audio.addEventListener("ended", handleEnded);
        return () => {
            audio.removeEventListener("timeupdate", updateProgress);
            audio.removeEventListener("loadedmetadata", updateProgress);
            audio.removeEventListener("ended", handleEnded);
        };
    }, [songs, shuffle]);

    // 🔹 Controles
    const togglePlay = () => {
        if (!audioRef.current) return;
        isPlaying ? audioRef.current.pause() : audioRef.current.play();
        setIsPlaying(!isPlaying);
    };
    const nextSong = () => setCurrentIndex(shuffle ? Math.floor(Math.random() * songs.length) : (prev) => (prev + 1) % songs.length);
    const prevSong = () => setCurrentIndex((prev) => (prev - 1 + songs.length) % songs.length);
    const handleVolumeChange = (e) => {
        const vol = parseFloat(e.target.value);
        setVolume(vol);
        if (audioRef.current) audioRef.current.volume = vol;
    };
    const handleSeek = (e) => {
        const time = parseFloat(e.target.value);
        if (audioRef.current) audioRef.current.currentTime = time;
        setProgress(time);
    };
    const formatTime = (t) => isNaN(t) ? "0:00" : `${Math.floor(t / 60)}:${Math.floor(t % 60).toString().padStart(2, "0")}`;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 p-4 flex flex-col gap-2 items-center border-t border-neutral-800 z-50">
            <span className="text-white text-sm">
                {currentIndex !== null ? `${songs[currentIndex]?.title} — ${songs[currentIndex]?.artist}` : "Selecciona una canción para empezar"}
            </span>

            <div className="flex items-center gap-2 w-full max-w-xl">
                <span className="text-gray-400 text-xs">{formatTime(progress)}</span>
                <input type="range" min={0} max={duration || 0} value={progress} onChange={handleSeek} className="flex-grow accent-green-500" />
                <span className="text-gray-400 text-xs">{formatTime(duration)}</span>
            </div>

            <div className="flex gap-3 items-center">
                <button onClick={prevSong}>⏮</button>
                <button onClick={togglePlay} disabled={currentIndex === null}>{isPlaying ? "⏸" : "▶"}</button>
                <button onClick={nextSong}>⏭</button>
                <button onClick={() => setShuffle(!shuffle)}>{shuffle ? "🔀" : "➡"}</button>
                <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} className="accent-green-500" />
            </div>

            <audio ref={audioRef} />
        </div>
    );
}
