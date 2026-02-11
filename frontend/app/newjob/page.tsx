"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { myAppHook } from "@/context/AppProvider";
import axios from "axios";
import toast from "react-hot-toast";

interface VacancyType {
  judul: string;
  posisi: string;
  tipe_pekerjaan: 'full time' | 'part time' | 'kontrak' | 'magang';
  kandidat: number;
  masa_aktif: string;
  lokasi: string;
  deskripsi: string;
  gaji_minimum: number;
  gaji_maximum: number;
  pengalaman: 'kurang dari 1 tahun' | '1-3 tahun' | '4-6 tahun' | 'lebih dari 6 tahun';
}

const NewJob: React.FC = () => {
  const router = useRouter();
  const { isLoading, authToken } = myAppHook();
  const fileRef = React.useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState<VacancyType>({
    judul: "",
    posisi: "",
    tipe_pekerjaan: "full time",
    kandidat: 0,
    masa_aktif: "",
    lokasi: "",
    deskripsi: "",
    gaji_minimum: 0,
    gaji_maximum: 0,
    pengalaman: "kurang dari 1 tahun"
  });

  useEffect(() => {
    if (!isLoading && !authToken) {
      router.push("/auth");
    }
  }, [authToken, isLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["kandidat", "gaji_minimum", "gaji_maximum"].includes(name) ? Number(value) : value,
    }));
  };

  if (isLoading || !authToken) return null;

  const handleFormSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try{
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/Vacancy`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json"
        }
      })

      if(response.data.status){
        toast.success(response.data.message)
        setFormData({
          judul: "",
          posisi: "",
          tipe_pekerjaan: "full time",
          kandidat: 0,
          masa_aktif: "",
          lokasi: "",
          deskripsi: "",
          gaji_minimum: 0,
          gaji_maximum: 0,
          pengalaman: "kurang dari 1 tahun"
        })
        if(fileRef.current){
          fileRef.current.value = "";
        }
      }
      
      console.log(response);
    } catch(error){
      console.log(error)
    }
  }
  
  return (
    <div className="bg-white text-gray-800 font-sans min-h-screen">
      <header className="bg-[#0b1120] text-white py-12 px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold">Buat lowongan pekerjaan</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto py-12 px-8">
        <form className="space-y-8" onSubmit={handleFormSubmit}>
          <div>
            <label className="block text-sm font-medium mb-2">Judul lowongan *</label>
            <input name="judul" value={formData.judul} onChange={handleChange} type="text" placeholder="Masukkan judul" className="w-full border rounded-md p-3 text-sm outline-none focus:border-blue-500" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Posisi *</label>
            <input name="posisi" value={formData.posisi} onChange={handleChange} type="text" placeholder="Masukkan posisi" className="w-full border rounded-md p-3 text-sm outline-none focus:border-blue-500" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tipe Pekerjaan *</label>
            <select name="tipe_pekerjaan" value={formData.tipe_pekerjaan} onChange={handleChange} className="w-full border rounded-md p-3 text-sm outline-none bg-white">
              <option value="full time">Full Time</option>
              <option value="part time">Part Time</option>
              <option value="kontrak">Kontrak</option>
              <option value="magang">Magang</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Kandidat *</label>
              <input name="kandidat" value={formData.kandidat} onChange={handleChange} type="number" className="w-full border rounded-md p-3 text-sm outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Aktif hingga *</label>
              <input name="masa_aktif" value={formData.masa_aktif} onChange={handleChange} type="date" className="w-full border rounded-md p-3 text-sm outline-none" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Lokasi *</label>
            <input name="lokasi" value={formData.lokasi} onChange={handleChange} type="text" placeholder="Lokasi" className="w-full border rounded-md p-3 text-sm outline-none" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Deskripsi *</label>
            <textarea name="deskripsi" value={formData.deskripsi} onChange={handleChange} rows={6} className="w-full border rounded-md p-3 text-sm outline-none resize-none" required />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Gaji Min (Rp)</label>
              <input name="gaji_minimum" value={formData.gaji_minimum} onChange={handleChange} type="number" className="w-full border rounded-md p-3 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Gaji Max (Rp)</label>
              <input name="gaji_maximum" value={formData.gaji_maximum} onChange={handleChange} type="number" className="w-full border rounded-md p-3 text-sm outline-none" />
            </div>
          </div>
          <div className="flex gap-4 pt-6">
            <button type="submit" className="bg-[#2d3e50] text-white px-8 py-2.5 rounded text-sm font-medium hover:bg-slate-800 transition border-none cursor-pointer">Simpan</button>
            <button type="button" onClick={() => router.push('/dashboard')} className="border border-gray-300 px-8 py-2.5 rounded text-sm font-medium text-gray-600 hover:bg-gray-50 transition bg-white cursor-pointer">Batal</button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default NewJob;