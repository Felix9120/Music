import { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { supabase } from "../supabaseClient";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Artist() {
  const [artists, setArtists] = useState([]);
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [showArrows, setShowArrows] = useState(false);

  useEffect(() => {
    supabase
      .from('artists')
      .select('*')
      .then(({ data, error }) => {
        if (error) {
          console.error('Error al cargar artistas:', error);
          alert('No se pudieron cargar los artistas');
        } else {
          setArtists(data || []);
        }
      })
      .catch(err => {
        console.error('Error inesperado:', err);
        alert('Ocurrió un error al cargar');
      });
  }, []);

  const handleVerId = (id) => {
    navigate(`/artists/${id}`);
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
      scrollRef.current.scrollTo({
        left: scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div 
      className="p-4 relative group"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      <h2 className="text-xl font-bold mb-4">Artistas</h2>

      {/* Flecha izquierda (solo en escritorio) */}
      {showArrows && (
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-black z-10 transition"
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {/* Carrusel */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto space-x-6 scroll-smooth no-scrollbar"
      >
        {artists.map((artist) => (
          <div
            key={artist.id}
            className="flex-shrink-0 w-40 cursor-pointer"
            onClick={() => handleVerId(artist.id)}
          >
            <div className="w-40 h-40 rounded-full overflow-hidden shadow-lg hover:scale-105 transition">
              <img
                src={artist.image_url}
                alt={artist.name}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-center mt-2 font-medium truncate">{artist.name}</p>
          </div>
        ))}
      </div>

      {/* Flecha derecha (solo en escritorio) */}
      {showArrows && (
        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-black z-10 transition"
        >
          <ChevronRight size={28} />
        </button>
      )}
    </div>
  );
}

export default Artist;
