import React, { useState, useEffect } from "react";
import { supabase } from '../supabaseClient';

export default function UploadSong({ onSongUploaded }) {
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [session, setSession] = useState(null);

    // ✅ Obtener la sesión actual al cargar el componente
    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
        };
        getSession();
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();

      

        if (!title || !artist || !file) {
            setMessage("⚠️ Por favor completa todos los campos");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const fileExt = file.name.split(".").pop();
            const fileName = `${Date.now()}.${fileExt}`;

            const { error: storageError } = await supabase.storage
                .from("songs")
                .upload(fileName, file);

            if (storageError) throw storageError;

            const { data: publicUrlData } = supabase.storage
                .from("songs")
                .getPublicUrl(fileName);

            const fileUrl = publicUrlData.publicUrl;

            const { error: dbError } = await supabase.from("songs").insert([
                { title, artist, file_url: fileUrl }
            ]);

            if (dbError) throw dbError;

            if (onSongUploaded) {
                onSongUploaded({ title, artist, file_url: fileUrl });
            }

            // Notificar a Biblioteca para que recargue la lista
            window.dispatchEvent(new Event('song-uploaded'));

            setMessage("✅ Canción subida correctamente");
            setTitle("");
            setArtist("");
            setFile(null);
        } catch (err) {
            setMessage(`❌ Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Si no es el admin, no mostramos el formulario
    if (session && session.user?.email !== "felix.alfonso0991@gmail.com") {
        return (
            <div className="bg-[#121212] p-6 rounded-xl shadow-lg max-w-md mx-auto border border-gray-800">
                <p className="text-red-500 font-semibold">No tienes permiso para subir música</p>
            </div>
        );
    }

    return (
        <div className="bg-[#121212] p-6 rounded-xl shadow-lg max-w-md mx-auto border border-gray-800">
            <h2 className="text-white text-xl font-bold mb-4">Subir Canción</h2>
            <form onSubmit={handleUpload} className="space-y-4">
                <input
                    type="text"
                    placeholder="Título de la canción"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 rounded-lg bg-[#2a2a2a] text-white outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                    type="text"
                    placeholder="Nombre del artista"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    className="w-full p-3 rounded-lg bg-[#2a2a2a] text-white outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                    type="file"
                    accept="audio/mp3"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4
                               file:rounded-full file:border-0
                               file:text-sm file:font-semibold
                               file:bg-green-500 file:text-white
                               hover:file:bg-green-400"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-500 hover:bg-green-400 text-white py-2 px-4 rounded-lg font-semibold transition disabled:opacity-50"
                >
                    {loading ? "Subiendo..." : "Subir Canción"}
                </button>
            </form>
            {message && <p className="text-gray-300 mt-3 text-sm">{message}</p>}
        </div>
    );
}
