// src/componentes/Biblioteca.jsx
import React, { useEffect, useState } from 'react';
import Buscar from '../assets/Search_S.png';
import { supabase } from '../supabaseClient';

function Biblioteca() {
    const [songs, setSongs] = useState([]);
    const [search, setSearch] = useState('');

    const fetchSongs = async () => {
        const { data, error } = await supabase
            .from('songs')
            .select('*')
            .order('artist', { ascending: true })
            .order('title', { ascending: true });

        if (error) {
            console.error('Error fetching songs:', error);
            return;
        }
        setSongs(data || []);
    };

    useEffect(() => {
        fetchSongs();
        const handler = () => fetchSongs();
        window.addEventListener('song-uploaded', handler);
        return () => {
            window.removeEventListener('song-uploaded', handler);
        };
    }, []);

    const filtered = songs.filter((s) =>
        (s.title || '').toLowerCase().includes(search.toLowerCase()) ||
        (s.artist || '').toLowerCase().includes(search.toLowerCase())
    );

    const songsByArtist = filtered.reduce((acc, song) => {
        const a = song.artist || 'Desconocido';
        if (!acc[a]) acc[a] = [];
        acc[a].push(song);
        return acc;
    }, {});

    const handleArtistClick = (artist) => {
        const artistSongs = songsByArtist[artist] || [];
        localStorage.setItem('selectedPlaylist', JSON.stringify(artistSongs));
        localStorage.setItem('playlistTitle', artist);
        window.dispatchEvent(new Event('playlist-selected'));
    };

    const handleSongClickPlay = (e, artist, song) => {
        e.stopPropagation();
        const artistSongs = songsByArtist[artist] || [];
        const index = artistSongs.findIndex(s => s.id === song.id);
        window.dispatchEvent(new CustomEvent('play-song', {
            detail: {
                songs: artistSongs,
                index
            }
        }));
    };

    return (
        <div className="bg-[#191919] md:bg-[#191919] w-full md:w-[412px] h-auto md:h-[660px] rounded-[10px]">
            <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-2.5 p-2.5 text-white">
                    <p>Your Library</p>
                </div>
            </div>

            <div className="flex justify-between mt-5 mx-5 text-white items-center">
                <div className="flex items-center gap-2 bg-[#232323] px-3 py-1 rounded w-full">
                    <img src={Buscar} alt="Buscar" className="w-[18px] h-[18px]" />
                    <input
                        type="text"
                        placeholder="Buscar en biblioteca..."
                        className="bg-transparent outline-none text-sm text-white w-full"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Vista de canciones */}
            <div className="mt-4 px-5 text-white overflow-y-auto md:h-[420px]">
                {Object.keys(songsByArtist).length === 0 ? (
                    <p className="text-gray-400 text-sm">No hay canciones</p>
                ) : (
                    Object.keys(songsByArtist).map((artist) => (
                        <div key={artist} className="mb-4" onClick={() => handleArtistClick(artist)}>
                            <div className="flex items-center justify-between cursor-pointer">
                                <h4 className="text-white font-semibold">{artist}</h4>
                                <span className="text-xs text-gray-400">{songsByArtist[artist].length} canciones</span>
                            </div>

                            {/* En móviles, carrusel horizontal */}
                            <div className="mt-2 flex md:block overflow-x-auto md:overflow-x-visible gap-3 md:gap-0 scrollbar-hide">
                                {songsByArtist[artist].map((song) => (
                                    <div
                                        key={song.id}
                                        className="flex-shrink-0 md:flex-shrink md:w-auto w-40 bg-[#232323] p-2 rounded-lg hover:bg-[#1DB954] transition-colors cursor-pointer "
                                        onClick={(e) => handleSongClickPlay(e, artist, song)}
                                    >
                                        <div className="bg-[#444] w-12 h-12 flex items-center justify-center rounded">
                                            🎵
                                        </div>
                                        <div className="ml-2">
                                            <p className="text-sm font-semibold">{song.title}</p>
                                            <p className="text-xs text-gray-400">{song.artist}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Biblioteca;
