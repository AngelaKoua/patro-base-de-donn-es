'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { API_URL } from '@/lib/api';
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
  photo_url?: string;
  nom_pere?: string;
  profession_pere?: string;
  nom_mere?: string;
  profession_mere?: string;
  communaute?: string;
  est_catechumene?: boolean;
  est_bapteme?: boolean;
  est_premiere_communion?: boolean;
  est_confirmation?: boolean;
  annee_bapteme?: string;
  annee_confirmation?: string;
}

interface DetailFormData {
  email: string;
  contact_whatsapp: string;
  autre_contact: string;
  religion: string;
  realisation: string;
  nom_pere: string;
  profession_pere: string;
  nom_mere: string;
  profession_mere: string;
  communaute: string;
  est_catechumene: boolean;
  est_bapteme: boolean;
  est_premiere_communion: boolean;
  est_confirmation: boolean;
  annee_bapteme: string;
  annee_confirmation: string;
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
    nom_pere: '',
    profession_pere: '',
    nom_mere: '',
    profession_mere: '',
    communaute: '',
    est_catechumene: false,
    est_bapteme: false,
    est_premiere_communion: false,
    est_confirmation: false,
    annee_bapteme: '',
    annee_confirmation: '',
  });

  // 🔥 HANDLER SIMPLIFIÉ - Compatible avec le composant générique
  const handlePhotoUpdate = (photoUrl: string) => {
    setAnimateur(prev => prev ? { ...prev, photo_url: photoUrl } : null);
  };

  useEffect(() => {
    const fetchAnimateur = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/animateurs/${params.id}?_t=${Date.now()}`
        );

        if (response.data.success && response.data.animateur) {
          const animateurData = response.data.animateur;
          setAnimateur(animateurData);

          setFormData({
            email: animateurData.email ?? '',
            contact_whatsapp: animateurData.contact_whatsapp ?? '',
            autre_contact: animateurData.autre_contact ?? '',
            religion: animateurData.religion ?? '',
            realisation: animateurData.realisation ?? '',
            nom_pere: animateurData.nom_pere ?? '',
            profession_pere: animateurData.profession_pere ?? '',
            nom_mere: animateurData.nom_mere ?? '',
            profession_mere: animateurData.profession_mere ?? '',
            communaute: animateurData.communaute ?? '',
            est_catechumene: !!animateurData.est_catechumene,
            est_bapteme: !!animateurData.est_bapteme,
            est_premiere_communion: !!animateurData.est_premiere_communion,
            est_confirmation: !!animateurData.est_confirmation,
            annee_bapteme: animateurData.annee_bapteme ?? '',
            annee_confirmation: animateurData.annee_confirmation ?? '',
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
      const response = await axios.post(`${API_URL}/api/details-animateur`, {
        animateur_id: params.id,
        ...formData
      });
      if (response.data.success) {
        const updatedResponse = await axios.get(`${API_URL}/api/animateurs/${params.id}`);
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
            {animateur?.email ? 'Modifier les détails' : 'Ajouter des détails'}
          </button>
        </div>

        {/* Bandeau profil compact */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-sky-100 mb-6 flex flex-col sm:flex-row items-center sm:items-center gap-6">
          {animateur && (
            <ImageUpload
              entityId={animateur.id}
              entityType="animateur"
              currentPhoto={animateur.photo_url}
              onPhotoUpdate={handlePhotoUpdate}
              label="l'animateur"
            />
          )}

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
              {animateur?.prenom} {animateur?.nom}
            </h1>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              {animateur?.fonction && <Badge label={animateur.fonction} color="sky" />}
              {animateur?.section && <Badge label={animateur.section} color="blue" />}
              {animateur?.sexe && <Badge label={animateur.sexe === 'M' ? 'Masculin' : animateur.sexe === 'F' ? 'Féminin' : animateur.sexe} color="purple" />}
              {animateur?.religion && <Badge label={animateur.religion} color="amber" />}
            </div>
          </div>
        </div>

        {/* Card principale */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 border border-sky-100">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            <CardSection title="Informations générales">
              <InfoField label="Fonction" value={animateur?.fonction} />
              <InfoField label="Naissance" value={animateur?.naissance} />
              <InfoField label="Section" value={animateur?.section} />
              <InfoField label="Religion" value={animateur?.religion} />
              <InfoField label="Email" value={animateur?.email} />
              <InfoField label="Contact WhatsApp" value={animateur?.contact_whatsapp} />
              <InfoField label="Autre contact" value={animateur?.autre_contact} />
            </CardSection>

            <CardSection title="Famille">
              <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                <h4 className="text-sm font-semibold text-blue-700 flex items-center gap-2 mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Père
                </h4>
                <InfoField label="Nom" value={animateur?.nom_pere} />
                <InfoField label="Profession" value={animateur?.profession_pere} />
              </div>

              <div className="bg-pink-50/50 p-3 rounded-lg border border-pink-100">
                <h4 className="text-sm font-semibold text-pink-700 flex items-center gap-2 mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Mère
                </h4>
                <InfoField label="Nom" value={animateur?.nom_mere} />
                <InfoField label="Profession" value={animateur?.profession_mere} />
              </div>
            </CardSection>

            {animateur?.religion?.toLowerCase() === "chrétien catholique" && (
              <CardSection title="Informations religieuses">
                <InfoField label="Communauté" value={animateur?.communaute} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3">
                  <StatusChip label="Catéchumène" active={!!animateur?.est_catechumene} />
                  <StatusChip
                    label="Baptême"
                    active={!!animateur?.est_bapteme}
                    sub={
                      animateur?.est_bapteme && animateur?.annee_bapteme && animateur.annee_bapteme !== '0'
                        ? animateur.annee_bapteme
                        : undefined
                    }
                  />
                  <StatusChip label="1ère communion" active={!!animateur?.est_premiere_communion} />
                  <StatusChip
                    label="Confirmation"
                    active={!!animateur?.est_confirmation}
                    sub={
                      animateur?.est_confirmation && animateur?.annee_confirmation && animateur.annee_confirmation !== '0'
                        ? animateur.annee_confirmation
                        : undefined
                    }
                  />
                </div>
              </CardSection>
            )}

            <CardSection title="Réalisations" full>
              <TextBlock label="Réalisations" value={animateur?.realisation} />
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

// ============================================
// COMPOSANTS UTILITAIRES
// ============================================

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

interface StatusChipProps {
  label: string;
  active: boolean;
  sub?: string;
}

const StatusChip: React.FC<StatusChipProps> = ({ label, active, sub }) => (
  <div
    className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium border ${
      active ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-gray-50 border-gray-200 text-gray-400'
    }`}
  >
    <span>{label}</span>
    <span className="flex items-center gap-1">
      {sub && <span className="text-[10px] opacity-70">{sub}</span>}
      {active ? '✓' : '—'}
    </span>
  </div>
);
