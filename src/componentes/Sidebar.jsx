import React, { useState } from 'react';
import Home from '../assets/Home_Fill_S.png';

import Logo from '../assets/logo.jpeg'
import { Link } from 'react-router-dom';

function Sidebar() {
   

    return (
        <div className="text-white rounded-[10px] w-full flex-col justify-between p-5 bg-black relative">
            <div className='flex gap-2.5 items-center'>

                <div className='w-[80px] h-[80px]  flex items-center justify-center cursor-pointer'>   
                     <img src={Logo} alt="" />
                </div>           


                <div className='bg-[#191919] w-[50px] h-[50px] rounded-[10px] flex items-center justify-center cursor-pointer'>         
                   <Link to={'/Home'}>
                        <img src={Home} alt="Home" />
                    </Link>
                </div>
              
            </div>
        </div>
    );
}

export default Sidebar;
