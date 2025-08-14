// src/componentes/MiniPlayer.jsx
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

    useEffect(() => {
        const handlePlaySong = (e) => {
            const detail = e.detail || {};
            console.log("MiniPlayer received play-song", detail);
            const incomingSongs = detail.songs || [];
            const idx = typeof detail.index === 'number' ? detail.index : 0;
            setSongs(incomingSongs);
            setCurrentIndex(idx);
            setIsPlaying(true);
        };
        window.addEventListener("play-song", handlePlaySong);
        return () => window.removeEventListener("play-song", handlePlaySong);
    }, []);

    useEffect(() => {
        if (!audioRef.current) return;
        if (currentIndex === null || !songs || songs.length === 0) return;

        const src = songs[currentIndex]?.file_url || songs[currentIndex]?.fileUrl || songs[currentIndex]?.url;
        if (!src) {
            console.warn("MiniPlayer: canción sin URL:", songs[currentIndex]);
            return;
        }

        audioRef.current.src = src;
        audioRef.current.load();
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => setIsPlaying(true))
                .catch((err) => {
                    console.warn("Autoplay blocked:", err);
                    setIsPlaying(false);
                });
        } else {
            setIsPlaying(true);
        }
    }, [currentIndex, songs]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateProgress = () => {
            setProgress(audio.currentTime || 0);
            setDuration(audio.duration || 0);
        };

        const handleEnded = () => {
            if (shuffle) {
                setCurrentIndex(Math.floor(Math.random() * songs.length));
            } else {
                setCurrentIndex((prev) => (prev === null ? 0 : (prev + 1) % songs.length));
            }
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

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().catch(() => { });
            setIsPlaying(true);
        }
    };

    const nextSong = () => {
        if (!songs.length) return;
        if (shuffle) {
            setCurrentIndex(Math.floor(Math.random() * songs.length));
        } else {
            setCurrentIndex((prev) => (prev === null ? 0 : (prev + 1) % songs.length));
        }
    };

    const prevSong = () => {
        if (!songs.length) return;
        setCurrentIndex((prev) => (prev === null ? 0 : (prev - 1 + songs.length) % songs.length));
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) audioRef.current.volume = newVolume;
    };

    const handleSeek = (e) => {
        const newTime = parseFloat(e.target.value);
        if (audioRef.current) audioRef.current.currentTime = newTime;
        setProgress(newTime);
    };

    const formatTime = (time) => {
        if (!time || isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 p-4 flex flex-col gap-2 items-center border-t border-neutral-800 z-50">
            <span className="text-white text-sm">
                {currentIndex !== null
                    ? `${songs[currentIndex]?.title} — ${songs[currentIndex]?.artist}`
                    : "Selecciona una canción para empezar"}
            </span>

            <div className="flex items-center gap-2 w-full max-w-xl">
                <span className="text-gray-400 text-xs">{formatTime(progress)}</span>
                <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    value={progress}
                    onChange={handleSeek}
                    className="flex-grow accent-green-500"
                />
                <span className="text-gray-400 text-xs">{formatTime(duration)}</span>
            </div>

            <div className="flex gap-3 items-center">
                <button onClick={prevSong}>⏮</button>
                <button onClick={togglePlay} disabled={currentIndex === null}>
                    {isPlaying ? "⏸" : "▶"}
                </button>
                <button onClick={nextSong}>⏭</button>
                <button onClick={() => setShuffle(!shuffle)}>
                    {shuffle ? "🔀" : "➡"}
                </button>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="accent-green-500"
                />
            </div>

            <audio ref={audioRef} />
        </div>
    );
}
