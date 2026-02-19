"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (res.ok) {
        
        router.push("/login");
      } else {
        const data = await res.json();
        
        const firstErrorKey = Object.keys(data)[0];
        const firstErrorMessage = data[firstErrorKey][0];
        setError(`${firstErrorKey}: ${firstErrorMessage}` || "Error al registrarse");
      }
    } catch (err) {
      setError("Error de conexión. Revisa que el Backend esté encendido.");
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 border-t-4 border-yellow-500">
        
        <div className="flex justify-center mb-6">
           <img src="/logo-maia.png" alt="MaiA" className="h-16 object-contain" />
        </div>

        <h2 className="text-3xl font-serif font-bold text-center text-gray-800 mb-2">
          Únete a b-maia
        </h2>
        <p className="text-center text-gray-500 mb-8">Crea tu cuenta gratis</p>

        <form onSubmit={handleRegister} className="space-y-5">
          
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 text-sm rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nombre de Usuario</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none text-gray-900"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Correo Electrónico</label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none text-gray-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none text-gray-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-600 text-white font-bold py-3 rounded-lg hover:bg-yellow-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            CREAR CUENTA
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-bold text-yellow-600 hover:text-yellow-800 hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}