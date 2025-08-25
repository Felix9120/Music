import { useState } from "react";
import { supabase } from "../supabaseClient";
import {
  X,
  Plus,
  ArrowUpFromLine,
  Search,
} from "lucide-react"; // Añadimos algunos iconos para el botón de subida

function UploadSong({ onUpload }) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const upload = async () => {
    if (!file) return alert("Selecciona un archivo primero");
    setLoading(true);

    // Generar un nombre de archivo único y seguro
    const sanitizedFileName = file.name
      .replace(/[^a-zA-Z0-9_.-]/g, "_")
      .replace(/_+/g, "_");
    const filePath = `songs/${Date.now()}-${sanitizedFileName}`;

    try {
      // 1. Subir archivo
      const { data, error } = await supabase.storage
        .from("songs")
        .upload(filePath, file);

      if (error) throw error;

      // 2. Obtener URL pública
      const { data: publicData, error: publicError } = supabase.storage
        .from("songs")
        .getPublicUrl(filePath);

      if (publicError) throw publicError;

      const publicUrl = publicData.publicUrl;

      // 3. Guardar en tabla
      const { error: dbError } = await supabase.from("songs").insert({
        title,
        artist,
        file_url: publicUrl,
      });
      if (dbError) throw dbError;

      alert("✅ Canción subida correctamente");

      // 4. Limpiar inputs
      setTitle("");
      setArtist("");
      setFile(null);

      if (onUpload) onUpload();
    } catch (err) {
      console.error(err);
      alert("❌ Error al subir la canción: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4 p-4 max-w-md w-full bg-neutral-900 rounded-lg shadow-lg flex flex-col items-center gap-4 mx-auto sm:p-6">
      <h2 className="text-xl text-white font-bold mb-2">Subir Nueva Canción</h2>
      <input
        type="text"
        placeholder="Título de la canción"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="
          w-full p-3 rounded-md bg-neutral-800 text-white placeholder-neutral-500 border border-transparent 
          focus:outline-none focus:border-green-500 transition-colors
        "
      />
      <input
        type="text"
        placeholder="Artista"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
        className="
          w-full p-3 rounded-md bg-neutral-800 text-white placeholder-neutral-500 border border-transparent 
          focus:outline-none focus:border-green-500 transition-colors
        "
      />
      <div className="
        w-full p-3 rounded-md bg-neutral-800 text-white placeholder-neutral-500 border border-transparent 
        focus-within:border-green-500 flex items-center justify-between cursor-pointer transition-colors
      ">
        <label htmlFor="file-upload" className="flex-1 cursor-pointer">
          {file ? file.name : "Selecciona un archivo de audio"}
        </label>
        <input
          id="file-upload"
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          accept="audio/*"
          className="hidden"
        />
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
        </svg>
      </div>
      <button
        onClick={upload}
        disabled={loading}
        className="
          w-full py-3 mt-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-md transition-colors 
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        {loading ? "Subiendo..." : "Subir"}
      </button>
    </div>
  );
}

export default UploadSong;