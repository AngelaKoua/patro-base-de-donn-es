"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
// 🔥 IMPORT DU COMPOSANT GÉNÉRIQUE
import ImageUpload from '@/components/ImageUpload';
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
  personne_urgence?: string;
  ecole: string;
  classe: string;
  portfolio: string;
  realisation: string;
  photo_url?: string;
  nombre_presences?: number;
  nombre_presences_total?: number;
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
  annee_premiere_communion?: string;
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
  nom_tutrice: string;
  prenom_tutrice: string;
  contact_tutrice: string;
  communaute: string;
  est_catechumene: boolean;
  est_bapteme: boolean;
  est_premiere_communion: boolean;
  est_confirmation: boolean;
  annee_bapteme: string;
  annee_premiere_communion: string;
  annee_confirmation: string;
  nombre_presences: string;
  nombre_presences_total: string;
}

// ============================================
// COMPOSANTS DE FORMULAIRE
// ============================================

type InputFieldProps = {
  icon: string;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const InputField: React.FC<InputFieldProps> = ({ icon, label, name, value, onChange }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-semibold text-sky-700 flex items-center gap-2 mb-1">
      <FieldIcon icon={icon} /> {label}
    </label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border-2 border-sky-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all bg-sky-50/50 text-gray-800 placeholder-gray-400 shadow-sm"
      autoComplete="off"
    />
  </div>
);

type CheckboxFieldProps = {
  label: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  color: string;
};

const CheckboxField: React.FC<CheckboxFieldProps> = ({ label, name, checked, onChange, color }) => (
  <label className={`flex items-center gap-2 font-medium text-${color}-700 bg-${color}-50/60 px-3 py-2 rounded-lg border border-${color}-200 shadow-sm cursor-pointer transition-all`}>
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className={`accent-${color}-500 w-5 h-5 rounded focus:ring-2 focus:ring-${color}-400 transition-all`}
    />
    {label}
  </label>
);

type FieldIconProps = { icon: string };
const FieldIcon: React.FC<FieldIconProps> = ({ icon }) => {
  switch (icon) {
    case 'home':
      return <svg className="h-5 w-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7m-9 2v6a2 2 0 002 2h2a2 2 0 002-2v-6m-6 0h6" /></svg>;
    case 'map':
      return <svg className="h-5 w-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A2 2 0 013 15.382V5.618a2 2 0 011.553-1.894l5.447-2.724a2 2 0 011.894 0l5.447 2.724A2 2 0 0121 5.618v9.764a2 2 0 01-1.553 1.894L15 20m-6 0v-8" /></svg>;
    case 'road':
      return <svg className="h-5 w-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3v18M18 3v18M6 9h12M6 15h12" /></svg>;
    case 'hashtag':
      return <svg className="h-5 w-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 10h10M7 14h10M9 3v18M15 3v18" /></svg>;
    case 'user':
      return <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z" /></svg>;
    case 'briefcase':
      return <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m2 0a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v3a2 2 0 002 2m10 0v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6" /></svg>;
    case 'phone':
      return <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm0 8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2zm8-8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zm8-8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
    case 'siren':
      return <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    case 'school':
      return <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
    case 'book':
      return <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20h9M12 4h9M4 6v14a2 2 0 002 2h12a2 2 0 002-2V6" /></svg>;
    case 'star':
      return <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.286 7.07a1 1 0 00.95.69h7.451c.969 0 1.371 1.24.588 1.81l-6.034 4.386a1 1 0 00-.364 1.118l2.286 7.07c.3.921-.755 1.688-1.54 1.118l-6.034-4.386a1 1 0 00-1.176 0l-6.034 4.386c-.784.57-1.838-.197-1.54-1.118l2.286-7.07a1 1 0 00-.364-1.118L2.025 12.497c-.783-.57-.38-1.81.588-1.81h7.451a1 1 0 00.95-.69l2.286-7.07z" /></svg>;
    case 'award':
      return <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>;
    case 'users':
      return <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 10-8 0 4 4 0 008 0zm6 4v2a2 2 0 01-2 2h-4a2 2 0 01-2-2v-2a2 2 0 012-2h4a2 2 0 012 2z" /></svg>;
    default:
      return null;
  }
};

type DetailsPopupFormProps = {
  isOpen: boolean;
  onClose: () => void;
  formData: DetailFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  religion?: string;
};

const DetailsPopupForm: React.FC<DetailsPopupFormProps> = ({
  isOpen,
  onClose,
  formData,
  handleChange,
  handleSubmit,
  religion
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-sky-100 animate-fadeIn">
        <div className="sticky top-0 bg-gradient-to-r from-sky-600 to-blue-700 p-8 rounded-t-3xl flex justify-between items-center shadow-md">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-wide drop-shadow-lg">Modifier les détails</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Fermer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form className="p-8 space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Adresse */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-sky-700 flex items-center gap-2 mb-2">
                <span className="w-2 h-2 bg-sky-500 rounded-full"></span> Adresse
              </h3>
              <InputField icon="home" label="Domicile" name="domicile" value={formData.domicile} onChange={handleChange} />
              <InputField icon="map" label="Quartier" name="quartier" value={formData.quartier} onChange={handleChange} />
              <InputField icon="road" label="Rue" name="rue" value={formData.rue} onChange={handleChange} />
              <InputField icon="hashtag" label="Lot" name="lot" value={formData.lot} onChange={handleChange} />
            </div>

            {/* Parents */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-blue-700 flex items-center gap-2 mb-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Parents
              </h3>
              <InputField icon="user" label="Nom du père" name="nom_pere" value={formData.nom_pere} onChange={handleChange} />
              <InputField icon="briefcase" label="Profession du père" name="profession_pere" value={formData.profession_pere} onChange={handleChange} />
              <InputField icon="phone" label="Contact du père" name="contact_pere" value={formData.contact_pere} onChange={handleChange} />
              <InputField icon="user" label="Nom de la mère" name="nom_mere" value={formData.nom_mere} onChange={handleChange} />
              <InputField icon="briefcase" label="Profession de la mère" name="profession_mere" value={formData.profession_mere} onChange={handleChange} />
              <InputField icon="phone" label="Contact de la mère" name="contact_mere" value={formData.contact_mere} onChange={handleChange} />
              <InputField icon="siren" label="Personne à joindre en cas d'urgence" name="personne_urgence" value={formData.personne_urgence} onChange={handleChange} />
            </div>

            {/* Tuteur/Tutrice */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-green-700 flex items-center gap-2 mb-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span> Tuteur / Tutrice
              </h3>
              <InputField icon="user" label="Nom du tuteur" name="nom_tuteur" value={formData.nom_tuteur} onChange={handleChange} />
              <InputField icon="user" label="Prénom du tuteur" name="prenom_tuteur" value={formData.prenom_tuteur} onChange={handleChange} />
              <InputField icon="phone" label="Contact du tuteur" name="contact_tuteur" value={formData.contact_tuteur} onChange={handleChange} />
              <InputField icon="user" label="Nom de la tutrice" name="nom_tutrice" value={formData.nom_tutrice} onChange={handleChange} />
              <InputField icon="user" label="Prénom de la tutrice" name="prenom_tutrice" value={formData.prenom_tutrice} onChange={handleChange} />
              <InputField icon="phone" label="Contact de la tutrice" name="contact_tutrice" value={formData.contact_tutrice} onChange={handleChange} />
            </div>

            {/* Scolarité */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-amber-700 flex items-center gap-2 mb-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span> Scolarité & Réalisations
              </h3>
              <InputField icon="school" label="École" name="ecole" value={formData.ecole} onChange={handleChange} />
              <InputField icon="book" label="Classe" name="classe" value={formData.classe} onChange={handleChange} />
              <InputField icon="star" label="Portfolio" name="portfolio" value={formData.portfolio} onChange={handleChange} />
              <InputField icon="award" label="Réalisations" name="realisation" value={formData.realisation} onChange={handleChange} />
            </div>

            {/* Présences */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-bold text-sky-700 flex items-center gap-2 mb-2">
                <span className="w-2 h-2 bg-sky-500 rounded-full"></span> Présences
              </h3>
              <div className="flex flex-col md:flex-row gap-4">
                <InputField icon="star" label="Nombre de présences" name="nombre_presences" value={formData.nombre_presences} onChange={handleChange} />
                <InputField icon="star" label="Nombre de présence total" name="nombre_presences_total" value={formData.nombre_presences_total} onChange={handleChange} />
              </div>
            </div>

            {/* Infos religieuses (conditionnelles) */}
            {religion && religion.toLowerCase() === "chrétien catholique" && (
              <div className="space-y-4 md:col-span-2">
                <h3 className="text-lg font-bold text-purple-700 flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span> Informations religieuses
                </h3>
                <InputField icon="users" label="Communauté" name="communaute" value={formData.communaute} onChange={handleChange} />
                <div className="flex flex-wrap gap-6 mt-2">
                  <CheckboxField label="Catéchumène" name="est_catechumene" checked={formData.est_catechumene} onChange={handleChange} color="sky" />
                  <CheckboxField label="Baptême" name="est_bapteme" checked={formData.est_bapteme} onChange={handleChange} color="blue" />
                  <CheckboxField label="1ère communion" name="est_premiere_communion" checked={formData.est_premiere_communion} onChange={handleChange} color="amber" />
                  <CheckboxField label="Confirmation" name="est_confirmation" checked={formData.est_confirmation} onChange={handleChange} color="purple" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                  <InputField icon="star" label="Année de baptême" name="annee_bapteme" value={formData.annee_bapteme} onChange={handleChange} />
                  <InputField icon="star" label="Année de 1ère communion" name="annee_premiere_communion" value={formData.annee_premiere_communion} onChange={handleChange} />
                  <InputField icon="star" label="Année de confirmation" name="annee_confirmation" value={formData.annee_confirmation} onChange={handleChange} />
                </div>
              </div>
            )}
          </div>

          {/* Boutons */}
          <div className="flex justify-end mt-8 gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold shadow hover:bg-gray-300 transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-8 py-2 rounded-lg font-bold shadow hover:from-sky-600 hover:to-blue-700 transition-all"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export default function DetailPage() {
  const router = useRouter();
  const params = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<DetailFormData>({
    domicile: '', quartier: '', rue: '', lot: '',
    nom_pere: '', profession_pere: '', contact_pere: '',
    nom_mere: '', profession_mere: '', contact_mere: '',
    personne_urgence: '',
    ecole: '', classe: '', portfolio: '', realisation: '',
    nom_tuteur: '', prenom_tuteur: '', contact_tuteur: '',
    nom_tutrice: '', prenom_tutrice: '', contact_tutrice: '',
    communaute: '', est_catechumene: false, est_bapteme: false,
    est_premiere_communion: false, est_confirmation: false,
    annee_bapteme: '', annee_premiere_communion: '', annee_confirmation: '',
    nombre_presences: '',
    nombre_presences_total: ''
  });

  // 🔥 HANDLER SIMPLIFIÉ - Compatible avec le composant générique
  const handlePhotoUpdate = (photoUrl: string) => {
    setStudent(prev => prev ? { ...prev, photo_url: photoUrl } : null);
  };

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setError(null);
        const response = await axios.get(`${API_URL}/api/enfant/${params.id}`);

        if (response.data.success && response.data.enfant) {
          const studentData = response.data.enfant;
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
            annee_premiere_communion: studentData.annee_premiere_communion ?? '',
            annee_confirmation: studentData.annee_confirmation ?? '',
            nombre_presences: studentData.nombre_presences?.toString() ?? '',
            nombre_presences_total: studentData.nombre_presences_total?.toString() ?? ''
          });
        } else {
          setError('Aucun élève trouvé.');
        }
      } catch (error) {
        setError('Erreur lors du chargement des données.');
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
      const response = await axios.post(`${API_URL}/api/details-enfant`, {
        enfant_id: params.id,
        ...formData
      });

      if (response.data.success) {
        const updatedResponse = await axios.get(`${API_URL}/api/enfant/${params.id}`);
        if (updatedResponse.data.success) {
          setStudent(updatedResponse.data.enfant);
          setShowForm(false);
          alert('Détails enregistrés avec succès');
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'ajout des détails');
    }
  };

  if (loading) return <div className="p-8 text-center text-lg font-semibold">Chargement...</div>;
  if (error) return <div className="p-8 text-center text-lg font-semibold text-rose-600">{error}</div>;

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
              entityType="enfant"
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
                    <StatusChip label="Baptême" active={!!student?.est_bapteme} />
                    <StatusChip
                      label="1ère communion"
                      active={!!student?.est_premiere_communion}
                      sub={
                        student?.est_premiere_communion &&
                        student?.annee_premiere_communion &&
                        student.annee_premiere_communion !== '0'
                          ? student.annee_premiere_communion
                          : undefined
                      }
                    />
                    <StatusChip
                      label="Confirmation"
                      active={!!student?.est_confirmation}
                      sub={
                        student?.est_confirmation &&
                        student?.annee_confirmation &&
                        student.annee_confirmation !== '0'
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
              <InfoField label="Nombre de présences" value={student?.nombre_presences?.toString()} />
              <InfoField label="Nombre de présence total" value={student?.nombre_presences_total?.toString()} />
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