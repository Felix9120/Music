import { useRef } from "react";
import UploadSong from "../componentes/UploadSong";
import SongList from "../componentes/SongList";

function SongsPage() {
  const songListRef = useRef();

  const handleUpload = () => {
    if (songListRef.current) {
      songListRef.current.fetchSongs(); // refrescar lista
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Mis canciones</h1>
      <UploadSong onUpload={handleUpload} />
      <SongList ref={songListRef} />
    </div>
  );
}

export default SongsPage;
