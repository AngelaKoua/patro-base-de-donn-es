'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
// 🔥 IMPORT DU COMPOSANT GÉNÉRIQUE
import ImageUpload from '@/components/ImageUpload';
import { API_URL } from '@/lib/api';

interface VacanceDirecteur {
  id: number;
  annee: number;
  nom: string;
  prenom: string;
  fonction: string;
  naissance: string;
  photo_url?: string;
  realisation?: string;
  email?: string;
  whatsapp?: string;
  autre_contact?: string;
}

const InfoField = ({ label, value }: { label: string; value?: string | number }) => (
  <div className="flex items-center justify-between gap-4 py-2">
    <span className="text-xs font-medium text-sky-600/90">{label}</span>
    <span className={`text-sm text-right ${value ? 'text-gray-800 font-medium' : 'text-gray-400 italic'}`}>
      {value || 'Non renseigné'}
    </span>
  </div>
);

const TextBlock = ({ label, value }: { label: string; value?: string }) => (
  <div className="py-2">
    <span className="text-xs font-medium text-sky-600/90 block mb-1">{label}</span>
    <p className={`text-sm ${value ? 'text-gray-800' : 'text-gray-400 italic'}`}>
      {value || 'Non renseigné'}
    </p>
  </div>
);

const Badge = ({ label }: { label: string }) => (
  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sky-100 text-sky-700">
    {label}
  </span>
);

