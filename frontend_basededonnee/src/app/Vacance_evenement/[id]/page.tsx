
'use client';

import Image from "next/image";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import EventMediaUploader from '../../../components/EventMediaUploader';

interface Evenement {
  id: number;
  annee: number;
  evenement: string;
  date_debut: string;
  date_fin: string;
  cible: string;
}

interface DetailEvenement {
  lieu: string;
  description: string;
  objectif: string;
  nb_patronnes_attendus: number;
  nb_patronnes_presents: number;
  taux_participation_patronnes: number;
  nb_animateurs_attendus: number;
  nb_animateurs_presents: number;
  taux_participation_animateurs: number;
  partenaires: string;
  autres_personnes_ressources: string;
  financement: string;
  aspects_positifs: string;
  aspects_negatifs: string;
  suggestions: string;
  photos: string[];
  video: string;
}

const initialDetail: DetailEvenement = {
  lieu: '',
  description: '',
  objectif: '',
  nb_patronnes_attendus: 0,
  nb_patronnes_presents: 0,
  taux_participation_patronnes: 0,
  nb_animateurs_attendus: 0,
  nb_animateurs_presents: 0,
  taux_participation_animateurs: 0,
  partenaires: '',
  autres_personnes_ressources: '',
  financement: '',
  aspects_positifs: '',
  aspects_negatifs: '',
  suggestions: '',
  photos: Array(10).fill(''),
  video: '',
};

