"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { myAppHook } from "@/context/AppProvider";
import axios from "axios";

const DetailVacancy = () => {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const { authToken, isLoading } = myAppHook();
  
  const [vacancy, setVacancy] = useState<any>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!isLoading && !authToken) {
      router.push("/auth");
    }

    const fetchDetail = async () => {
      if (!id || !authToken) return;
      try {
        setFetching(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/Vacancy/${id}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const targetData = response.data.vacancy || response.data.data || response.data;
        if (targetData) setVacancy(targetData);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setFetching(false);
      }
    };

    if (authToken && id) fetchDetail();
  }, [authToken, isLoading, id, router]);

  if (isLoading || fetching) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!vacancy) return null;

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 pb-20">
      <main className="max-w-4xl mx-auto px-6 mt-10">
        <div className="flex items-start gap-6 mb-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900 leading-tight m-0 mb-1">
              {vacancy.judul}
            </h1>
            <p className="text-gray-500 text-sm font-medium mb-3">Sektor Bisnis: Technology</p>
            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><i className="fas fa-map-marker-alt opacity-60"></i> {vacancy.lokasi}</span>
              <span className="flex items-center gap-1.5"><i className="fas fa-users opacity-60"></i> {vacancy.kandidat} Karyawan</span>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-100">
            {vacancy.tipe_pekerjaan}
          </span>
        </div>
        <br></br>

        <div className="space-y-12">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Job Description</h2>
            <div className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
              {vacancy.deskripsi || "Deskripsi pekerjaan belum tersedia."}
            </div>
          </section>

          <section className="pt-8 border-t border-gray-100">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Informasi Tambahan</h2>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Pengalaman bekerja</p>
                <p className="text-sm font-semibold text-slate-800 m-0">{vacancy.pengalaman}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Kandidat yang dibutuhkan</p>
                <p className="text-sm font-semibold text-slate-800 m-0">{vacancy.kandidat} kandidat</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Gaji Maksimum</p>
                <p className="text-sm font-semibold text-slate-800 m-0">Rp {Number(vacancy.gaji_maximum).toLocaleString('id-ID')}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Lokasi</p>
                <p className="text-sm font-semibold text-slate-800 m-0">{vacancy.lokasi}</p>
              </div>
            </div>
          </section>
        </div>

        <br></br>
        <br></br>
        <br></br>
        <footer className="mt-24 pt-10 border-t border-gray-100">
          <img src="https://dicoding-web-img.sgp1.cdn.digitaloceanspaces.com/original/commons/new-ui-logo.png" alt="Dicoding" className="h-6 opacity-80 mb-6" />
          <div className="text-xs text-gray-400 leading-relaxed">
            <p className="m-0">Dicoding Space</p>
            <p className="m-0">Jl. Batik Kumeli No.50, Sukaluyu, Kec. Cibeunying Kaler, Kota Bandung, Jawa Barat 40123</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default DetailVacancy;