import React from 'react';
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Link } from 'react-router-dom';

function Inicio() {

    const [session, setSession] = useState(null)
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
        return () => subscription.unsubscribe()
    }, [])

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
    };

    if (!session) {
        return (<Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={['google']} />)
    }
    else {
        return (

            <div className='bg-[#121212] p-6 rounded-xl shadow-lg max-w-md mx-auto border border-gray-800 text-emerald-400 flex flex-col h-40 items-center justify-center gap-2.5 mt-60'>
                <div>
                    <h1 className='text-2xl'>Bienvenidos {session?.user.user_metadata?.name}</h1>
                </div>

                <div>
                    <Link to={'/Home'}> <button className='bg-amber-50 w-32 h-[30px] rounded-[10px] cursor-pointer'>Ingresar</button> </Link>
                    <button className='bg-amber-50 w-32 h-[30px] rounded-[10px] cursor-pointer' onClick={signOut}>Salir</button>
                    <Link to={'/Login'}> <button></button> </Link>
                </div>


            </div>
        )
    }
}
export default Inicio