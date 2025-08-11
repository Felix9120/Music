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
        // Cargar canciones al iniciar
        const fetchSongs = async () => {
            const { data, error } = await supabase.from('songs').select('*').order('id', { ascending: false });
            if (!error) setSongs(data);
        };
        fetchSongs();
    }, []);

    const handleSongUploaded = (newSong) => {
        // Agrega la nueva canción arriba para mostrar sin recargar
        setSongs(prevSongs => [newSong, ...prevSongs]);
    };

    return (
        <div className='bg-black min-h-screen'>
            <Sidebar />
            <div className="flex bg-black text-white p-2.5 mb-5">
                <div className='flex flex-col'>
                    <Biblioteca songs={songs} />
                </div>
                <div className='flex-1 flex flex-col ml-1.5'>
                    <div className='flex-1'>
                        <Playlist />
                        <UploadSong onSongUploaded={handleSongUploaded} />

                    </div>
                </div>
            </div>


            <MiniPlayer />
        </div>
    );
}

export default Home;
