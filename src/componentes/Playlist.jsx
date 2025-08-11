import React, { useEffect, useState } from 'react';

function Playlist() {
    const [songs, setSongs] = useState([]);
    const [title, setTitle] = useState('');

    const loadPlaylist = () => {
        const storedSongs = JSON.parse(localStorage.getItem('selectedPlaylist')) || [];
        const storedTitle = localStorage.getItem('playlistTitle') || '';
        setSongs(storedSongs);
        setTitle(storedTitle);
    };

    useEffect(() => {
        // 🔹 Limpiar playlist al recargar
        localStorage.removeItem('selectedPlaylist');
        localStorage.removeItem('playlistTitle');
        setSongs([]);
        setTitle('');

        // Escuchar cambios cuando se selecciona un artista
        window.addEventListener('playlist-selected', loadPlaylist);
        return () => {
            window.removeEventListener('playlist-selected', loadPlaylist);
        };
    }, []);

    const handlePlaySong = (songIndex) => {
        window.dispatchEvent(new CustomEvent('play-song', {
            detail: {
                songs: songs,
                index: songIndex
            }
        }));
    };

    return (
        <div className="text-white p-4 w-[900px] h-[400px] overflow-auto bg-[#191919] mt-2.5 rounded-[10px]">
            {title && <h2 className="text-lg font-bold mb-4">{title}</h2>}
            {songs.length === 0 ? (
                <p>No hay canciones en esta playlist</p>
            ) : (
                songs.map((song, index) => (
                    <div
                        key={song.id}
                        className="flex items-center gap-3 bg-[#232323] p-2 rounded-lg mb-2 hover:bg-[#1DB954] transition-colors cursor-pointer"
                        onClick={() => handlePlaySong(index)}
                    >
                        <div className="bg-[#444] w-12 h-12 flex items-center justify-center rounded">
                            🎵
                        </div>
                        <div>
                            <p className="text-sm font-semibold">{song.title}</p>
                            <p className="text-xs text-gray-400">{song.artist}</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default Playlist;
