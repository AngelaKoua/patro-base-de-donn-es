'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_URL } from '@/lib/api';

const schema = yup.object().shape({
  nom: yup.string().required('Le nom est requis'),
  prenom: yup.string().required('Le prénom est requis'),
  telephone: yup.string().required('Le téléphone est requis'),
  email: yup.string().email('Email invalide').required('L\'email est requis'),
  mot_de_passe: yup.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères').required('Le mot de passe est requis'),
});

type FormData = yup.InferType<typeof schema>;

export default function InscriptionForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.post(`${API_URL}/api/signup`, data);
      if (response.data.Error === true) {
        alert(response.data.Message);
        return;
      } else {
        alert('Inscription réussie! Veuillez vous connecter.');
        router.push('/Connexion');
      }
    } catch (error) {
      alert('Erreur lors de l\'inscription : ' + error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Section image à gauche */}
          <div className="lg:w-1/2 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-400/80 to-blue-500/80 z-10"></div>
            <div 
              className="h-full w-full bg-cover bg-center min-h-[500px] lg:min-h-[700px]"
              style={{ 
                backgroundImage: "url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')" 
              }}
            ></div>
            
            <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white p-8">
              <div className="text-center space-y-6 max-w-md">
                <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-4">
                    Bienvenue sur l'application de gestion du patro
                  </h1>
                  <p className="text-blue-100 text-lg leading-relaxed">
                    Rejoignez-nous pour accéder à tous les outils de gestion de votre patro
                  </p>
                </div>
                <div className="pt-4 border-t border-white/20">
                  <p className="text-sm text-blue-100">
                    Déjà inscrit? <Link href="/Connexion" className="font-semibold underline">Connectez-vous ici</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section formulaire à droite */}
          <div className="lg:w-1/2 p-8 lg:p-12">
            <div className="max-w-md w-full mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Inscription</h2>
                <p className="text-gray-600">Créez votre compte pour accéder à l'application</p>
              </div>
              
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nom</label>
                    <input
                      type="text"
                      {...register('nom')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Votre nom"
                    />
                    <p className="text-sm text-red-500 mt-1">{errors.nom?.message}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Prénom</label>
                    <input
                      type="text"
                      {...register('prenom')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Votre prénom"
                    />
                    <p className="text-sm text-red-500 mt-1">{errors.prenom?.message}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    {...register('telephone')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Votre numéro de téléphone"
                  />
                  <p className="text-sm text-red-500 mt-1">{errors.telephone?.message}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Votre email"
                  />
                  <p className="text-sm text-red-500 mt-1">{errors.email?.message}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Mot de passe</label>
                  <input
                    type="password"
                    {...register('mot_de_passe')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Votre mot de passe"
                  />
                  <p className="text-sm text-red-500 mt-1">{errors.mot_de_passe?.message}</p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none shadow-md"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Inscription en cours...</span>
                    </div>
                  ) : "S'inscrire"}
                </button>
              </form>
              
              <div className="mt-6 text-center text-sm text-gray-600">
                Déjà inscrit?{' '}
                <Link href="/Connexion" className="text-sky-600 hover:text-sky-700 font-semibold transition-colors">
                  Se connecter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}