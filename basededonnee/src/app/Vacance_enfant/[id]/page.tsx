'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
// 🔥 IMPORT DU COMPOSANT GÉNÉRIQUE
import ImageUpload from '@/components/ImageUpload';
import DetailsPopupForm from '../../../../elements/DetailsPopupFormProps';
import { API_URL } from '@/lib/api';

// ============================================
// TYPES & INTERFACES
// ============================================

interface Student {
  id: number;
  annee: number;
  nom: string;
  prenom: string;
  naissance: string;
  section: string;
  sexe: string;
  religion: string;
  domicile: string;
  quartier: string;
  rue: string;
  lot: string;
  nom_pere: string;
  profession_pere: string;
  contact_pere?: string;
  nom_mere: string;
  profession_mere: string;
  contact_mere?: string;
  personne_urgence: string;
  ecole: string;
  classe: string;
  portfolio: string;
  realisation: string;
  nombre_presence?: number;
  nombre_presence_totale?: number;
  photo_url?: string;
  nom_tuteur?: string;
  prenom_tuteur?: string;
  contact_tuteur?: string;
  nom_tutrice?: string;
  prenom_tutrice?: string;
  contact_tutrice?: string;
  communaute?: string;
  est_catechumene?: boolean;
  est_bapteme?: boolean;
  est_premiere_communion?: boolean;
  est_confirmation?: boolean;
  annee_bapteme?: string;
  annee_confirmation?: string;
}

