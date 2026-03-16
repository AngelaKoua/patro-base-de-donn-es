'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
// 🔥 IMPORT DU COMPOSANT GÉNÉRIQUE
import ImageUpload from '@/components/ImageUpload';
import DetailsPopupForm from '../../../../elements/DetailsPopupFormProps';

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
  nom_mere: string;
  profession_mere: string;
  personne_urgence: string;
  ecole: string;
  classe: string;
  portfolio: string;
  realisation: string;
  nombre_presence?: number;
  nombre_presence_totale?: number;
  photo?: string;
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
}

interface DetailFormData {
  domicile: string;
  quartier: string;
  rue: string;
  lot: string;
  nom_pere: string;
  profession_pere: string;
  nom_mere: string;
  profession_mere: string;
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
}

// ============================================
// COMPOSANTS UTILITAIRES
// ============================================

const InfoField = ({ label, value }: { label: string; value?: string | number }) => (
  <div className="flex flex-col space-y-1">
    <span className="text-sm font-semibold text-sky-600">{label}</span>
    <span className={`text-gray-800 ${value ? 'bg-sky-50 px-3 py-2 rounded-lg border border-sky-100' : 'text-gray-400 italic'}`}>
      {value || 'Non renseigné'}
    </span>
  </div>
);

const CardSection = ({ title, children, full }: { title: string; children: React.ReactNode; full?: boolean }) => (
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
    nom_pere: '', profession_pere: '', nom_mere: '', profession_mere: '',
    personne_urgence: '', ecole: '', classe: '', portfolio: '', realisation: '',
    nom_tuteur: '', prenom_tuteur: '', contact_tuteur: '',
    nom_tutrice: '', prenom_tutrice: '', contact_tutrice: '',
    communaute: '', est_catechumene: false, est_bapteme: false,
    est_premiere_communion: false, est_confirmation: false,
    nombre_presence: 0, nombre_presence_totale: 0
  });

  // 🔥 HANDLER SIMPLIFIÉ - Compatible avec le composant générique
  const handlePhotoUpdate = (photoUrl: string) => {
    setStudent(prev => prev ? { ...prev, photo: photoUrl } : null);
  };

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`http://localhost:4400/api/enfants-vacance/${params.id}`);
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
            nom_mere: studentData.nom_mere ?? '',
            profession_mere: studentData.profession_mere ?? '',
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
      const response = await axios.post('http://localhost:4400/api/details-enfant-vacance', {
        enfant_id: params.id,
        ...formData
      });

      if (response.data.success) {
        const updatedResponse = await axios.get(`http://localhost:4400/api/enfants-vacance/${params.id}`);
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
            {student?.domicile ? 'Modifier les détails' : 'Ajouter des détails'}
          </button>
        </div>

        {/* Card principale */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-sky-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent mb-2">
              Détails de l&apos;enfant - {student?.prenom} {student?.nom}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-sky-400 to-blue-500 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* 🔥 UTILISATION DU COMPOSANT GÉNÉRIQUE */}
          {student && (
            <ImageUpload
              entityId={student.id}
              entityType="vacance_enfant"
              currentPhoto={student.photo}
              onPhotoUpdate={handlePhotoUpdate}
              label="l'enfant"
            />
          )}

          {/* Grid des informations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <CardSection title="Informations de base">
              <InfoField label="Année" value={student?.annee} />
              <InfoField label="Nom" value={student?.nom} />
              <InfoField label="Prénom" value={student?.prenom} />
              <InfoField label="Naissance" value={student?.naissance} />
              <InfoField label="Section" value={student?.section} />
              <InfoField label="Sexe" value={student?.sexe} />
              <InfoField label="Religion" value={student?.religion} />
              <InfoField label="Nombre de présence" value={student?.nombre_presence} />
              <InfoField label="Nombre de présence totale" value={student?.nombre_presence_totale} />
            </CardSection>

            <CardSection title="Adresse">
              <InfoField label="Domicile" value={student?.domicile} />
              <InfoField label="Quartier" value={student?.quartier} />
              <InfoField label="Rue" value={student?.rue} />
              <InfoField label="Lot" value={student?.lot} />
            </CardSection>

            {student?.religion?.toLowerCase() === "chrétien catholique" && (
              <CardSection title="Informations religieuses">
                <InfoField label="Communauté" value={student?.communaute} />
                <InfoField label="Catéchumène" value={student?.est_catechumene ? "Oui" : "Non"} />
                <InfoField label="Baptême" value={student?.est_bapteme ? "Oui" : "Non"} />
                <InfoField label="1ère communion" value={student?.est_premiere_communion ? "Oui" : "Non"} />
                <InfoField label="Confirmation" value={student?.est_confirmation ? "Oui" : "Non"} />
              </CardSection>
            )}

            <CardSection title="Parents">
              <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 space-y-3">
                <h4 className="font-semibold text-blue-700 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Père
                </h4>
                <InfoField label="Nom du père" value={student?.nom_pere} />
                <InfoField label="Profession du père" value={student?.profession_pere} />
              </div>

              <div className="bg-pink-50/50 p-4 rounded-lg border border-pink-100 space-y-3">
                <h4 className="font-semibold text-pink-700 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Mère
                </h4>
                <InfoField label="Nom de la mère" value={student?.nom_mere} />
                <InfoField label="Profession de la mère" value={student?.profession_mere} />
              </div>

              <div className="bg-red-50/50 p-4 rounded-lg border border-red-100">
                <InfoField label="Contact d'urgence" value={student?.personne_urgence} />
              </div>
            </CardSection>

            <CardSection title="Tuteur / Tutrice">
              <div className="bg-green-50/50 p-4 rounded-lg border border-green-100 space-y-3">
                <h4 className="font-semibold text-green-700 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Tuteur
                </h4>
                <InfoField label="Nom du tuteur" value={student?.nom_tuteur} />
                <InfoField label="Prénom du tuteur" value={student?.prenom_tuteur} />
                <InfoField label="Contact du tuteur" value={student?.contact_tuteur} />
              </div>

              <div className="bg-purple-50/50 p-4 rounded-lg border border-purple-100 space-y-3">
                <h4 className="font-semibold text-purple-700 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Tutrice
                </h4>
                <InfoField label="Nom de la tutrice" value={student?.nom_tutrice} />
                <InfoField label="Prénom de la tutrice" value={student?.prenom_tutrice} />
                <InfoField label="Contact de la tutrice" value={student?.contact_tutrice} />
              </div>
            </CardSection>

            <CardSection title="Scolarité">
              <div className="bg-amber-50/50 p-4 rounded-lg border border-amber-100 space-y-3">
                <h4 className="font-semibold text-amber-700 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                  Informations scolaires
                </h4>
                <InfoField label="École" value={student?.ecole} />
                <InfoField label="Classe" value={student?.classe} />
              </div>
            </CardSection>

            <CardSection title="Réalisations" full>
              <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-6 rounded-lg border border-sky-100 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <h4 className="font-bold text-sky-700 text-lg">Achievements & Portfolio</h4>
                </div>
                <InfoField label="Portfolio" value={student?.portfolio} />
                <InfoField label="Réalisations" value={student?.realisation} />
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