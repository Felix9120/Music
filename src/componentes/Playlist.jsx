import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient'; // 👈 Importar conexión

function Playlist() {
    const [songs, setSongs] = useState([]);
    const [title, setTitle] = useState('');
    const [isMobile, setIsMobile] = useState(false);

    const loadPlaylist = () => {
        const storedSongs = JSON.parse(localStorage.getItem('selectedPlaylist')) || [];
        const storedTitle = localStorage.getItem('playlistTitle') || '';
        setSongs(storedSongs);
        setTitle(storedTitle);
    };

    // 🔹 Nueva función para cargar canciones desde Supabase
    const loadSongsFromSupabase = async () => {
        const { data, error } = await supabase.from('songs').select('*');
        if (error) {
            console.error('Error cargando canciones de Supabase:', error);
        } else {
            setSongs(data);
            setTitle('Canciones subidas');
        }
    };

    useEffect(() => {
        // Limpiar playlist al recargar
        localStorage.removeItem('selectedPlaylist');
        localStorage.removeItem('playlistTitle');
        setSongs([]);
        setTitle('');

        // Escuchar cambios cuando se selecciona un artista
        window.addEventListener('playlist-selected', loadPlaylist);

        // Detectar si es pantalla móvil
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        // 👇 Si no hay playlist seleccionada, cargar canciones de Supabase
        loadSongsFromSupabase();

        return () => {
            window.removeEventListener('playlist-selected', loadPlaylist);
            window.removeEventListener('resize', checkMobile);
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
        <div
            className={`text-white p-4 bg-[#191919] mt-2.5 rounded-[10px] overflow-auto 
                ${isMobile ? 'w-full h-auto' : 'w-[900px] h-[400px]'}`}
        >
            {title && <h2 className="text-lg font-bold mb-4">{title}</h2>}
            {songs.length === 0 ? (
                <p>No hay canciones en esta playlist</p>
            ) : (
                <div
                    className={`${isMobile
                        ? 'flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth'
                        : 'flex flex-col'
                        }`}
                >
                    {songs.map((song, index) => (
                        <div
                            key={song.id}
                            className={`flex items-center gap-3 bg-[#232323] p-2 rounded-lg 
                                hover:bg-[#1DB954] transition-colors cursor-pointer 
                                ${isMobile ? 'min-w-[200px] flex-shrink-0 snap-center' : 'mb-2'}`}
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