const CardSection = ({ title, children, full }: { title: string; children: React.ReactNode; full?: boolean }) => (
  <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-5 border border-sky-100 hover:shadow-lg transition-all duration-300 ${full ? 'md:col-span-2' : ''}`}>
    <h3 className="text-sm font-bold text-sky-700 mb-1 flex items-center gap-2 pb-2 border-b border-sky-100 uppercase tracking-wide">
      <div className="w-1.5 h-1.5 bg-sky-500 rounded-full"></div>
      {title}
    </h3>
    <div className="divide-y divide-sky-50">
      {children}
    </div>
  </div>
);

// ============================================
// COMPOSANTS DE FORMULAIRE (même design que Scolaire_enfant/[id])
// ============================================

const FieldIcon = ({ icon }: { icon: string }) => {
  switch (icon) {
    case 'mail':
      return <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
    case 'phone':
      return <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm0 8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2zm8-8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zm8-8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
    case 'award':
      return <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>;
    default:
      return null;
  }
};

const InputField = ({ icon, label, type = 'text', value, onChange, placeholder }: {
  icon: string; label: string; type?: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string;
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-semibold text-sky-700 flex items-center gap-2 mb-1">
      <FieldIcon icon={icon} /> {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border-2 border-sky-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all bg-sky-50/50 text-gray-800 placeholder-gray-400 shadow-sm"
      autoComplete="off"
    />
  </div>
);

const TextAreaField = ({ icon, label, value, onChange, placeholder }: {
  icon: string; label: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder?: string;
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-semibold text-sky-700 flex items-center gap-2 mb-1">
      <FieldIcon icon={icon} /> {label}
    </label>
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border-2 border-sky-100 rounded-lg px-4 py-2 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all bg-sky-50/50 text-gray-800 placeholder-gray-400 shadow-sm"
    />
  </div>
);

export default function DetailVacanceDirecteurPage() {
  const router = useRouter();
  const params = useParams();
  const [directeur, setDirecteur] = useState<VacanceDirecteur | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRealModal, setShowRealModal] = useState(false);
  const [realisation, setRealisation] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [autreContact, setAutreContact] = useState('');

  // 🔥 HANDLER SIMPLIFIÉ - Compatible avec le composant générique
  const handlePhotoUpdate = (photoUrl: string) => {
    setDirecteur(prev => prev ? { ...prev, photo_url: photoUrl } : null);
  };

  useEffect(() => {
    const fetchDirecteur = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/directeurs-vacance/${params.id}`);

        if (response.data.success && response.data.directeur) {
          const directeurData = response.data.directeur;
          setDirecteur(directeurData);

          setRealisation(directeurData.realisation || '');
          setEmail(directeurData.email || '');
          setWhatsapp(directeurData.whatsapp || '');
          setAutreContact(directeurData.autre_contact || '');
        }
      } catch (error: unknown) {
        console.error('Erreur lors du chargement:', axios.isAxiosError(error) ? error.response?.data : error);
        alert('Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchDirecteur();
  }, [params.id]);

  const handleRealisationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/details-vacance-directeur/${params.id}`, {
        realisation,
        email,
        whatsapp,
        autre_contact: autreContact,
      });
      if (response.data.success) {
        setDirecteur(prev => prev ? {
          ...prev,
          realisation,
          email,
          whatsapp,
          autre_contact: autreContact
        } : null);
        setShowRealModal(false);
        alert('Détails enregistrés avec succès');
      }
    } catch (error: unknown) {
      console.error('Erreur détaillée:', axios.isAxiosError(error) ? error.response?.data : error);
      const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
      alert(message || 'Erreur lors de l\'ajout des détails');
    }
  };

  if (loading) return <div className="p-4 sm:p-6 lg:p-8 text-sky-600">Chargement...</div>;
  if (!directeur) return <div className="p-4 sm:p-6 lg:p-8 text-red-500">Directeur non trouvé.</div>;

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
            onClick={() => setShowRealModal(true)}
            className="bg-sky-500 text-white hover:bg-sky-600 px-5 py-2.5 rounded-xl shadow-md transition-all duration-200 transform hover:scale-105 flex items-center gap-2 font-medium text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {directeur?.realisation ? 'Modifier les détails' : 'Ajouter des détails'}
          </button>
        </div>

        {/* Bandeau profil compact */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-4 sm:p-6 border border-sky-100 mb-6 flex flex-col sm:flex-row items-center sm:items-center gap-6">
          <ImageUpload
            entityId={directeur.id}
            entityType="vacance_directeur"
            currentPhoto={directeur.photo_url}
            onPhotoUpdate={handlePhotoUpdate}
            label="le directeur"
          />

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
              {directeur?.prenom} {directeur?.nom}
            </h1>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              {directeur?.fonction && <Badge label={directeur.fonction} />}
              {directeur?.annee && <Badge label={`Année ${directeur.annee}`} />}
            </div>
          </div>
        </div>

        {/* Card principale */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 border border-sky-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <CardSection title="Informations générales">
              <InfoField label="Fonction" value={directeur?.fonction} />
              <InfoField label="Année" value={directeur?.annee} />
              <InfoField label="Naissance" value={directeur?.naissance} />
            </CardSection>

            <CardSection title="Contact">
              <InfoField label="Email" value={directeur?.email} />
              <InfoField label="Whatsapp" value={directeur?.whatsapp} />
              <InfoField label="Autre contact" value={directeur?.autre_contact} />
            </CardSection>

            <CardSection title="Réalisation" full>
              <TextBlock label="Réalisation" value={directeur?.realisation} />
            </CardSection>
          </div>
        </div>
      </div>

      {/* Modal (même design que Scolaire_enfant/[id]) */}
      {showRealModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-sky-100 animate-fadeIn">
            <div className="sticky top-0 bg-gradient-to-r from-sky-600 to-blue-700 p-4 sm:p-6 lg:p-8 rounded-t-3xl flex justify-between items-center shadow-md">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 rounded-full p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-extrabold text-white tracking-wide drop-shadow-lg">
                  {directeur?.realisation ? 'Modifier les détails' : 'Ajouter des détails'}
                </h2>
              </div>
              <button
                onClick={() => setShowRealModal(false)}
                className="text-white hover:bg-white/20 rounded-full p-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Fermer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleRealisationSubmit} className="p-4 sm:p-6 lg:p-8 space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-blue-700 flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Contact
                </h3>
                <InputField icon="mail" label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com" />
                <InputField icon="phone" label="Contact Whatsapp" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="Numéro Whatsapp" />
                <InputField icon="phone" label="Autre contact" value={autreContact} onChange={e => setAutreContact(e.target.value)} placeholder="Autre moyen de contact" />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-amber-700 flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span> Réalisation
                </h3>
                <TextAreaField icon="award" label="Réalisation du directeur" value={realisation} onChange={e => setRealisation(e.target.value)} placeholder="Décrivez la réalisation..." />
              </div>

              <div className="flex justify-end mt-8 gap-4">
                <button
                  type="button"
                  onClick={() => setShowRealModal(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold shadow hover:bg-gray-300 transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-4 sm:px-6 lg:px-8 py-2 rounded-lg font-bold shadow hover:from-sky-600 hover:to-blue-700 transition-all"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
