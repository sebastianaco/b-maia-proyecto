"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    
    
    setTimeout(() => {
      
      localStorage.setItem("username", username);
      
      localStorage.setItem("access_token", "token-simulado-123");

      
      window.location.href = "/"; 
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50 px-4">
      
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-yellow-600">
        
        
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group">
             <h1 className="text-4xl font-serif font-black text-gray-800 group-hover:text-yellow-600 transition-colors">
               b-maia
             </h1>
          </Link>
          <p className="text-gray-500 text-sm mt-2 font-medium">
            Ingresa para guardar tus noticias favoritas
          </p>
        </div>

        
        <form onSubmit={handleLogin} className="space-y-6">
          
          
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2 tracking-wide">
              Usuario
            </label>
            <input 
              type="text" 
              required
              className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 outline-none transition-all font-medium text-gray-800"
              placeholder="Ej: Matu"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2 tracking-wide">
              Contraseña
            </label>
            <input 
              type="password" 
              required
              className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 outline-none transition-all font-medium text-gray-800"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-yellow-600 text-white font-bold py-3.5 rounded-lg hover:bg-yellow-700 active:scale-95 transition-all shadow-md uppercase tracking-wider flex justify-center items-center"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Ingresar a la Colmena"
            )}
          </button>
        </form>

        
        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="text-yellow-700 font-bold hover:underline">
              Regístrate aquí
            </Link>
          </p>
          <Link href="/" className="block mt-4 text-xs text-gray-400 hover:text-gray-600">
            ← Volver al inicio
          </Link>
        </div>

      </div>

    </div>
  );
}