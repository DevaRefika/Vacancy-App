"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { myAppHook } from "@/context/AppProvider";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

interface VacancyType {
  id?: number;
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
  created_at?: string;
}

const Dashboard: React.FC = () => {
  const { isLoading, authToken } = myAppHook();
  const router = useRouter();
  const [vacancies, setVacancies] = useState<VacancyType[]>([]);

  // 1. Cek Autentikasi & Ambil Data
  useEffect(() => {
    if (!isLoading && !authToken) {
      router.push("/auth");
    }
    if (authToken) {
      fetchAllProducts();
    }
  }, [authToken, isLoading, router]);

  // 2. Fungsi Mengambil Data dari API
  const fetchAllProducts = async () => {
    if (!authToken) return;

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/Vacancy`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      const dataFromApi = response.data.vacancy || [];
      setVacancies(dataFromApi);
      
    } catch (error: any) {
      console.error("Error fetching:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        toast.error("Sesi telah habis, silakan login ulang");
        router.push("/auth");
      }
    }
  };

  // 3. Fungsi Hapus Data
  const handleDelete = async (id?: number) => {
    if (!id) return;

    const result = await Swal.fire({
      title: "Hapus lowongan?",
      text: "Data yang dihapus tidak bisa dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33", // Warna merah untuk konfirmasi hapus
      cancelButtonColor: "#2d3e50",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal"
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/Vacancy/${id}`, {
          headers: { 
            Authorization: `Bearer ${authToken}`,
            "Accept": "application/json"
          }
        });

        if (response.status === 200 || response.data.status) {
          toast.success("Lowongan berhasil dihapus");
          
          setVacancies((prev) => prev.filter((item) => item.id !== id));
        }
      } catch (error: any) {
        console.error("Delete Error:", error.response?.data || error.message);
        toast.error(error.response?.data?.message || "Gagal menghapus data");
      }
    }
  };

  if (isLoading || !authToken) return null;

  return (
    <div className="bg-gray-50 text-gray-800 font-sans min-h-screen">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r pt-8 hidden md:block">
          <div className="px-6 mb-8 text-2xl font-bold text-gray-700">Jobs</div>
          <nav>
            <Link href="/dashboard" className="flex items-center gap-3 px-6 py-3 bg-gray-100 text-gray-900 border-r-4 border-black font-medium no-underline">
              <i className="fas fa-briefcase text-sm"></i> Lowongan Saya
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 className="text-2xl font-bold">Lowongan Saya</h1>
            <Link href="/newjob" className="no-underline">
              <button className="bg-[#2d3e50] text-white px-5 py-2.5 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-slate-700 transition shadow-sm border-none cursor-pointer">
                <i className="fas fa-plus"></i> Buat lowongan
              </button>
            </Link>
          </div>

          <div className="space-y-4">
            {vacancies.length > 0 ? (
              vacancies.map((singleVacancy) => (
                <div key={singleVacancy.id} className="bg-white border rounded-lg p-6 flex items-start gap-5 hover:shadow-sm transition">
                  {/* Icon Bulat Inisial */}
                  <div className="w-14 h-14 bg-[#2d3e50] rounded-md flex items-center justify-center text-white font-bold text-xl flex-shrink-0 uppercase">
                    {singleVacancy.judul.charAt(0)}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 m-0">{singleVacancy.judul}</h3>
                    
                    {/* Meta Data */}
                    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-2">
                        <i className="fas fa-briefcase text-[10px]"></i> {singleVacancy.posisi}
                      </span>
                      <span className="flex items-center gap-2">
                        <i className="fas fa-upload text-[10px]"></i>
                        Dibuat: {singleVacancy.created_at ? new Date(singleVacancy.created_at).toLocaleDateString('id-ID') : '-'}
                      </span>
                      <span className="flex items-center gap-2">
                        <i className="far fa-clock text-[10px]"></i>
                        Aktif hingga: {new Date(singleVacancy.masa_aktif).toLocaleDateString('id-ID')}
                      </span>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex gap-3 mt-4">
                    <Link href={`dashboard/edit/${singleVacancy.id}`} className="no-underline">
                      <button className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded text-xs font-medium flex items-center gap-2 hover:bg-blue-100 transition border-none cursor-pointer">
                        <i className="fas fa-edit text-[10px]"></i> Edit Lowongan
                      </button>
                    </Link>

                    <button 
                      onClick={() => handleDelete(singleVacancy.id)}
                      className="bg-red-50 text-red-600 px-4 py-1.5 rounded text-xs font-medium flex items-center gap-2 hover:bg-red-100 transition border-none cursor-pointer"
                    >
                      <i className="fas fa-trash-alt text-[10px]"></i> Hapus Lowongan
                    </button>
                  </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white border border-dashed border-gray-300 rounded-lg py-16 text-center text-gray-400">
                <i className="fas fa-folder-open text-4xl mb-3 block"></i>
                Belum ada lowongan yang dipublikasikan.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;