interface DetailFormData {
  domicile: string;
  quartier: string;
  rue: string;
  lot: string;
  nom_pere: string;
  profession_pere: string;
  contact_pere: string;
  nom_mere: string;
  profession_mere: string;
  contact_mere: string;
  personne_urgence: string;
  ecole: string;
  classe: string;
  portfolio: string;
  realisation: string;
  nom_tuteur: string;
  prenom_tuteur: string;
  contact_tuteur: string;
  nombre_presence: number;
  nombre_presence_totale: number;
  nom_tutrice: string;
  prenom_tutrice: string;
  contact_tutrice: string;
  communaute: string;
  est_catechumene: boolean;
  est_bapteme: boolean;
  est_premiere_communion: boolean;
  est_confirmation: boolean;
  annee_bapteme: string;
  annee_confirmation: string;
}

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export default function DetailVacanceEnfantPage() {
  const router = useRouter();
  const params = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState<DetailFormData>({
    domicile: '', quartier: '', rue: '', lot: '',
    nom_pere: '', profession_pere: '', contact_pere: '',
    nom_mere: '', profession_mere: '', contact_mere: '',
    personne_urgence: '', ecole: '', classe: '', portfolio: '', realisation: '',
    nom_tuteur: '', prenom_tuteur: '', contact_tuteur: '',
    nom_tutrice: '', prenom_tutrice: '', contact_tutrice: '',
    communaute: '', est_catechumene: false, est_bapteme: false,
    est_premiere_communion: false, est_confirmation: false,
    annee_bapteme: '', annee_confirmation: '',
    nombre_presence: 0, nombre_presence_totale: 0
  });

  // 🔥 HANDLER SIMPLIFIÉ - Compatible avec le composant générique
  const handlePhotoUpdate = (photoUrl: string) => {
    setStudent(prev => prev ? { ...prev, photo_url: photoUrl } : null);
  };

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/enfants-vacance/${params.id}`);
        if (response.data.success && response.data.enfant) {
          const studentData = response.data.enfant;

          // Plus besoin de fetch séparé pour la photo
          // Elle est déjà incluse dans la réponse principale
          setStudent(studentData);

          setFormData({
            domicile: studentData.domicile ?? '',
            quartier: studentData.quartier ?? '',
            rue: studentData.rue ?? '',
            lot: studentData.lot ?? '',
            nom_pere: studentData.nom_pere ?? '',
            profession_pere: studentData.profession_pere ?? '',
            contact_pere: studentData.contact_pere ?? '',
            nom_mere: studentData.nom_mere ?? '',
            profession_mere: studentData.profession_mere ?? '',
            contact_mere: studentData.contact_mere ?? '',
            personne_urgence: studentData.personne_urgence ?? '',
            ecole: studentData.ecole ?? '',
            classe: studentData.classe ?? '',
            portfolio: studentData.portfolio ?? '',
            realisation: studentData.realisation ?? '',
            nom_tuteur: studentData.nom_tuteur ?? '',
            prenom_tuteur: studentData.prenom_tuteur ?? '',
            contact_tuteur: studentData.contact_tuteur ?? '',
            nom_tutrice: studentData.nom_tutrice ?? '',
            prenom_tutrice: studentData.prenom_tutrice ?? '',
            contact_tutrice: studentData.contact_tutrice ?? '',
            communaute: studentData.communaute ?? '',
            est_catechumene: !!studentData.est_catechumene,
            est_bapteme: !!studentData.est_bapteme,
            est_premiere_communion: !!studentData.est_premiere_communion,
            est_confirmation: !!studentData.est_confirmation,
            annee_bapteme: studentData.annee_bapteme ?? '',
            annee_confirmation: studentData.annee_confirmation ?? '',
            nombre_presence: studentData.nombre_presence ?? 0,
            nombre_presence_totale: studentData.nombre_presence_totale ?? 0,
          });
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchStudent();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/details-enfant-vacance`, {
        enfant_id: params.id,
        ...formData
      });

      if (response.data.success) {
        const updatedResponse = await axios.get(`${API_URL}/api/enfants-vacance/${params.id}`);
        if (updatedResponse.data.success) {
          setStudent(updatedResponse.data.enfant);
          setShowForm(false);
          alert('Détails enregistrés avec succès');
        }
      }
    } catch (error) {
      alert('Erreur lors de l\'ajout des détails');
    }
  };

  if (loading) return <div className="p-8 text-center text-lg font-semibold">Chargement...</div>;

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
            {student?.domicile ? 'Modifier les détails' : 'Ajouter des détails'}
          </button>
        </div>

        {/* Bandeau profil compact */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-sky-100 mb-6 flex flex-col sm:flex-row items-center sm:items-center gap-6">
          {student && (
            <ImageUpload
              entityId={student.id}
              entityType="vacance_enfant"
              currentPhoto={student.photo_url}
              onPhotoUpdate={handlePhotoUpdate}
              label="l'enfant"
            />
          )}

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
              {student?.prenom} {student?.nom}
            </h1>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              {student?.annee && <Badge label={`Année ${student.annee}`} color="sky" />}
              {student?.section && <Badge label={student.section} color="blue" />}
              {student?.sexe && <Badge label={student.sexe === 'M' ? 'Masculin' : 'Féminin'} color="purple" />}
              {student?.religion && <Badge label={student.religion} color="amber" />}
            </div>
          </div>
        </div>

        {/* Card principale */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 border border-sky-100">
          {/* Grid des informations */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            <div className="flex flex-col gap-5">
              <CardSection title="Informations générales">
                <InfoField label="Naissance" value={student?.naissance} />
                <InfoField label="Religion" value={student?.religion} />
                <InfoField label="Domicile" value={student?.domicile} />
                <InfoField label="Quartier" value={student?.quartier} />
                <InfoField label="Rue" value={student?.rue} />
                <InfoField label="Lot" value={student?.lot} />
              </CardSection>

              {student?.religion?.toLowerCase() === "chrétien catholique" && (
                <CardSection title="Informations religieuses">
                  <InfoField label="Communauté" value={student?.communaute} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3">
                    <StatusChip label="Catéchumène" active={!!student?.est_catechumene} />
                    <StatusChip
                      label="Baptême"
                      active={!!student?.est_bapteme}
                      sub={
                        student?.est_bapteme && student?.annee_bapteme && student.annee_bapteme !== '0'
                          ? student.annee_bapteme
                          : undefined
                      }
                    />
                    <StatusChip label="1ère communion" active={!!student?.est_premiere_communion} />
                    <StatusChip
                      label="Confirmation"
                      active={!!student?.est_confirmation}
                      sub={
                        student?.est_confirmation && student?.annee_confirmation && student.annee_confirmation !== '0'
                          ? student.annee_confirmation
                          : undefined
                      }
                    />
                  </div>
                </CardSection>
              )}
            </div>

            <CardSection title="Parents">
              <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                <h4 className="text-sm font-semibold text-blue-700 flex items-center gap-2 mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Père
                </h4>
                <InfoField label="Nom" value={student?.nom_pere} />
                <InfoField label="Profession" value={student?.profession_pere} />
                <InfoField label="Contact" value={student?.contact_pere} />
              </div>

              <div className="bg-pink-50/50 p-3 rounded-lg border border-pink-100">
                <h4 className="text-sm font-semibold text-pink-700 flex items-center gap-2 mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Mère
                </h4>
                <InfoField label="Nom" value={student?.nom_mere} />
                <InfoField label="Profession" value={student?.profession_mere} />
                <InfoField label="Contact" value={student?.contact_mere} />
              </div>

              <div className="bg-red-50/50 p-3 rounded-lg border border-red-100">
                <h4 className="text-sm font-semibold text-red-700 flex items-center gap-2 mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Urgence
                </h4>
                <InfoField label="Personne à joindre" value={student?.personne_urgence} />
              </div>
            </CardSection>

            <CardSection title="Tuteur / Tutrice">
              <div className="bg-green-50/50 p-3 rounded-lg border border-green-100">
                <h4 className="text-sm font-semibold text-green-700 flex items-center gap-2 mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Tuteur
                </h4>
                <InfoField label="Nom" value={student?.nom_tuteur} />
                <InfoField label="Prénom" value={student?.prenom_tuteur} />
                <InfoField label="Contact" value={student?.contact_tuteur} />
              </div>

              <div className="bg-purple-50/50 p-3 rounded-lg border border-purple-100">
                <h4 className="text-sm font-semibold text-purple-700 flex items-center gap-2 mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Tutrice
                </h4>
                <InfoField label="Nom" value={student?.nom_tutrice} />
                <InfoField label="Prénom" value={student?.prenom_tutrice} />
                <InfoField label="Contact" value={student?.contact_tutrice} />
              </div>
            </CardSection>

            <CardSection title="Scolarité">
              <InfoField label="École" value={student?.ecole} />
              <InfoField label="Classe" value={student?.classe} />
            </CardSection>

            <CardSection title="Présences">
              <InfoField label="Nombre de présence" value={student?.nombre_presence?.toString()} />
              <InfoField label="Nombre de présence totale" value={student?.nombre_presence_totale?.toString()} />
            </CardSection>

            <CardSection title="Réalisations" full>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextBlock label="Portfolio" value={student?.portfolio} />
                <TextBlock label="Réalisations" value={student?.realisation} />
              </div>
            </CardSection>
          </div>
        </div>

        {/* Popup de modification */}
        <DetailsPopupForm
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          religion={student?.religion}
        />
      </div>
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
