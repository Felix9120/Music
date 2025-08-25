import React from 'react';
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from 'react-router-dom';
import { Globe } from "lucide-react";

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

    // Función para manejar el inicio de sesión con Google
    const handleGoogleSignIn = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
        });
    };

    if (!session) {
        return (
            <div className="bg-[#121212] flex flex-col items-center justify-center p-8 text-white min-h-screen">
                <div className="bg-neutral-900 p-8 rounded-lg shadow-xl w-full max-w-sm">
                    <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">Inicia sesión en Music App</h2>
                    
                    {/* Botón funcional de Google con estilo de Spotify */}
                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full flex items-center justify-center space-x-2 py-3 mb-3 bg-white hover:bg-gray-100 text-black font-semibold rounded-full transition-colors"
                    >
                        <Globe size={20} />
                        <span>Continuar con Google</span>
                    </button>

                    <div className="flex items-center justify-center my-4">
                        <hr className="flex-grow border-gray-700" />
                        <span className="px-2 text-gray-400 text-sm">o</span>
                        <hr className="flex-grow border-gray-700" />
                    </div>

                    {/* Botón de correo electrónico solo de diseño, sin funcionalidad */}
                    <button
                        className="w-full py-3 bg-neutral-900 border border-gray-600 hover:bg-gray-800 text-white font-semibold rounded-full transition-colors"
                        disabled
                    >
                        Continuar con tu correo electrónico
                    </button>
                    
                    <p className="text-center text-xs mt-4 text-gray-400">
                      ¿Olvidaste tu contraseña?
                    </p>
                    <p className="text-center text-xs mt-4 text-gray-400">
                      ¿Aún no tienes cuenta? <Link to="/signup" className="underline text-white">Regístrate</Link>
                    </p>
                </div>
            </div>
        )
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
export default Login;