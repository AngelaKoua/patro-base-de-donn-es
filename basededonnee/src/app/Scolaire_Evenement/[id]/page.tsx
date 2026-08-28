'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import EventMediaUploader from '@/components/EventMediaUploader';
import { API_URL } from '@/lib/api';

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

export default function EvenementDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [evenement, setEvenement] = useState<Evenement | null>(null);
  const [detail, setDetail] = useState<DetailEvenement>(initialDetail);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [modalPhoto, setModalPhoto] = useState<string | null>(null);
  const [modalVideo, setModalVideo] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Récupération des données pour l\'ID:', params.id);

        const response = await axios.get(`${API_URL}/api/detail-evenement/${params.id}`);
        console.log('Réponse du serveur:', response.data);

        if (response.data.success) {
          console.log('Informations de l\'événement:', response.data.evenement);
          setEvenement(response.data.evenement);

          if (response.data.detail) {
            console.log('Détails de l\'événement:', response.data.detail);
            // Reconstruit le tableau photos à partir de photo1..photo10 pour préserver les positions des slots
            const photos = [];
            for (let i = 1; i <= 10; i++) {
              const val = response.data.detail[`photo${i}`];
              photos.push(val || '');
            }
            setDetail({
              ...initialDetail,
              ...response.data.detail,
              photos,
              video: response.data.detail.video || '',
            });
          } else {
            console.log('Aucun détail trouvé pour cet événement');
          }
        } else {
          console.log('La requête n\'a pas réussi:', response.data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const evenementId = Array.isArray(params.id) ? params.id[0] : params.id;

    console.log("Params.id =", params.id);
    console.log("evenementId =", evenementId);
    console.log("Payload envoyé =", { evenement_id: evenementId, ...detail });

    try {
      const { photos, ...detailWithoutPhotos } = detail;
      const payload = {
        evenement_id: evenementId,
        ...detailWithoutPhotos,
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
      const response = await axios.post(`${API_URL}/api/detail-evenement`, payload);
      console.log("Après axios", response.data);

      if (response.data.success) {
        setShowForm(false);
        alert('Détails enregistrés avec succès');
      }
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'message' in error) {
        console.error("Erreur Axios brute:", error);
        alert("Erreur lors de l'ajout des détails: " + error.message);
      } else {
        alert("Erreur lors de l'ajout des détails");
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-lg font-semibold text-sky-600">Chargement...</div>;

  return (
    <div className="p-5 md:p-8 bg-gradient-to-br from-blue-50 via-sky-25 to-blue-100 min-h-screen">
      <div>
        {/* Header avec boutons */}
        <div className="flex justify-between items-center mb-5">
          <button
            onClick={() => router.back()}
            className="bg-gray-500 text-white hover:bg-gray-600 px-5 py-2.5 rounded-xl shadow-md transition-all duration-200 transform hover:scale-105 flex items-center gap-2 font-medium text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Retour
          </button>

          <button
            onClick={() => setShowForm(true)}
            className="bg-sky-500 text-white hover:bg-sky-600 px-5 py-2.5 rounded-xl shadow-md transition-all duration-200 transform hover:scale-105 flex items-center gap-2 font-medium text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {detail.description ? 'Modifier les détails' : 'Ajouter des détails'}
          </button>
        </div>

        {/* Bandeau résumé de l'évènement */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-sky-100 mb-6 flex flex-col sm:flex-row items-center sm:items-center gap-6">
          <div className="flex-shrink-0 bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl p-4 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
              {evenement?.evenement || 'Évènement'}
            </h1>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              {evenement?.annee != null && <Badge label={`Année ${evenement.annee}`} color="sky" />}
              {(evenement?.date_debut || evenement?.date_fin) && (
                <Badge label={[evenement?.date_debut, evenement?.date_fin].filter(Boolean).join(' → ')} color="blue" />
              )}
              {detail.lieu && <Badge label={detail.lieu} color="amber" />}
              {evenement?.cible && <Badge label={evenement.cible} color="purple" />}
            </div>
          </div>
        </div>

        {/* Card principale */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 border border-sky-100">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            <CardSection title="Informations générales">
              <InfoField label="Année" value={evenement?.annee} />
              <InfoField label="Date début" value={evenement?.date_debut} />
              <InfoField label="Date fin" value={evenement?.date_fin} />
              <InfoField label="Cible" value={evenement?.cible} />
            </CardSection>

            <CardSection title="Lieu & objectif">
              <InfoField label="Lieu" value={detail.lieu} />
              <TextBlock label="Description" value={detail.description} />
              <TextBlock label="Objectif" value={detail.objectif} />
            </CardSection>

            <CardSection title="Participation patronnés">
              <InfoField label="Attendus" value={detail.nb_patronnes_attendus} />
              <InfoField label="Présents" value={detail.nb_patronnes_presents} />
              <InfoField label="Taux de participation" value={formatPercent(detail.taux_participation_patronnes)} />
            </CardSection>

            <CardSection title="Participation animateurs">
              <InfoField label="Attendus" value={detail.nb_animateurs_attendus} />
              <InfoField label="Présents" value={detail.nb_animateurs_presents} />
              <InfoField label="Taux de participation" value={formatPercent(detail.taux_participation_animateurs)} />
            </CardSection>

            <CardSection title="Partenaires & ressources">
              <InfoField label="Partenaires" value={detail.partenaires} />
              <InfoField label="Autres personnes ressources" value={detail.autres_personnes_ressources} />
              <InfoField label="Financement" value={detail.financement} />
            </CardSection>

            <CardSection title="Évaluation" full>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <TextBlock label="Aspects positifs" value={detail.aspects_positifs} />
                <TextBlock label="Aspects négatifs" value={detail.aspects_negatifs} />
                <TextBlock label="Suggestions" value={detail.suggestions} />
              </div>
            </CardSection>
          </div>
        </div>

        {/* Médias */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md p-5 border border-sky-100">
            <h3 className="text-sm font-bold text-sky-700 mb-3 flex items-center gap-2 pb-2 border-b border-sky-100 uppercase tracking-wide">
              <div className="w-1.5 h-1.5 bg-sky-500 rounded-full"></div>
              Vidéo
            </h3>
            {detail.video ? (
              <div
                className="cursor-pointer group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 inline-block"
                onClick={() => setModalVideo(detail.video)}
              >
                <video
                  controls
                  className="w-full max-w-md rounded-xl border-2 border-blue-200 group-hover:border-blue-400 transition-all duration-300"
                  src={detail.video}
                  onError={(e) => {
                    console.error('Erreur chargement vidéo:', e);
                    console.log('URL vidéo:', detail.video);
                  }}
                >
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center pointer-events-none">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-4">
                    <svg className="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-blue-600 mt-2 text-center">Cliquez pour lire en plein écran</p>
              </div>
            ) : (
              <div className="text-sm text-gray-400 italic py-4">Aucune vidéo</div>
            )}
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md p-5 border border-sky-100">
            <h3 className="text-sm font-bold text-sky-700 mb-3 flex items-center gap-2 pb-2 border-b border-sky-100 uppercase tracking-wide">
              <div className="w-1.5 h-1.5 bg-sky-500 rounded-full"></div>
              Photos
            </h3>
            <PhotoCarousel photos={detail.photos.filter(Boolean)} onPhotoClick={setModalPhoto} />
          </div>
        </div>

        {modalPhoto && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setModalPhoto(null)}>
            <div className="relative max-w-3xl w-full" onClick={e => e.stopPropagation()}>
              <img src={modalPhoto.startsWith('/uploads/') ? `${API_URL}${modalPhoto}` : modalPhoto} alt="Agrandissement" className="rounded-2xl max-h-[80vh] mx-auto shadow-2xl" />
              <button className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2" onClick={() => setModalPhoto(null)}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modale vidéo */}
      {modalVideo && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => setModalVideo(null)}
        >
          <div className="relative max-w-5xl w-full px-4" onClick={e => e.stopPropagation()}>
            <video
              controls
              autoPlay
              className="w-full rounded-2xl shadow-2xl"
              src={modalVideo}
              onError={(e) => {
                console.error('Erreur chargement vidéo modale:', e);
                console.log('URL vidéo modale:', modalVideo);
              }}
            >
              Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
            <button
              className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg"
              onClick={() => setModalVideo(null)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      {/* 🔥 MODAL CORRIGÉ - Avec scroll qui fonctionne correctement */}
      {showForm && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-900/40 to-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form
            className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl flex flex-col"
            style={{ maxHeight: '90vh' }}
            onSubmit={handleSubmit}
          >
            {/* Header - Position fixe */}
            <div className="bg-gradient-to-r from-blue-400 via-sky-500 to-blue-600 px-8 py-6 relative rounded-t-3xl flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
                aria-label="Fermer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-3xl font-bold text-white text-center pr-12">
                ✨ Modifier les détails de l&apos;évènement
              </h2>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-300 via-blue-300 to-green-300"></div>
            </div>

            {/* 🔥 Form Content - Avec overflow-y-auto qui fonctionne */}
            <div className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-slate-50 to-blue-50/30">
              <div className="space-y-8">

                {/* Informations générales */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
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
                      <input
                        name="lieu"
                        type="text"
                        value={detail.lieu || ''}
                        onChange={handleChange}
                        placeholder="Lieu de l'évènement"
                        className="w-full border-2 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl p-4 transition-all duration-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="flex items-center text-slate-700 font-medium mb-2">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={detail.description}
                        onChange={handleChange}
                        placeholder="Décrivez votre évènement en détail..."
                        className="w-full border-2 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl p-4 transition-all duration-200 resize-none hover:border-blue-300 bg-white"
                        rows={4}
                      />
                    </div>
                    <div>
                      <label className="flex items-center text-slate-700 font-medium mb-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                        Objectif
                      </label>
                      <textarea
                        name="objectif"
                        value={detail.objectif}
                        onChange={handleChange}
                        placeholder="Quel est l'objectif principal de cet évènement ?"
                        className="w-full border-2 border-slate-200 focus:border-green-400 focus:ring-4 focus:ring-green-100 rounded-xl p-4 transition-all duration-200 resize-none hover:border-green-300 bg-white"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                {/* Statistiques */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
                  <div className="flex items-center mb-4">
                    <div className="w-2 h-8 bg-gradient-to-b from-pink-400 to-pink-500 rounded-full mr-3"></div>
                    <h3 className="text-xl font-bold text-pink-800">📊 Statistiques de participation</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-blue-700 text-sm font-medium block mb-1">Patronnés attendus</label>
                      <input
                        name="nb_patronnes_attendus"
                        type="number"
                        value={detail.nb_patronnes_attendus}
                        onChange={handleChange}
                        placeholder="0"
                        className="w-full border-2 border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-lg p-3 transition-all duration-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-blue-700 text-sm font-medium block mb-1">Patronnés présents</label>
                      <input
                        name="nb_patronnes_presents"
                        type="number"
                        value={detail.nb_patronnes_presents}
                        onChange={handleChange}
                        placeholder="0"
                        className="w-full border-2 border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-lg p-3 transition-all duration-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-blue-700 text-sm font-medium block mb-1">Taux participation patronnés (%)</label>
                      <input
                        name="taux_participation_patronnes"
                        type="number"
                        value={detail.taux_participation_patronnes}
                        onChange={handleChange}
                        placeholder="%"
                        className="w-full border-2 border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-lg p-3 transition-all duration-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-green-700 text-sm font-medium block mb-1">Animateurs attendus</label>
                      <input
                        name="nb_animateurs_attendus"
                        type="number"
                        value={detail.nb_animateurs_attendus}
                        onChange={handleChange}
                        placeholder="0"
                        className="w-full border-2 border-green-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 rounded-lg p-3 transition-all duration-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-green-700 text-sm font-medium block mb-1">Animateurs présents</label>
                      <input
                        name="nb_animateurs_presents"
                        type="number"
                        value={detail.nb_animateurs_presents}
                        onChange={handleChange}
                        placeholder="0"
                        className="w-full border-2 border-green-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 rounded-lg p-3 transition-all duration-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-green-700 text-sm font-medium block mb-1">Taux participation animateurs (%)</label>
                      <input
                        name="taux_participation_animateurs"
                        type="number"
                        value={detail.taux_participation_animateurs}
                        onChange={handleChange}
                        placeholder="%"
                        className="w-full border-2 border-green-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 rounded-lg p-3 transition-all duration-200 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Organisation & Ressources */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
                  <div className="flex items-center mb-4">
                    <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full mr-3"></div>
                    <h3 className="text-xl font-bold text-blue-800">🏢 Organisation & Ressources</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="flex items-center text-slate-700 font-medium mb-2">
                        <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
                        Partenaires
                      </label>
                      <input
                        name="partenaires"
                        type="text"
                        value={detail.partenaires}
                        onChange={handleChange}
                        placeholder="Vos partenaires..."
                        className="w-full border-2 border-slate-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 rounded-lg p-3 transition-all duration-200 bg-white hover:border-cyan-300"
                      />
                    </div>
                    <div>
                      <label className="flex items-center text-slate-700 font-medium mb-2">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                        Autres personnes ressources
                      </label>
                      <input
                        name="autres_personnes_ressources"
                        type="text"
                        value={detail.autres_personnes_ressources}
                        onChange={handleChange}
                        placeholder="Personnes ressources..."
                        className="w-full border-2 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-lg p-3 transition-all duration-200 bg-white hover:border-blue-300"
                      />
                    </div>
                    <div>
                      <label className="flex items-center text-slate-700 font-medium mb-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                        Financement
                      </label>
                      <input
                        name="financement"
                        type="text"
                        value={detail.financement}
                        onChange={handleChange}
                        placeholder="Sources de financement..."
                        className="w-full border-2 border-slate-200 focus:border-green-400 focus:ring-4 focus:ring-green-100 rounded-lg p-3 transition-all duration-200 bg-white hover:border-green-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Évaluation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Aspects positifs */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
                    <div className="flex items-center mb-4">
                      <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full mr-3"></div>
                      <h3 className="text-xl font-bold text-green-800">✅ Aspects positifs</h3>
                    </div>
                    <textarea
                      name="aspects_positifs"
                      value={detail.aspects_positifs}
                      onChange={handleChange}
                      placeholder="Qu'est-ce qui a bien fonctionné ?"
                      className="w-full border-2 border-green-200 focus:border-green-400 focus:ring-4 focus:ring-green-100 rounded-xl p-4 transition-all duration-200 resize-none bg-white hover:border-green-300"
                      rows={4}
                    />
                  </div>

                  {/* Aspects négatifs */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
                    <div className="flex items-center mb-4">
                      <div className="w-2 h-8 bg-gradient-to-b from-pink-400 to-rose-500 rounded-full mr-3"></div>
                      <h3 className="text-xl font-bold text-pink-800">⚠️ Points d&apos;amélioration</h3>
                    </div>
                    <textarea
                      name="aspects_negatifs"
                      value={detail.aspects_negatifs}
                      onChange={handleChange}
                      placeholder="Que peut-on améliorer ?"
                      className="w-full border-2 border-pink-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 rounded-xl p-4 transition-all duration-200 resize-none bg-white hover:border-pink-300"
                      rows={4}
                    />
                  </div>
                </div>

                {/* Suggestions */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
                  <div className="flex items-center mb-4">
                    <div className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full mr-3"></div>
                    <h3 className="text-xl font-bold text-indigo-800">💡 Suggestions d&apos;amélioration</h3>
                  </div>
                  <textarea
                    name="suggestions"
                    value={detail.suggestions}
                    onChange={handleChange}
                    placeholder="Vos idées pour les prochains évènements..."
                    className="w-full border-2 border-indigo-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 rounded-xl p-4 transition-all duration-200 resize-none bg-white hover:border-indigo-300"
                    rows={3}
                  />
                </div>

                {/* 🔥 Photos + Vidéo - Maintenant visible avec scroll */}
                <EventMediaUploader
                  evenementId={params.id as string}
                  type="scolaire"
                  photos={detail.photos}
                  video={detail.video}
                  onPhotosChange={(newPhotos) => setDetail(prev => ({ ...prev, photos: newPhotos }))}
                  onVideoChange={(newVideo) => setDetail(prev => ({ ...prev, video: newVideo }))}
                />
              </div>
            </div>

            {/* Footer - Position fixe */}
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-8 py-6 border-t border-blue-100 flex-shrink-0 rounded-b-3xl">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white px-8 py-4 rounded-2xl shadow-xl text-lg font-bold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                💾 Enregistrer les modifications
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// Composants réutilisables
const formatPercent = (value?: number | null) =>
  value === null || value === undefined || Number.isNaN(value) ? undefined : `${value}%`;

interface CardSectionProps {
  title: string;
  children: React.ReactNode;
  full?: boolean;
}

const CardSection: React.FC<CardSectionProps> = ({ title, children, full = false }) => (
  <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-5 border border-sky-100 hover:shadow-lg transition-all duration-300 ${full ? 'md:col-span-2 xl:col-span-3' : ''}`}>
    <h3 className="text-sm font-bold text-sky-700 mb-1 flex items-center gap-2 pb-2 border-b border-sky-100 uppercase tracking-wide">
      <div className="w-1.5 h-1.5 bg-sky-500 rounded-full"></div>
      {title}
    </h3>
    <div className="divide-y divide-sky-50">
      {children}
    </div>
  </div>
);

interface InfoFieldProps {
  label: string;
  value?: string | number;
}

const InfoField: React.FC<InfoFieldProps> = ({ label, value }) => (
  <div className="flex items-center justify-between gap-4 py-2">
    <span className="text-xs font-medium text-sky-600/90">{label}</span>
    <span className={`text-sm text-right ${value ? 'text-gray-800 font-medium' : 'text-gray-400 italic'}`}>
      {value || 'Non renseigné'}
    </span>
  </div>
);

interface TextBlockProps {
  label: string;
  value?: string;
}

const TextBlock: React.FC<TextBlockProps> = ({ label, value }) => (
  <div className="py-2">
    <span className="text-xs font-medium text-sky-600/90 block mb-1">{label}</span>
    <p className={`text-sm ${value ? 'text-gray-800' : 'text-gray-400 italic'}`}>
      {value || 'Non renseigné'}
    </p>
  </div>
);

interface BadgeProps {
  label: string;
  color: 'sky' | 'blue' | 'purple' | 'amber';
}

const badgeColors: Record<BadgeProps['color'], string> = {
  sky: 'bg-sky-100 text-sky-700',
  blue: 'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700',
  amber: 'bg-amber-100 text-amber-700',
};

const Badge: React.FC<BadgeProps> = ({ label, color }) => (
  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badgeColors[color]}`}>
    {label}
  </span>
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
            src={validPhotos[current].startsWith('/uploads/') ? `${API_URL}${validPhotos[current]}` : validPhotos[current]}
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
                src={photo.startsWith('/uploads/') ? `${API_URL}${photo}` : photo}
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