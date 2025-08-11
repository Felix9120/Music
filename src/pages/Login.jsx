import React from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../supabaseClient';
import { Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react'

function Login() {
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
            <>
                <div className="flex gap-10 p-4 w- rounded-xl shadow-md border border-gray-200 bg-white text-center">
                    <Link to="/Home"><button className="text-2xl font-bold text-rose-500 hover:text-rose-600 transition">Music</button></Link>
                    <img className='w-12 h-12 rounded-full object-cover' src={session.user.user_metadata?.avatar_url} alt="" />
                </div>
                <div className=''>
                    <h2>{session?.user?.email}</h2>
                    <button onClick={signOut}>Cerrar sesion</button>
                </div>
            </>
        )
    }
}

export default Login