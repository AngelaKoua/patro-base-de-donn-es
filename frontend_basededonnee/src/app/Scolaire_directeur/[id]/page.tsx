'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
// 🔥 IMPORT DU COMPOSANT GÉNÉRIQUE
import ImageUpload from '@/components/ImageUpload';

interface Directeur {
  id: number;
  annee: number;
  nom: string;
  prenom: string;
  fonction: string;
  naissance: string;
  photo?: string;
  realisation?: string;
  email?: string;
  whatsapp?: string;
  autre_contact?: string;
}

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

export default function DetailDirecteurPage() {
  const router = useRouter();
  const params = useParams();
  const [directeur, setDirecteur] = useState<Directeur | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRealModal, setShowRealModal] = useState(false);
  const [realisation, setRealisation] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [autreContact, setAutreContact] = useState('');

  // 🔥 HANDLER SIMPLIFIÉ - Compatible avec le composant générique
  const handlePhotoUpdate = (photoUrl: string) => {
    setDirecteur(prev => prev ? { ...prev, photo: photoUrl } : null);
  };

  useEffect(() => {
    const fetchDirecteur = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4400/api/directeurs/${params.id}?_t=${Date.now()}`
        );

        if (response.data.success && response.data.directeur) {
          setDirecteur(response.data.directeur);
          setRealisation(response.data.directeur.realisation || '');
          setEmail(response.data.directeur.email || '');
          setWhatsapp(response.data.directeur.whatsapp || '');
          setAutreContact(response.data.directeur.autre_contact || '');
        }
      } catch (error) {
        console.error('Erreur:', error);
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
      const response = await axios.post('http://localhost:4400/api/details-directeur', {
        directeur_id: params.id,
        realisation,
        email,
        whatsapp,
        autre_contact: autreContact,
      });
      if (response.data.success) {
        setDirecteur(prev => prev ? { ...prev, realisation, email, whatsapp, autre_contact: autreContact } : null);
        setShowRealModal(false);
        alert('Détails enregistrés avec succès');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'ajout des détails');
    }
  };

  if (loading) return <div className="p-8 text-sky-600">Chargement...</div>;
  if (!directeur) return <div className="p-8 text-red-500">Directeur non trouvé.</div>;

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
            onClick={() => setShowRealModal(true)}
            className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {directeur?.realisation ? 'Modifier les détails' : 'Ajouter des détails'}
          </button>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-sky-100">
          {/* Title Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent mb-2">
              Détails du directeur
            </h1>
            <p className="text-xl text-sky-600 font-semibold">
              {directeur?.prenom} {directeur?.nom}
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-sky-400 to-blue-500 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* 🔥 UTILISATION DU COMPOSANT GÉNÉRIQUE */}
          {directeur && (
            <ImageUpload
              entityId={directeur.id}
              entityType="directeur"
              currentPhoto={directeur.photo}
              onPhotoUpdate={handlePhotoUpdate}
              label="le directeur"
            />
          )}

          {/* Infos harmonisées */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CardSection title="Informations de base">
              <InfoField label="Nom" value={directeur?.nom} />
              <InfoField label="Prénom" value={directeur?.prenom} />
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
              <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-6 rounded-lg border border-sky-100 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <h4 className="font-bold text-sky-700 text-lg">Achievements & Portfolio</h4>
                </div>
                <InfoField label="Réalisation" value={directeur?.realisation} />
              </div>
            </CardSection>
          </div>
        </div>
      </div>

      {/* Modal en overlay */}
      {showRealModal && (
        <div className="fixed inset-0 bg-blue-50/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-blue-100 overflow-hidden">
            {/* En-tête */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-5 border-b border-blue-200">
              <div className="flex items-center">
                <div className="bg-blue-600 p-2 rounded-lg mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-blue-800">Détails du directeur</h2>
                  <p className="text-sm text-blue-600 mt-1">Renseignez les informations de contact</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleRealisationSubmit} className="p-6 space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2.5 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors placeholder-blue-300"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="exemple@email.com"
                />
              </div>

              {/* Whatsapp */}
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Contact Whatsapp
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors placeholder-blue-300"
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                  placeholder="+33 6 12 34 56 78"
                />
              </div>

              {/* Autre contact */}
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  Autre contact
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors placeholder-blue-300"
                  value={autreContact}
                  onChange={e => setAutreContact(e.target.value)}
                  placeholder="Téléphone fixe ou autre"
                />
              </div>

              {/* Réalisation */}
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  Réalisation
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors min-h-[120px] placeholder-blue-300"
                  value={realisation}
                  onChange={e => setRealisation(e.target.value)}
                  placeholder="Décrivez les réalisations..."
                />
              </div>

              {/* Boutons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRealModal(false)}
                  className="px-5 py-2.5 border border-blue-300 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-blue-200 flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
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