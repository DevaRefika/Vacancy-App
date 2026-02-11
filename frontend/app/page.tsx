"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { myAppHook } from "@/context/AppProvider";
import { useRouter } from "next/navigation";
import axios from "axios";

interface VacancyType {
  id: number;
  judul: string;
  posisi: string;
  tipe_pekerjaan: string;
  lokasi: string;
  pengalaman: string;
  masa_aktif: string;
  created_at: string;
}

export default function Home() {
  const { isLoading, authToken, user } = myAppHook();
  const router = useRouter();
  
  const [vacancies, setVacancies] = useState<VacancyType[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isLoading && !authToken) {
      router.push("/auth");
    }
    if (authToken) {
      fetchAllVacancies();
    }
  }, [authToken, isLoading, router]);

  const fetchAllVacancies = async () => {
    try {
      setIsFetching(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/Vacancy/all`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setVacancies(response.data.vacancy || []);
    } catch (error) {
      console.error("Gagal mengambil semua data lowongan:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const filteredVacancies = vacancies.filter((v) =>
    v.judul.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading || !authToken) return null;

  return (
    <div className="bg-gray-50 text-gray-800 font-sans min-h-screen">
      <header className="bg-[#0b1120] text-white py-16 px-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-blue-400 font-semibold mb-2 tracking-wider">DICODING JOBS</p>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">Temukan lowongan yang cocok</h1>
              <p className="text-gray-400 mt-2">Jelajahi berbagai peluang karir dari seluruh mitra kami.</p>
            </div>
            <div className="hidden md:flex items-center gap-3 bg-gray-800 rounded-full px-4 py-2 border border-gray-700 shadow-lg">
              <span className="text-sm font-medium">{user?.name || "User"}</span>
              <Image 
                src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`} 
                width={32}
                height={32}
                className="rounded-full border border-white" 
                alt="avatar" 
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-10 px-8 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">Daftar Pekerjaan Global</h2>
            <span className="text-xs bg-blue-100 px-3 py-1 rounded-full text-blue-600 font-bold uppercase">
               {filteredVacancies.length} Lowongan Tersedia
            </span>
          </div>
          
          <div className="space-y-4">
            {isFetching ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredVacancies.length > 0 ? (
              filteredVacancies.map((v) => (
                <Link key={v.id} href={`/detail-vacancy/${v.id}`} className="block group no-underline">
                  <div className="border border-gray-200 rounded-xl p-6 flex justify-between items-center hover:shadow-xl hover:border-blue-400 transition-all bg-white cursor-pointer relative overflow-hidden">
                    <div className="flex gap-5">
                      <div className="w-16 h-16 bg-[#2d3e50] rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-2xl uppercase shadow-inner">
                        {v.judul.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-xl group-hover:text-blue-600 transition m-0 text-gray-900 leading-tight">
                          {v.judul}
                        </h3>
                        <div className="text-sm text-gray-500 mt-2 space-y-1">
                          {/* Info Tanggal Dibuat */}
                          <p className="m-0 text-blue-500 font-medium text-xs">
                            Diposting pada: {new Date(v.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                          <p className="m-0 text-gray-600 font-medium">{v.posisi} • {v.tipe_pekerjaan}</p>
                          <p className="m-0 text-gray-400 text-xs flex items-center gap-1">
                            <i className="fas fa-map-marker-alt"></i> {v.lokasi} • <i className="fas fa-briefcase"></i> {v.pengalaman}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-xs hidden sm:block">
                      <p className="font-bold text-red-500 m-0 uppercase tracking-tighter">Batas Lamaran:</p>
                      <p className="m-0 font-medium text-slate-700">
                        {new Date(v.masa_aktif).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-20 bg-white border-2 border-dashed border-gray-200 rounded-2xl">
                <p className="text-gray-500 italic">Tidak ada lowongan yang sesuai.</p>
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/3">
          <div className="sticky top-24 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Pencarian Cepat</h3>
            <div className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari posisi atau judul..." 
                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm transition-all"
              />
              <span className="absolute left-4 top-3.5 text-gray-400">
                 <i className="fas fa-search text-sm"></i>
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}