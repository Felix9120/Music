import React, { useEffect, useState } from 'react';

function Playlist() {
    const [songs, setSongs] = useState([]);
    const [title, setTitle] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const [filteredSongs, setFilteredSongs] = useState([]); // 🔹 añadido

    const loadPlaylist = () => {
        const storedSongs = JSON.parse(localStorage.getItem('selectedPlaylist')) || [];
        const storedTitle = localStorage.getItem('playlistTitle') || '';
        setSongs(storedSongs);
        setFilteredSongs(storedSongs); // 🔹 inicializa filtradas con todas
        setTitle(storedTitle);
    };

    useEffect(() => {
        // 🔹 Limpiar playlist al recargar
        localStorage.removeItem('selectedPlaylist');
        localStorage.removeItem('playlistTitle');
        setSongs([]);
        setFilteredSongs([]); // 🔹 también limpiar filtradas
        setTitle('');

        // Escuchar cambios cuando se selecciona un artista
        window.addEventListener('playlist-selected', loadPlaylist);

        // 🔹 Escuchar búsqueda desde Sidebar
        const handleSearchUpdate = () => {
            const query = localStorage.getItem('search_query') || '';
            if (!query.trim()) {
                setFilteredSongs(songs);
            } else {
                setFilteredSongs(
                    songs.filter(
                        (song) =>
                            song.title.toLowerCase().includes(query.toLowerCase()) ||
                            song.artist.toLowerCase().includes(query.toLowerCase())
                    )
                );
            }
        };
        window.addEventListener('search-updated', handleSearchUpdate);

        // Detectar si es pantalla móvil
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => {
            window.removeEventListener('playlist-selected', loadPlaylist);
            window.removeEventListener('search-updated', handleSearchUpdate); // 🔹 limpieza
            window.removeEventListener('resize', checkMobile);
        };
    }, [songs]);

    const handlePlaySong = (songIndex) => {
        window.dispatchEvent(new CustomEvent('play-song', {
            detail: {
                songs: filteredSongs, // 🔹 reproducir las filtradas
                index: songIndex
            }
        }));
    };

    return (
        <div
            className={`text-white p-4 bg-[#191919] mt-2.5 rounded-[10px] overflow-auto 
                ${isMobile
                    ? 'w-full h-[calc(100vh-100px)]' // 🔹 Alto ajustado en móviles
                    : 'w-[900px] h-[400px]'
                }`}
        >
            {title && <h2 className="text-lg font-bold mb-4">{title}</h2>}
            {filteredSongs.length === 0 ? (
                <p>No hay canciones en esta playlist</p>
            ) : (
                <div
                    className={`${isMobile
                        ? 'flex flex-col gap-3 overflow-y-auto scrollbar-hide' // 🔹 Scroll vertical en móvil
                        : 'flex flex-col'
                        }`}
                >
                    {filteredSongs.map((song, index) => (
                        <div
                            key={song.id}
                            className={`flex items-center gap-3 bg-[#232323] p-2 rounded-lg 
                                hover:bg-[#1DB954] transition-colors cursor-pointer 
                                ${isMobile ? '' : 'mb-2'}`}
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
                    ))}
                </div>
            )}
        </div>
    );
}

export default Playlist;
