'use client';
import React from 'react';
import Image from "next/image";
import Footer from '../../../elements/Footer';
import Link from "next/link";


const Accueil = () => {
  return (
    <div className="flex flex-col min-h-screen"> 
  <main className="bg-gradient-to-br from-blue-50 via-white to-blue-100 pb-0">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="md:w-1/2 flex flex-col justify-center space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-900 leading-tight">
                Patro St Charles <span className="text-blue-600">Lwanga</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                Bienvenue sur le site web dédié à la gestion des activités du Patro St Charles Lwanga. 
                Cet outils nous aide au suivi et à l'analyse des activités ainsi que des membres du patro.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a href="#objectifs">
  <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
    Nos Objectifs
  </button>
</a>
<Link href="/Guide">
  <button className="px-6 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-medium rounded-lg transition-all duration-300">
    Guide d&apos;utilisation
  </button>
</Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-blue-200 rounded-2xl rotate-3 opacity-60"></div>
                <div className="absolute -inset-2 bg-blue-100 rounded-2xl -rotate-3 opacity-60"></div>
                <Image 
                  src="/im_patro.jpg" 
                  alt="Patro Logo" 
                  width={400} 
                  height={400}
                  className="relative hover:scale-105 transition-transform duration-300 rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section Objectifs */}
        <section id="objectifs" className="container mx-auto px-4 py-12 md:py-16"> 
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Nos Objectifs</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez les principales fonctionnalités de notre plateforme de gestion
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-3">Suivi des Enfants</h3>
              <p className="text-gray-600">Organisez et suivez toutes les activités du patro efficacement avec nos outils dédiés.</p>
            </div>
            
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-3">Suivi des Membres</h3>
              <p className="text-gray-600">Gérez les informations des membres et leur participation aux différentes activités.</p>
            </div>
            
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-3">Rapports & Statistiques</h3>
              <p className="text-gray-600">Accédez à des rapports détaillés et des analyses pour mieux planifier vos activités.</p>
            </div>
          </div>
        </section>

        {/* Section Logo RSV + Description */}
  <section className="container mx-auto px-4 pt-12 md:pt-16 pb-0 md:pb-0 flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/3 flex justify-center">
            <Image
              src="/logo_RSV.jpg"
              alt="Logo RSV"
              width={400}
              height={400}
              className="rounded-2xl shadow-lg bg-white p-4"
            />
          </div>
          <div className="md:w-2/3 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-0">Un centre des RSV</h2>
            <p className="text-lg text-gray-700 max-w-2xl mb-0">
              Le patro St Charles Lwanga est une oeuvre des <span className="font-semibold text-blue-600"> Religieux de Saint Vincent de Paul (RSV)</span>. 
              Ce centre a été mis en place pour accueillir et éduquer les enfants selon les valeurs chrétiennes tout en s'amusant.
            </p>
          </div>
        </section>

        
      </main>
<Footer /> 
    </div>
  );
};

export default Accueil;
