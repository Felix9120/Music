import React, { useState, useEffect } from 'react';
import Sidebar from '../componentes/Sidebar';
import Biblioteca from '../componentes/Biblioteca';
import UploadSong from './UploadSong';
import MiniPlayer from '../componentes/MiniPlayer';
import { supabase } from '../supabaseClient';
import Playlist from '../componentes/Playlist';

function Home() {
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        const fetchSongs = async () => {
            const { data, error } = await supabase
                .from('songs')
                .select('*')
                .order('id', { ascending: false });
            if (!error) setSongs(data);
        };
        fetchSongs();
    }, []);

    const handleSongUploaded = (newSong) => {
        setSongs(prevSongs => [newSong, ...prevSongs]);
    };

    return (
        <div className="bg-black flex flex-col min-h-screen">
            {/* Sidebar siempre arriba en móvil, lateral en escritorio */}
            <Sidebar />

            {/* Contenido principal */}
            <div className="flex flex-col md:flex-row bg-black text-white p-2.5 mb-5 gap-4">
                
                {/* Biblioteca: ancho completo en móvil, fijo en escritorio */}
                <div className="w-full md:w-[412px]">
                    <Biblioteca songs={songs} />
                </div>

                {/* Panel derecho: Upload + Playlist */}
                <div className="flex-1 flex flex-col w-full">
                    <div className="mt-2 md:mt-0">
                        <UploadSong onSongUploaded={handleSongUploaded} />
                    </div>
                    <div className="flex-1 mt-4 md:mt-2">
                        <Playlist />
                    </div>
                </div>
            </div>

            {/* MiniPlayer siempre visible abajo */}
            <MiniPlayer />
        </div>
    );
}

export default Home;
