"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";


interface UserProfile {
  username: string;
  firstName: string;
  lastName: string;
  rut: string; 
  email: string;
  phone: string;
  address: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      router.push("/login");
      return;
    }

    const storedProfile = localStorage.getItem("userProfile");
    
    if (storedProfile) {
      const parsedProfile = JSON.parse(storedProfile);
      setUser(parsedProfile);
      setFormData(parsedProfile);
    } else {
      
      const defaultProfile = {
        username: storedUsername,
        firstName: "",
        lastName: "",
        rut: "", 
        email: "",
        phone: "",
        address: "",
      };
      setUser(defaultProfile);
      setFormData(defaultProfile);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    window.location.href = "/";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSave = () => {
    if (formData) {
      setUser(formData);
      localStorage.setItem("userProfile", JSON.stringify(formData));
      setIsEditing(false);
      alert("🐝 ¡Tus datos han sido guardados con éxito!");
    }
  };

  const handleCancel = () => {
    setFormData(user); 
    setIsEditing(false); 
  };

  if (!user || !formData) return null;

  return (
    <div className="min-h-screen bg-yellow-50 py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        
      
        <div className="mb-8 text-center md:text-left">
          <Link href="/" className="text-sm font-bold text-gray-500 hover:text-yellow-600 mb-2 inline-block transition-colors">
            ← Volver al Inicio
          </Link>
          <h1 className="text-3xl font-serif font-black text-gray-800">Mi Perfil</h1>
        </div>

        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-yellow-200">
          
          <div className="h-32 bg-gradient-to-r from-yellow-500 to-yellow-600"></div>

          <div className="px-6 pb-8 md:px-10">
            
            
            <div className="relative -mt-16 mb-8 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-white p-1.5 shadow-lg mb-4">
                <div className="w-full h-full rounded-full bg-yellow-100 flex items-center justify-center text-5xl font-black text-yellow-700 uppercase border-4 border-yellow-300">
                  {user.username.charAt(0)}
                </div>
              </div>
              <h2 className="text-3xl font-black text-gray-900">{user.username}</h2>
              <p className="text-yellow-700 font-bold bg-yellow-100 px-4 py-1 rounded-full mt-2 text-sm border border-yellow-300">
                Miembro de la Colmena 🐝
              </p>
            </div>

            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">Información Personal</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nombre</label>
                  {isEditing ? (
                    user.firstName !== "" ? (
                      
                      <div className="relative">
                        <input 
                          type="text" 
                          disabled
                          value={user.firstName}
                          className="w-full p-3 rounded-lg border-2 border-gray-200 bg-gray-100 text-gray-500 outline-none cursor-not-allowed font-medium"
                        />
                        <span className="absolute right-3 top-3.5 text-gray-400 text-xs font-bold uppercase tracking-wider">🔒 Fijo</span>
                      </div>
                    ) : (
                      
                      <input 
                        type="text" 
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg border-2 border-yellow-300 focus:border-yellow-600 focus:ring-2 focus:ring-yellow-100 outline-none transition-all font-medium text-gray-800 bg-white"
                        placeholder="Ej: Juan"
                      />
                    )
                  ) : (
                    <p className="text-lg font-bold text-gray-800 bg-white p-3 rounded-lg border border-gray-200 h-12 flex items-center">
                      {user.firstName || <span className="text-gray-400 italic font-normal text-sm">No especificado</span>}
                    </p>
                  )}
                </div>

               
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Apellido</label>
                  {isEditing ? (
                    user.lastName !== "" ? (
                       
                       <div className="relative">
                         <input 
                           type="text" 
                           disabled
                           value={user.lastName}
                           className="w-full p-3 rounded-lg border-2 border-gray-200 bg-gray-100 text-gray-500 outline-none cursor-not-allowed font-medium"
                         />
                         <span className="absolute right-3 top-3.5 text-gray-400 text-xs font-bold uppercase tracking-wider">🔒 Fijo</span>
                       </div>
                    ) : (
                       
                      <input 
                        type="text" 
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg border-2 border-yellow-300 focus:border-yellow-600 focus:ring-2 focus:ring-yellow-100 outline-none transition-all font-medium text-gray-800 bg-white"
                        placeholder="Ej: Pérez"
                      />
                    )
                  ) : (
                    <p className="text-lg font-bold text-gray-800 bg-white p-3 rounded-lg border border-gray-200 h-12 flex items-center">
                      {user.lastName || <span className="text-gray-400 italic font-normal text-sm">No especificado</span>}
                    </p>
                  )}
                </div>

                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">RUT</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="rut"
                      value={formData.rut}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg border-2 border-yellow-300 focus:border-yellow-600 focus:ring-2 focus:ring-yellow-100 outline-none transition-all font-medium text-gray-800 bg-white"
                      placeholder="Ej: 12.345.678-9"
                    />
                  ) : (
                    <p className="text-lg font-bold text-gray-800 bg-white p-3 rounded-lg border border-gray-200 h-12 flex items-center">
                      {user.rut || <span className="text-gray-400 italic font-normal text-sm">No especificado</span>}
                    </p>
                  )}
                </div>

                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Correo Electrónico</label>
                  {isEditing ? (
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg border-2 border-yellow-300 focus:border-yellow-600 focus:ring-2 focus:ring-yellow-100 outline-none transition-all font-medium text-gray-800 bg-white"
                      placeholder="correo@ejemplo.com"
                    />
                  ) : (
                    <p className="text-lg font-bold text-gray-800 bg-white p-3 rounded-lg border border-gray-200 h-12 flex items-center">
                      {user.email || <span className="text-gray-400 italic font-normal text-sm">No especificado</span>}
                    </p>
                  )}
                </div>

                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Teléfono</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg border-2 border-yellow-300 focus:border-yellow-600 focus:ring-2 focus:ring-yellow-100 outline-none transition-all font-medium text-gray-800 bg-white"
                      placeholder="+56 9 1234 5678"
                    />
                  ) : (
                    <p className="text-lg font-bold text-gray-800 bg-white p-3 rounded-lg border border-gray-200 h-12 flex items-center">
                      {user.phone || <span className="text-gray-400 italic font-normal text-sm">No especificado</span>}
                    </p>
                  )}
                </div>

                
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Dirección</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg border-2 border-yellow-300 focus:border-yellow-600 focus:ring-2 focus:ring-yellow-100 outline-none transition-all font-medium text-gray-800 bg-white"
                      placeholder="Calle Las Abejas 123, Ciudad"
                    />
                  ) : (
                    <p className="text-lg font-bold text-gray-800 bg-white p-3 rounded-lg border border-gray-200 h-12 flex items-center">
                      {user.address || <span className="text-gray-400 italic font-normal text-sm">No especificado</span>}
                    </p>
                  )}
                </div>

              </div>
            </div>

            
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center border-t border-gray-100 pt-6">
              
              {isEditing ? (
               
                <div className="flex flex-col w-full md:flex-row gap-4">
                  <button 
                    onClick={handleSave}
                    className="w-full md:w-auto bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-yellow-700 transition-colors shadow-md uppercase tracking-wide flex-1"
                  >
                    💾 Guardar Cambios
                  </button>
                  <button 
                    onClick={handleCancel}
                    className="w-full md:w-auto bg-gray-200 text-gray-700 font-bold py-3 px-8 rounded-lg hover:bg-gray-300 transition-colors uppercase tracking-wide flex-1"
                  >
                    ❌ Cancelar
                  </button>
                </div>
              ) : (
                
                <>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="w-full md:w-auto bg-yellow-500 text-gray-900 font-black py-3 px-8 rounded-lg hover:bg-yellow-600 transition-colors shadow-md uppercase tracking-wide flex-1 md:flex-none"
                  >
                    ✏️ Editar mis datos
                  </button>
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full md:w-auto bg-white text-red-500 font-bold py-3 px-8 rounded-lg border-2 border-red-100 hover:bg-red-50 hover:border-red-200 transition-colors uppercase tracking-wide flex-1 md:flex-none"
                  >
                    🚪 Cerrar Sesión
                  </button>
                </>
              )}

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}