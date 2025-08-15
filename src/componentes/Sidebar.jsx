import React, { useState } from 'react';
import Home from '../assets/Home_Fill_S.png';
import Buscar from '../assets/Search_S.png';
import Logo from '../assets/logo.jpeg'
import { Link } from 'react-router-dom';

function Sidebar() {
    const [search, setSearch] = useState('');

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const clearSearch = () => {
        setSearch('');
        localStorage.removeItem('searchTerm');
        window.dispatchEvent(new Event('search-updated'));
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (search.trim()) {
            localStorage.setItem('searchTerm', search);
            window.dispatchEvent(new Event('search-updated')); // 🔹 avisamos a Playlist
        }
    };

    return (
        <div className="text-white rounded-[10px] w-full flex-col justify-between p-5 bg-black relative">
            <div className='flex gap-2.5 items-center'>

                <div className='w-[80px] h-[80px] flex items-center justify-center cursor-pointer'>
                    <img src={Logo} alt="" />
                </div>

                <div className='bg-[#191919] w-[50px] h-[50px] rounded-[10px] flex items-center justify-center cursor-pointer'>
                    <Link to={'/Home'}>
                        <img src={Home} alt="Home" />
                    </Link>
                </div>

                <form onSubmit={handleSearchSubmit} className='relative'>
                    <div className='w-[250px] md:w-[375px] md:flex items-center gap-2 bg-[#232323] px-3 py-1 rounded-2xl'>
                        <img src={Buscar} alt="" className="w-[18px] h-[18px]" />
                        <input
                            type="text"
                            value={search}
                            onChange={handleSearchChange}
                            placeholder="¿Qué quieres reproducir?"
                            className="bg-transparent outline-none text-white w-full"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="text-white hover:text-red-400 transition"
                                title="Limpiar búsqueda"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Sidebar;
