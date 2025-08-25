import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Artist from "./pages/Artist";
import Genre from "./pages/Genre";
import Favorites from "./pages/Favorites";
import Navbar from "./componentes/Navbar";
import Sidebar from "./componentes/Sidebar";
import Player from "./componentes/Player";
import Search from "./pages/Search";
import SongsPage from "./pages/SongsPage";
import GenreSongs from "./componentes/GenreSongs";
import ArtistSongs from "./componentes/ArtistSongs";
import Login from "./pages/Login";

function App() {
  return (
    <div className="flex h-screen bg-black text-white font-sans">
      {/* Sidebar estilo Spotify */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="flex flex-col flex-1 w-full overflow-auto">
        <Navbar />
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-zinc-900 to-black">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/artist" element={<Artist />} />
            <Route path="/artists/:id" element={<ArtistSongs />} />
            <Route path="/genre" element={<Genre />} />
            <Route path="/genres/:id" element={<GenreSongs />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/search" element={<Search />} />
            <Route path="/songs" element={<SongsPage />} />
          </Routes>
        </div>
        <Player />
      </div>
    </div>
  );
}

export default App;
