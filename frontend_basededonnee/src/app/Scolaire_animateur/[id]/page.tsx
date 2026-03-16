'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
// 🔥 IMPORT DU COMPOSANT GÉNÉRIQUE
import ImageUpload from '@/components/ImageUpload';
import DetailsPopupFormAnimateur from '../../../../elements/DetailsPopupFormAnimateur';

interface Animateur {
  id: number;
  nom: string;
  prenom: string;
  fonction: string;
  naissance: string;
  sexe: string;
  section: string;
  email?: string;
  contact_whatsapp?: string;
  autre_contact?: string;
  religion?: string;
  realisation?: string;
  photo?: string;
  communaute?: string;
  est_catechumene?: boolean;
  est_bapteme?: boolean;
  est_premiere_communion?: boolean;
  est_confirmation?: boolean;
}

interface DetailFormData {
  email: string;
  contact_whatsapp: string;
  autre_contact: string;
  religion: string;
  realisation: string;
  communaute: string;
  est_catechumene: boolean;
  est_bapteme: boolean;
  est_premiere_communion: boolean;
  est_confirmation: boolean;
}

export default function DetailAnimateurPage() {
  const router = useRouter();
  const params = useParams();
  const [animateur, setAnimateur] = useState<Animateur | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState<DetailFormData>({
    email: '',
    contact_whatsapp: '',
    autre_contact: '',
    religion: '',
    realisation: '',
    communaute: '',
    est_catechumene: false,
    est_bapteme: false,
    est_premiere_communion: false,
    est_confirmation: false,
  });

  // 🔥 HANDLER SIMPLIFIÉ - Compatible avec le composant générique
  const handlePhotoUpdate = (photoUrl: string) => {
    setAnimateur(prev => prev ? { ...prev, photo: photoUrl } : null);
  };

  useEffect(() => {
    const fetchAnimateur = async () => {
      try {
        console.log('🔄 Fetching animateur ID:', params.id);

        const response = await axios.get(
          `http://localhost:4400/api/animateurs/${params.id}?_t=${Date.now()}`
        );

        console.log('📦 Response complète:', response.data);
        console.log('📸 Photo dans response:', response.data.animateur?.photo);

        if (response.data.success && response.data.animateur) {
          const animateurData = response.data.animateur;
          setAnimateur(animateurData);

          console.log('✅ Animateur state updated:', {
            id: animateurData.id,
            nom: animateurData.nom,
            photo: animateurData.photo
          });
          setFormData({
            email: animateurData.email ?? '',
            contact_whatsapp: animateurData.contact_whatsapp ?? '',
            autre_contact: animateurData.autre_contact ?? '',
            religion: animateurData.religion ?? '',
            realisation: animateurData.realisation ?? '',
            communaute: animateurData.communaute ?? '',
            est_catechumene: !!animateurData.est_catechumene,
            est_bapteme: !!animateurData.est_bapteme,
            est_premiere_communion: !!animateurData.est_premiere_communion,
            est_confirmation: !!animateurData.est_confirmation,
          });
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchAnimateur();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4400/api/details-animateur', {
        animateur_id: params.id,
        ...formData
      });
      if (response.data.success) {
        const updatedResponse = await axios.get(`http://localhost:4400/api/animateurs/${params.id}`);
        if (updatedResponse.data.success) {
          setAnimateur(updatedResponse.data.animateur);
          setShowForm(false);
          alert('Détails enregistrés avec succès');
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'ajout des détails');
    }
  };

  if (loading) return <div className="p-8 text-sky-600">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-100">
      <div className="p-6">
        {/* Header Section */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Retour
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {animateur?.email ? 'Modifier les détails' : 'Ajouter des détails'}
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-sky-100">
          {/* Title Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent mb-2">
              Détails de l&apos;animateur
            </h1>
            <p className="text-xl text-sky-600 font-semibold">
              {animateur?.prenom} {animateur?.nom}
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-sky-400 to-blue-500 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* 🔥 UTILISATION DU COMPOSANT GÉNÉRIQUE */}
          {animateur && (
            <ImageUpload
              entityId={animateur.id}
              entityType="animateur"
              currentPhoto={animateur.photo}
              onPhotoUpdate={handlePhotoUpdate}
              label="l'animateur"
            />
          )}

          {/* Infos harmonisées */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CardSection title="Informations de base">
              <InfoField label="Nom" value={animateur?.nom} />
              <InfoField label="Prénom" value={animateur?.prenom} />
              <InfoField label="Fonction" value={animateur?.fonction} />
              <InfoField label="Naissance" value={animateur?.naissance} />
              <InfoField label="Section" value={animateur?.section} />
              <InfoField label="Sexe" value={animateur?.sexe === 'M' ? 'Masculin' : animateur?.sexe === 'F' ? 'Féminin' : animateur?.sexe} />
              <InfoField label="Religion" value={animateur?.religion} />
            </CardSection>

            <CardSection title="Contact">
              <InfoField label="Email" value={animateur?.email} />
              <InfoField label="Contact WhatsApp" value={animateur?.contact_whatsapp} />
              <InfoField label="Autre contact" value={animateur?.autre_contact} />
            </CardSection>

            {animateur?.religion?.toLowerCase() === "chrétien catholique" && (
              <CardSection title="Informations religieuses">
                <InfoField label="Communauté" value={animateur?.communaute} />
                <InfoField label="Catéchumène" value={animateur?.est_catechumene ? "Oui" : "Non"} />

                <div className="bg-sky-50/50 p-4 rounded-lg border border-sky-100 space-y-3">
                  <InfoField label="Baptême" value={animateur?.est_bapteme ? "Oui" : "Non"} />
                </div>

                <div className="bg-sky-50/50 p-4 rounded-lg border border-sky-100 space-y-3">
                  <InfoField label="1ère communion" value={animateur?.est_premiere_communion ? "Oui" : "Non"} />
                </div>

                <div className="bg-sky-50/50 p-4 rounded-lg border border-sky-100 space-y-3">
                  <InfoField label="Confirmation" value={animateur?.est_confirmation ? "Oui" : "Non"} />
                </div>
              </CardSection>
            )}

            <CardSection title="Réalisations" full>
              <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-6 rounded-lg border border-sky-100 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <h4 className="font-bold text-sky-700 text-lg">Achievements & Portfolio</h4>
                </div>
                <InfoField label="Réalisations" value={animateur?.realisation} />
              </div>
            </CardSection>
          </div>
        </div>
      </div>

      {/* Modal en overlay */}
      <DetailsPopupFormAnimateur
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        religion={formData.religion}
      />
    </div>
  );
}

// Composants réutilisables
const CardSection = ({ title, children, full = false }: { title: string; children: React.ReactNode; full?: boolean }) => (
  <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-sky-100 hover:shadow-xl transition-all duration-300 ${full ? 'md:col-span-2' : ''}`}>
    <h3 className="text-lg font-bold text-sky-700 mb-4 flex items-center gap-2 pb-2 border-b border-sky-100">
      <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
      {title}
    </h3>
    <div className="space-y-3">
      {children}
    </div>
  </div>
);

const InfoField = ({ label, value }: { label: string; value?: string | number }) => (
  <div className="flex flex-col space-y-1">
    <span className="text-sm font-semibold text-sky-600">{label}</span>
    <span className={`text-gray-800 ${value ? 'bg-sky-50 px-3 py-2 rounded-lg border border-sky-100' : 'text-gray-400 italic'}`}>
      {value || 'Non renseigné'}
    </span>
  </div>
);