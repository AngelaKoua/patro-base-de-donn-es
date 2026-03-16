'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
// 🔥 IMPORT DU COMPOSANT GÉNÉRIQUE
import ImageUpload from '@/components/ImageUpload';

interface VacanceDirecteur {
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
    setDirecteur(prev => prev ? { ...prev, photo: photoUrl } : null);
  };

  useEffect(() => {
    const fetchDirecteur = async () => {
      try {
        const response = await axios.get(`http://localhost:4400/api/directeurs-vacance/${params.id}`);
        console.log('Réponse du serveur:', response.data);

        if (response.data.success && response.data.directeur) {
          const directeurData = response.data.directeur;
          setDirecteur(directeurData);

          setRealisation(directeurData.realisation || '');
          setEmail(directeurData.email || '');
          setWhatsapp(directeurData.whatsapp || '');
          setAutreContact(directeurData.autre_contact || '');

          console.log('États mis à jour:', {
            realisation: directeurData.realisation,
            email: directeurData.email,
            whatsapp: directeurData.whatsapp,
            autre_contact: directeurData.autre_contact
          });
        }
      } catch (error: any) {
        console.error('Erreur lors du chargement:', error.response?.data || error.message);
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
      const response = await axios.post(`http://localhost:4400/api/details-vacance-directeur/${params.id}`, {
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
    } catch (error: any) {
      console.error('Erreur détaillée:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Erreur lors de l\'ajout des détails');
    }
  };

  if (loading) return <div className="p-8 text-sky-600">Chargement...</div>;

  return (
    <div className="p-6 bg-gradient-to-b from-sky-50 via-gray-50 to-rose-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.back()}
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg shadow-sm transition"
        >
          Retour
        </button>
        <button
          onClick={() => setShowRealModal(true)}
          className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg shadow-sm transition"
        >
          {directeur?.realisation ? 'Modifier la réalisation' : 'Ajouter une réalisation'}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-sky-700">
          Détails du directeur - {directeur?.prenom} {directeur?.nom}
        </h1>

        {/* 🔥 UTILISATION DU COMPOSANT GÉNÉRIQUE */}
        {directeur && (
          <ImageUpload
            entityId={directeur.id}
            entityType="vacance_directeur"
            currentPhoto={directeur.photo}
            onPhotoUpdate={handlePhotoUpdate}
            label="le directeur"
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardSection title="Informations de base">
            <InfoField label="Nom" value={directeur?.nom} />
            <InfoField label="Prénom" value={directeur?.prenom} />
            <InfoField label="Fonction" value={directeur?.fonction} />
            <InfoField label="Année" value={directeur?.annee} />
            <InfoField label="Naissance" value={directeur?.naissance} />
          </CardSection>

          <CardSection title="Contact" full>
            <InfoField label="Email" value={directeur?.email} />
            <InfoField label="Whatsapp" value={directeur?.whatsapp} />
            <InfoField label="Autre contact" value={directeur?.autre_contact} />
          </CardSection>

          <CardSection title="Réalisation" full>
            <InfoField label="Réalisation" value={directeur?.realisation} />
          </CardSection>
        </div>
      </div>

      {/* Modal */}
      {showRealModal && (
        <div className="fixed inset-0 bg-blue-50/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-blue-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-200">
              <h2 className="text-xl font-bold text-blue-800 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Détails du directeur
              </h2>
            </div>

            <form onSubmit={handleRealisationSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    className="pl-10 w-full px-4 py-2.5 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Contact Whatsapp</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="pl-10 w-full px-4 py-2.5 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                    value={whatsapp}
                    onChange={e => setWhatsapp(e.target.value)}
                    placeholder="Numéro Whatsapp"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Autre contact</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="pl-10 w-full px-4 py-2.5 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                    value={autreContact}
                    onChange={e => setAutreContact(e.target.value)}
                    placeholder="Autre moyen de contact"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Réalisation du directeur</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <textarea
                    className="pl-10 w-full px-4 py-2.5 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors min-h-[120px]"
                    value={realisation}
                    onChange={e => setRealisation(e.target.value)}
                    placeholder="Décrivez la réalisation..."
                  />
                </div>
              </div>

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

// Composants réutilisables
const InfoField = ({ label, value }: { label: string; value?: string | number }) => (
  value ? (
    <div className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <p className="text-base text-gray-800">{value}</p>
    </div>
  ) : null
);

const CardSection = ({ title, children, full }: { title: string; children: React.ReactNode; full?: boolean }) => (
  <div className={`${full ? "col-span-2" : ""} bg-gradient-to-r from-sky-50 via-white to-rose-50 p-4 rounded-xl shadow-sm`}>
    <h2 className="text-lg font-semibold text-sky-600 mb-3">{title}</h2>
    <div className="space-y-2">{children}</div>
  </div>
);