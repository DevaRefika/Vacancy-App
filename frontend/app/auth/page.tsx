"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { myAppHook } from "@/context/AppProvider";
import { useRouter } from "next/navigation";

interface formData {
    name?: string,
    email: string,
    password: string,
    confirmpassword?: string
}

const Auth: React.FC = () => {
    const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);
    const [formdata, setFormData] = useState<formData>({
        name: "",
        email: "",
        password: "",
        confirmpassword: ""
    })

    const router = useRouter();
    
    const {login, register, authToken, isLoading} = myAppHook()

    useEffect(() => {
        if(authToken){
            router.push("/")
            return
        }
    },  [authToken, isLoading])

    const handleOnChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formdata,
            [event.target.name]: event.target.value
        })
    }

    const handleFormSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try{
            await login(formdata.email, formdata.password)
        } catch(error) {
            console.log(`Login gagal ${error}`)
        }
    }

    const handleFormSubmit2 = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (formdata.password !== formdata.confirmpassword) {
            alert("Password tidak cocok!");
            return;
        }
        try{
            await register(formdata.name!, formdata.email, formdata.password, formdata.confirmpassword!)
        } catch(error) {
            console.log(`Daftar gagal ${error}`)
        }
    }

    return (
        <div className="bg-white text-gray-800 font-sans min-h-screen flex flex-col relative">
            <header className="bg-[#0b1120] text-white py-16 px-8 text-center">
                <div className="max-w-md mx-auto">
                    <h1 className="text-3xl font-bold mb-4">Masuk ke Dicoding Jobs</h1>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Gunakan akun Dicoding kamu untuk mulai membuat & mengelola lowongan.
                    </p>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center py-12 px-8">
                <div className="w-full max-w-md bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
                    <form onSubmit={handleFormSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Alamat Email</label>
                            <input 
                                type="email" 
                                name="email" 
                                value={formdata.email} 
                                onChange={handleOnChangeInput} 
                                placeholder="email@contoh.com" 
                                className="w-full border border-gray-300 rounded-md py-3 px-4 text-sm focus:ring-1 focus:ring-blue-500 outline-none" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Password</label>
                            <input 
                                type="password" 
                                name="password" 
                                value={formdata.password} 
                                onChange={handleOnChangeInput} 
                                placeholder="Masukkan password" 
                                className="w-full border border-gray-300 rounded-md py-3 px-4 text-sm focus:ring-1 focus:ring-blue-500 outline-none" 
                                required 
                            />
                        </div>
                        <button type="submit" className="w-full bg-[#2d3e50] text-white py-3 rounded-md text-sm font-semibold hover:bg-[#1e293b] transition">
                            Masuk Sekarang
                        </button>
                        <p className="text-center text-sm text-gray-500 mt-6">
                            Belum punya akun?{' '}
                            <button
                                type="button"
                                onClick={() => setIsRegisterOpen(true)}
                                className="text-blue-600 font-semibold hover:underline border-none bg-transparent cursor-pointer"
                            >
                                Daftar Gratis
                            </button>
                        </p>
                    </form>
                </div>
            </main>

            {/* --- POP-UP MODAL REGISTER --- */}
            {isRegisterOpen && (
                <div className="fixed inset-0 z-[99] flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsRegisterOpen(false)}
                    ></div>

                    <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-8 mx-4 z-10">
                        <button
                            onClick={() => setIsRegisterOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                        >
                            <i className="fas fa-times text-xl"></i>
                        </button>

                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Daftar Akun</h2>
                        <p className="text-sm text-gray-500 mb-6">Lengkapi data untuk bergabung dengan kami.</p>
                        <form onSubmit={handleFormSubmit2} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
                                <input type="text" name="name" value={formdata.name} onChange={handleOnChangeInput} placeholder="Nama Anda" className="w-full border border-gray-300 rounded-md py-2.5 px-4 text-sm focus:ring-1 focus:ring-blue-500 outline-none" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input type="email" name="email" value={formdata.email} onChange={handleOnChangeInput} placeholder="nama@email.com" className="w-full border border-gray-300 rounded-md py-2.5 px-4 text-sm focus:ring-1 focus:ring-blue-500 outline-none" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Password</label>
                                <input type="password" name="password" value={formdata.password} onChange={handleOnChangeInput} placeholder="Buat password" className="w-full border border-gray-300 rounded-md py-2.5 px-4 text-sm focus:ring-1 focus:ring-blue-500 outline-none" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Konfirmasi Password</label>
                                <input type="password" name="confirmpassword" value={formdata.confirmpassword} onChange={handleOnChangeInput} placeholder="Ulangi password" className="w-full border border-gray-300 rounded-md py-2.5 px-4 text-sm focus:ring-1 focus:ring-blue-500 outline-none" required />
                            </div>

                            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-md text-sm font-semibold hover:bg-blue-700 transition mt-4 shadow-md">
                                Daftar Sekarang
                            </button>

                            <p className="text-center text-xs text-gray-500 mt-4">
                                Sudah punya akun?{' '}
                                <button type="button" onClick={() => setIsRegisterOpen(false)} className="text-blue-600 font-bold bg-transparent">
                                    Masuk di sini
                                </button>
                            </p>
                        </form>
                    </div>
                </div>
            )}

            <footer className="max-w-md mx-auto py-8 px-8 border-t border-gray-100 w-full mt-auto text-center">
                <Image src="https://dicoding-web-img.sgp1.cdn.digitaloceanspaces.com/original/commons/new-ui-logo.png" alt="Logo" width={100} height={25} className="mb-4 opacity-50 mx-auto" />
                <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">© 2026 DICODING INDONESIA</p>
            </footer>
        </div>
    );
};

export default Auth;