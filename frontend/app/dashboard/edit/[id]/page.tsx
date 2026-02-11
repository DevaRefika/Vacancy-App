"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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

const EditJob: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id; // Mengambil ID dari URL rute [id]
  const { isLoading, authToken } = myAppHook();
  
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

  const [fetchingData, setFetchingData] = useState(true);

  useEffect(() => {
    if (!isLoading && !authToken) {
      router.push("/auth");
    }

    const fetchDetail = async () => {
      if (!id || !authToken) return;
      try {
        setFetchingData(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/Vacancy/${id}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        
        const data = response.data.vacancy || response.data.data || response.data;

        if (data) {
          setFormData({
            judul: data.judul || "",
            posisi: data.posisi || "",
            tipe_pekerjaan: data.tipe_pekerjaan || "full time",
            kandidat: Number(data.kandidat) || 0,
            masa_aktif: data.masa_aktif ? data.masa_aktif.split("T")[0] : "", 
            lokasi: data.lokasi || "",
            deskripsi: data.deskripsi || "",
            gaji_minimum: Number(data.gaji_minimum) || 0,
            gaji_maximum: Number(data.gaji_maximum) || 0,
            pengalaman: data.pengalaman || "kurang dari 1 tahun"
          });
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        toast.error("Gagal memuat data lowongan");
      } finally {
        setFetchingData(false);
      }
    };

    fetchDetail();
  }, [authToken, isLoading, id, router]);

  // 2. Handler Perubahan Input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["kandidat", "gaji_minimum", "gaji_maximum"].includes(name) 
        ? (Number(value) || 0) 
        : value,
    }));
  };

  // 3. Submit Update ke Laravel
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const loadToast = toast.loading("Memperbarui lowongan...");
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/Vacancy/${id}`, 
        formData, 
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        }
      );

      if (response.data.status) {
        toast.success("Lowongan berhasil diperbarui!", { id: loadToast });
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal memperbarui data", { id: loadToast });
    }
  };

  if (isLoading || fetchingData) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500 italic text-sm">Menyiapkan data untuk Anda...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 text-gray-800 font-sans min-h-screen pb-20">
      <header className="bg-[#0b1120] text-white py-14 px-8 mb-10 shadow-md">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-blue-400 text-sm mb-2 cursor-pointer hover:text-blue-300" onClick={() => router.back()}>
             <i className="fas fa-arrow-left"></i> Kembali
          </div>
          <h1 className="text-3xl font-bold">Edit Lowongan Pekerjaan</h1>
          <p className="text-gray-400 mt-2">ID Lowongan: #{id}</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-8">
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <form className="space-y-6" onSubmit={handleFormSubmit}>
            
            <section>
              <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">Informasi Utama</h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Judul Lowongan *</label>
                  <input name="judul" value={formData.judul} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Posisi Spesifik *</label>
                  <input name="posisi" value={formData.posisi} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition" required />
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Tipe Pekerjaan *</label>
                <select name="tipe_pekerjaan" value={formData.tipe_pekerjaan} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option value="full time">Full Time</option>
                  <option value="part time">Part Time</option>
                  <option value="kontrak">Kontrak</option>
                  <option value="magang">Magang</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Pengalaman Dibutuhkan *</label>
                <select name="pengalaman" value={formData.pengalaman} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option value="kurang dari 1 tahun">Kurang dari 1 tahun</option>
                  <option value="1-3 tahun">1-3 tahun</option>
                  <option value="4-6 tahun">4-6 tahun</option>
                  <option value="lebih dari 6 tahun">Lebih dari 6 tahun</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Jumlah Kandidat *</label>
                <input name="kandidat" value={formData.kandidat} onChange={handleChange} type="number" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Batas Akhir (Masa Aktif) *</label>
                <input name="masa_aktif" value={formData.masa_aktif} onChange={handleChange} type="date" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
            </div>

            <section className="pt-4">
              <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">Lokasi & Deskripsi</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Lokasi Penempatan *</label>
                  <input name="lokasi" value={formData.lokasi} onChange={handleChange} type="text" placeholder="Contoh: Jakarta Selatan / Remote" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Deskripsi Pekerjaan *</label>
                  <textarea name="deskripsi" value={formData.deskripsi} onChange={handleChange} rows={6} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Tuliskan kualifikasi dan tanggung jawab..." required />
                </div>
              </div>
            </section>

            <section className="pt-4">
              <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">Rentang Gaji (Opsional)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Gaji Minimum (Rp)</label>
                  <input name="gaji_minimum" value={formData.gaji_minimum} onChange={handleChange} type="number" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Gaji Maksimum (Rp)</label>
                  <input name="gaji_maximum" value={formData.gaji_maximum} onChange={handleChange} type="number" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
            </section>

            <div className="flex flex-col sm:flex-row gap-4 pt-10">
              <button type="submit" className="flex-1 bg-[#2d3e50] text-white px-8 py-3 rounded-lg text-sm font-bold hover:bg-slate-800 transition shadow-lg border-none cursor-pointer">
                Simpan Perubahan
              </button>
              <button type="button" onClick={() => router.push('/dashboard')} className="flex-1 border border-gray-300 px-8 py-3 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 transition bg-white cursor-pointer">
                Batal & Kembali
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
};

export default EditJob;