export default function VacanceEvenementDetailPage() {
  const router = useRouter();
  const params = useParams();
  const evenementId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [evenement, setEvenement] = useState<Evenement | null>(null);
  const [detail, setDetail] = useState<DetailEvenement>(initialDetail);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [modalPhoto, setModalPhoto] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupère les infos de base et détails de l'évènement vacances
        const evRes = await axios.get(`http://localhost:4400/api/vacance-evenement/${params.id}`);
        if (evRes.data.success) {
          setEvenement(evRes.data.evenement);

          if (evRes.data.detail) {
            // Mappe photo1..photo10 en tableau photos[]
            const photos = [];
            for (let i = 1; i <= 10; i++) {
              const val = evRes.data.detail[`photo${i}`];
              photos.push(val || '');
            }
            setDetail({
              ...initialDetail,
              ...evRes.data.detail,
              photos,
              video: evRes.data.detail.video || '',
            });
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        alert("Une erreur est survenue lors du chargement de l'événement. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchData();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setDetail(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handlePhotoChange = async (idx: number, file: File | null) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('evenement_id', params.id as string);
    formData.append('index', idx.toString());
    const res = await axios.post('http://localhost:4400/api/upload-photo-vacance-evenement', formData);
    if (res.data.success && res.data.photoUrl) {
      // Mise à jour immédiate du state pour affichage instantané
      setDetail(prev => {
        const newPhotos = [...prev.photos];
        newPhotos[idx] = res.data.photoUrl;
        return { ...prev, photos: newPhotos };
      });
      // Optionnel : recharger les détails complets en arrière-plan pour garder la cohérence
      // const detRes = await axios.get(`http://localhost:4400/api/detail-vacance-evenement/${params.id}`);
      // if (detRes.data.success && detRes.data.detail) {
      //   const photos = [];
      //   for (let i = 1; i <= 10; i++) {
      //     const val = detRes.data.detail[`photo${i}`];
      //     photos.push(val || '');
      //   }
      //   setDetail(prev => ({
      //     ...prev,
      //     ...detRes.data.detail,
      //     photos,
      //     video: detRes.data.detail.video || '',
      //   }));
      // }
    }
  };

  // Upload vidéo (fichier, max 200 Mo)
  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) return;
    const formData = new FormData();
    formData.append('video', file);
    try {
      const res = await axios.post('http://localhost:4400/api/upload-video-evenement', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success && res.data.videoUrl) {
        setDetail(prev => ({ ...prev, video: res.data.videoUrl }));
      }
    } catch { }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const evenementId = Array.isArray(params.id) ? params.id[0] : params.id;
    try {
      // On envoie photo1 à photo10 et video
      const payload = {
        evenement_id: evenementId,
        ...detail,
        photo1: detail.photos[0],
        photo2: detail.photos[1],
        photo3: detail.photos[2],
        photo4: detail.photos[3],
        photo5: detail.photos[4],
        photo6: detail.photos[5],
        photo7: detail.photos[6],
        photo8: detail.photos[7],
        photo9: detail.photos[8],
        photo10: detail.photos[9],
        video: detail.video,
      };
      const response = await axios.post('http://localhost:4400/api/detail-vacance-evenement', payload);
      if (response.data.success) {
        setShowForm(false);
        alert('Détails enregistrés avec succès');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout des détails:', error);
      const err = error as { response?: { data?: { message?: string; error?: string } }; message?: string };
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || "Erreur inconnue";
      alert(`Erreur lors de l'ajout des détails: ${errorMessage}`);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-lg font-semibold">Chargement...</div>;
  }

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 via-sky-25 to-blue-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => router.back()}
          className="bg-gray-500 text-white hover:bg-gray-600 px-6 py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-3 font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Retour
        </button>
        <button
          onClick={() => setShowForm(true)}
          className="bg-sky-500 text-white hover:bg-sky-600 px-6 py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-3 font-medium"
        >
          {detail.description ? 'Modifier les détails' : 'Ajouter des détails'}
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100/50 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center mb-8">
            <div className="w-2 h-12 bg-gradient-to-b from-sky-500 to-blue-600 rounded-full mr-4"></div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-700 to-blue-800 bg-clip-text text-transparent">
              Détails de l&apos;évènement - {evenement?.evenement}
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CardSection title="Informations de base">
              <InfoField label="Année" value={evenement?.annee} />
              <InfoField label="Nom" value={evenement?.evenement} />
              <InfoField label="Date début" value={evenement?.date_debut} />
              <InfoField label="Date fin" value={evenement?.date_fin} />
              <InfoField label="Cible" value={evenement?.cible} />
              <InfoField label="ID" value={evenement?.id} />
              <InfoField label="Lieu" value={detail.lieu} />
            </CardSection>
            <CardSection title="Détails de l'évènement">
              <InfoField label="Description" value={detail.description} />
              <InfoField label="Objectif" value={detail.objectif} />
              <InfoField label="Patronnés attendus" value={detail.nb_patronnes_attendus} />
              <InfoField label="Patronnés présents" value={detail.nb_patronnes_presents} />
              <InfoField label="Taux participation patronnés" value={detail.taux_participation_patronnes + '%'} />
              <InfoField label="Animateurs attendus" value={detail.nb_animateurs_attendus} />
              <InfoField label="Animateurs présents" value={detail.nb_animateurs_presents} />
              <InfoField label="Taux participation animateurs" value={detail.taux_participation_animateurs + '%'} />
              <InfoField label="Partenaires" value={detail.partenaires} />
              <InfoField label="Autres personnes ressources" value={detail.autres_personnes_ressources} />
              <InfoField label="Financement" value={detail.financement} />
              <InfoField label="Aspects positifs" value={detail.aspects_positifs} />
              <InfoField label="Aspects négatifs" value={detail.aspects_negatifs} />
              <InfoField label="Suggestions" value={detail.suggestions} />
            </CardSection>
            <CardSection title="Vidéo" full>
              {detail.video ? (
                <div className="mb-2">
                  <video controls width="320" src={detail.video} />
                </div>
              ) : (
                <div className="mb-2 text-gray-400">Aucune vidéo</div>
              )}
            </CardSection>
            <CardSection title="Photos (carrousel)" full>
              <PhotoCarousel photos={detail.photos.filter(Boolean)} onPhotoClick={setModalPhoto} />
            </CardSection>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900/50 to-slate-900/60 backdrop-blur-md z-50 p-4">
          <form className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-5xl relative border border-blue-200/50 max-h-[90vh] flex flex-col overflow-hidden" onSubmit={handleSubmit}>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-400 via-sky-500 to-blue-600 px-8 py-6 relative rounded-t-3xl">
              <button type="button" onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-white/90 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200 hover:scale-110" aria-label="Fermer">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-3xl font-bold text-white text-center pr-12">✨ Modifier les détails de l&apos;évènement</h2>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-300 via-white/50 to-green-300"></div>
            </div>
            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-blue-25 to-sky-50">
              {/* Informations générales */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full mr-3"></div>
                  <h3 className="text-xl font-bold text-blue-800">📝 Informations générales</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center text-slate-700 font-medium mb-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                      Lieu
                    </label>
                    <input name="lieu" type="text" value={detail.lieu || ''} onChange={handleChange} placeholder="Lieu de l'évènement" className="w-full border-2 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl p-4 transition-all duration-200 bg-white" />
                  </div>
                  <div>
                    <label className="flex items-center text-slate-700 font-medium mb-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                      Description
                    </label>
                    <textarea name="description" value={detail.description} onChange={handleChange} placeholder="Décrivez votre évènement en détail..." className="w-full border-2 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl p-4 transition-all duration-200 resize-none hover:border-blue-300 bg-white" rows={4} />
                  </div>
                  <div>
                    <label className="flex items-center text-slate-700 font-medium mb-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      Objectif
                    </label>
                    <textarea name="objectif" value={detail.objectif} onChange={handleChange} placeholder="Quel est l'objectif principal de cet évènement ?" className="w-full border-2 border-slate-200 focus:border-green-400 focus:ring-4 focus:ring-green-100 rounded-xl p-4 transition-all duration-200 resize-none hover:border-green-300 bg-white" rows={3} />
                  </div>
                </div>
              </div>
              {/* Statistiques */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100 mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-2 h-8 bg-gradient-to-b from-pink-400 to-pink-500 rounded-full mr-3"></div>
                  <h3 className="text-xl font-bold text-pink-800">📊 Statistiques de participation</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Patronnés */}
                  <div>
                    <label className="text-blue-700 text-sm font-medium block mb-1">Patronnés attendus</label>
                    <input name="nb_patronnes_attendus" type="number" value={detail.nb_patronnes_attendus} onChange={handleChange} placeholder="0" className="w-full border-2 border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-lg p-3 transition-all duration-200 bg-white" />
                  </div>
                  <div>
                    <label className="text-blue-700 text-sm font-medium block mb-1">Patronnés présents</label>
                    <input name="nb_patronnes_presents" type="number" value={detail.nb_patronnes_presents} onChange={handleChange} placeholder="0" className="w-full border-2 border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-lg p-3 transition-all duration-200 bg-white" />
                  </div>
                  <div>
                    <label className="text-blue-700 text-sm font-medium block mb-1">Taux participation patronnés (%)</label>
                    <input name="taux_participation_patronnes" type="number" value={detail.taux_participation_patronnes} onChange={handleChange} placeholder="%" className="w-full border-2 border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-lg p-3 transition-all duration-200 bg-white" />
                  </div>
                  <div>
                    <label className="text-green-700 text-sm font-medium block mb-1">Animateurs attendus</label>
                    <input name="nb_animateurs_attendus" type="number" value={detail.nb_animateurs_attendus} onChange={handleChange} placeholder="0" className="w-full border-2 border-green-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 rounded-lg p-3 transition-all duration-200 bg-white" />
                  </div>
                  <div>
                    <label className="text-green-700 text-sm font-medium block mb-1">Animateurs présents</label>
                    <input name="nb_animateurs_presents" type="number" value={detail.nb_animateurs_presents} onChange={handleChange} placeholder="0" className="w-full border-2 border-green-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 rounded-lg p-3 transition-all duration-200 bg-white" />
                  </div>
                  <div>
                    <label className="text-green-700 text-sm font-medium block mb-1">Taux participation animateurs (%)</label>
                    <input name="taux_participation_animateurs" type="number" value={detail.taux_participation_animateurs} onChange={handleChange} placeholder="%" className="w-full border-2 border-green-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 rounded-lg p-3 transition-all duration-200 bg-white" />
                  </div>
                </div>
              </div>
              {/* Organisation & Ressources */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full mr-3"></div>
                  <h3 className="text-xl font-bold text-blue-800">Organisation & Ressources</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="flex items-center text-slate-700 font-medium mb-2">
                      <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
                      Partenaires
                    </label>
                    <input name="partenaires" type="text" value={detail.partenaires} onChange={handleChange} placeholder="Vos partenaires..." className="w-full border-2 border-slate-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 rounded-lg p-3 transition-all duration-200 bg-white hover:border-cyan-300" />
                  </div>
                  <div>
                    <label className="flex items-center text-slate-700 font-medium mb-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                      Autres personnes ressources
                    </label>
                    <input name="autres_personnes_ressources" type="text" value={detail.autres_personnes_ressources} onChange={handleChange} placeholder="Personnes ressources..." className="w-full border-2 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-lg p-3 transition-all duration-200 bg-white hover:border-blue-300" />
                  </div>
                  <div>
                    <label className="flex items-center text-slate-700 font-medium mb-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      Financement
                    </label>
                    <input name="financement" type="text" value={detail.financement} onChange={handleChange} placeholder="Sources de financement..." className="w-full border-2 border-slate-200 focus:border-green-400 focus:ring-4 focus:ring-green-100 rounded-lg p-3 transition-all duration-200 bg-white hover:border-green-300" />
                  </div>
                </div>
              </div>
              {/* Évaluation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Aspects positifs */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
                  <div className="flex items-center mb-4">
                    <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full mr-3"></div>
                    <h3 className="text-xl font-bold text-green-800">✅ Aspects positifs</h3>
                  </div>
                  <textarea name="aspects_positifs" value={detail.aspects_positifs} onChange={handleChange} placeholder="Qu'est-ce qui a bien fonctionné ?" className="w-full border-2 border-green-200 focus:border-green-400 focus:ring-4 focus:ring-green-100 rounded-xl p-4 transition-all duration-200 resize-none bg-white hover:border-green-300" rows={4} />
                </div>
                {/* Aspects négatifs */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
                  <div className="flex items-center mb-4">
                    <div className="w-2 h-8 bg-gradient-to-b from-pink-400 to-rose-500 rounded-full mr-3"></div>
                    <h3 className="text-xl font-bold text-pink-800">⚠️ Points d&#39;amélioration</h3>
                  </div>
                  <textarea name="aspects_negatifs" value={detail.aspects_negatifs} onChange={handleChange} placeholder="Que peut-on améliorer ?" className="w-full border-2 border-pink-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 rounded-xl p-4 transition-all duration-200 resize-none bg-white hover:border-pink-300" rows={4} />
                </div>
              </div>
              {/* Suggestions */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full mr-3"></div>
                  <h3 className="text-xl font-bold text-indigo-800">💡 Suggestions d&#39;amélioration</h3>
                </div>
                <textarea name="suggestions" value={detail.suggestions} onChange={handleChange} placeholder="Vos idées pour les prochains évènements..." className="w-full border-2 border-indigo-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 rounded-xl p-4 transition-all duration-200 resize-none bg-white hover:border-indigo-300" rows={3} />
              </div>
              {/* Photos + Vidéo */}
              <EventMediaUploader
                evenementId={params.id as string}
                type="vacance"
                photos={detail.photos}
                video={detail.video}
                onPhotosChange={(newPhotos) => setDetail(prev => ({ ...prev, photos: newPhotos }))}
                onVideoChange={(newVideo) => setDetail(prev => ({ ...prev, video: newVideo }))}
              />
            </div>
            {/* Footer avec bouton */}
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-8 py-6 border-t border-blue-100">
              <button type="submit" className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white px-8 py-4 rounded-2xl shadow-xl text-lg font-bold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-300">
                💾 Enregistrer les modifications
              </button>
            </div>
          </form>
        </div>
      )}

      {modalPhoto && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100]" onClick={() => setModalPhoto(null)}>
          <div className="relative max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            <img src={modalPhoto.startsWith('/uploads/') ? `http://localhost:4400${modalPhoto}` : modalPhoto} alt="Agrandissement" className="rounded-2xl max-h-[80vh] mx-auto shadow-2xl" />
            <button type="button" aria-label="Fermer" className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2" onClick={() => setModalPhoto(null)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Composants réutilisables
const InfoField = ({ label, value }: { label: string; value?: string | number }) => (
  <div className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
    <span className="text-sm font-medium text-gray-500">{label}</span>
    <p className="text-base text-gray-800">{value || '-'}</p>
  </div>
);

const CardSection = ({ title, children, full }: { title: string; children: React.ReactNode; full?: boolean }) => (
  <div className={`${full ? "col-span-2" : ""} bg-gradient-to-r from-sky-50 via-white to-rose-50 p-4 rounded-xl shadow-sm`}>
    <h2 className="text-lg font-semibold text-sky-600 mb-3">{title}</h2>
    <div className="space-y-2">{children}</div>
  </div>
);

const PhotoCarousel = ({ photos, onPhotoClick }: { photos: string[], onPhotoClick?: (url: string) => void }) => {
  const validPhotos = photos.filter(photo => photo && (photo.startsWith('/uploads/') || photo.startsWith('http')));
  const [current, setCurrent] = useState(0);

  if (validPhotos.length === 0) {
    return (
      <div className="text-center py-12 bg-gradient-to-br from-blue-50 to-sky-100 rounded-2xl border-2 border-dashed border-blue-200">
        <svg className="w-16 h-16 mx-auto mb-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-blue-400 font-medium">Aucune photo disponible</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Image principale */}
      <div className="relative group">
        <div
          className="w-64 h-64 relative cursor-zoom-in rounded-xl overflow-hidden shadow-lg border-4 border-white/50 hover:scale-105 transition-all duration-300"
          onClick={() => onPhotoClick && onPhotoClick(validPhotos[current])}
        >
          <Image
            src={validPhotos[current].startsWith('/uploads/') ? `http://localhost:4400${validPhotos[current]}` : validPhotos[current]}
            alt={`Photo ${current + 1}`}
            fill
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-300 group-hover:scale-110"
          />
          {/* Overlay avec icône zoom */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Navigation arrows si plusieurs photos */}
        {validPhotos.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-blue-600 hover:text-blue-700 rounded-full p-1.5 shadow-lg transition-all duration-200 hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                setCurrent(current === 0 ? validPhotos.length - 1 : current - 1);
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-blue-600 hover:text-blue-700 rounded-full p-1.5 shadow-lg transition-all duration-200 hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                setCurrent(current === validPhotos.length - 1 ? 0 : current + 1);
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Compteur de photos */}
        {validPhotos.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
            {current + 1} / {validPhotos.length}
          </div>
        )}
      </div>

      {/* Indicateurs de navigation */}
      {validPhotos.length > 1 && (
        <div className="flex gap-2">
          {validPhotos.map((_, idx) => (
            <button
              key={idx}
              className={`w-3 h-3 rounded-full transition-all duration-300 transform hover:scale-125 ${idx === current
                ? 'bg-gradient-to-r from-sky-400 to-blue-500 shadow-lg ring-2 ring-blue-200'
                : 'bg-blue-200 hover:bg-blue-300 shadow-sm'
                }`}
              onClick={() => setCurrent(idx)}
            />
          ))}
        </div>
      )}

      {/* Thumbnails (si plus de 3 photos) */}
      {validPhotos.length > 3 && (
        <div className="flex gap-1.5 mt-3">
          {validPhotos.slice(0, 5).map((photo, idx) => (
            <div
              key={idx}
              className={`w-12 h-12 relative cursor-pointer rounded-md overflow-hidden border-2 transition-all duration-200 ${idx === current ? 'border-blue-400 scale-110 shadow-md' : 'border-blue-200 hover:border-blue-300 hover:scale-105'
                }`}
              onClick={() => setCurrent(idx)}
            >
              <Image
                src={photo.startsWith('/uploads/') ? `http://localhost:4400${photo}` : photo}
                alt={`Miniature ${idx + 1}`}
                fill
                style={{ objectFit: 'cover' }}
                className={idx === current ? 'opacity-100' : 'opacity-70 hover:opacity-100'}
              />
            </div>
          ))}
          {validPhotos.length > 5 && (
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-md flex items-center justify-center text-blue-600 font-bold text-xs border-2 border-blue-200">
              +{validPhotos.length - 5}
            </div>
          )}
        </div>
      )}
    </div>
  );
};