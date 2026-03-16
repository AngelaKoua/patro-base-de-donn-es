'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
// 🔥 IMPORT DU COMPOSANT GÉNÉRIQUE
import ImageUpload from '@/components/ImageUpload';

interface Aumonier {
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

export default function DetailVacanceAumonierPage() {
  const router = useRouter();
  const params = useParams();
  const [aumonier, setAumonier] = useState<Aumonier | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRealModal, setShowRealModal] = useState(false);
  const [realisation, setRealisation] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [autreContact, setAutreContact] = useState('');

  // 🔥 HANDLER SIMPLIFIÉ - Compatible avec le composant générique
  const handlePhotoUpdate = (photoUrl: string) => {
    setAumonier(prev => prev ? { ...prev, photo: photoUrl } : null);
  };

  useEffect(() => {
    const fetchAumonier = async () => {
      try {
        const response = await axios.get(`http://localhost:4400/api/vacance-aumoniers/${params.id}`);
        if (response.data.success && response.data.aumonier) {
          setAumonier(response.data.aumonier);
          setRealisation(response.data.aumonier.realisation || '');
          setEmail(response.data.aumonier.email || '');
          setWhatsapp(response.data.aumonier.whatsapp || '');
          setAutreContact(response.data.aumonier.autre_contact || '');
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchAumonier();
  }, [params.id]);

  const handleRealisationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Envoi des détails:', { realisation, email, whatsapp, autre_contact: autreContact });

      const response = await axios.post(`http://localhost:4400/api/details-vacance-aumonier/${params.id}`, {
        realisation,
        email,
        whatsapp,
        autre_contact: autreContact,
      });

      console.log('Réponse du serveur:', response.data);

      if (response.data.success) {
        setAumonier(prev => prev ? {
          ...prev,
          realisation,
          email,
          whatsapp,
          autre_contact: autreContact
        } : null);
        setShowRealModal(false);
        alert('Détails enregistrés avec succès');
      }
    } catch (error) {
      console.error('Erreur détaillée:', error instanceof Error ? error.message : 'Erreur inconnue');
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || 'Erreur lors de l\'ajout des détails');
      } else {
        alert('Erreur lors de l\'ajout des détails');
      }
    }
  };

  if (loading) return <div className="p-8 text-sky-600">Chargement...</div>;
  if (!aumonier) return <div className="p-8 text-red-500">Aumônier non trouvé.</div>;

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
          Ajout de détail
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-sky-700">
          Détails de l&apos;aumônier - {aumonier?.prenom} {aumonier?.nom}
        </h1>

        {/* 🔥 UTILISATION DU COMPOSANT GÉNÉRIQUE */}
        {aumonier && (
          <ImageUpload
            entityId={aumonier.id}
            entityType="vacance_aumonier"
            currentPhoto={aumonier.photo}
            onPhotoUpdate={handlePhotoUpdate}
            label="l'aumônier"
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardSection title="Informations de base">
            <InfoField label="Nom" value={aumonier?.nom} />
            <InfoField label="Prénom" value={aumonier?.prenom} />
            <InfoField label="Fonction" value={aumonier?.fonction} />
            <InfoField label="Année" value={aumonier?.annee} />
            <InfoField label="Naissance" value={aumonier?.naissance} />
          </CardSection>

          <CardSection title="Contact" full>
            <InfoField label="Email" value={aumonier?.email} />
            <InfoField label="Whatsapp" value={aumonier?.whatsapp} />
            <InfoField label="Autre contact" value={aumonier?.autre_contact} />
          </CardSection>

          <CardSection title="Réalisation" full>
            <InfoField label="Réalisation" value={aumonier?.realisation} />
          </CardSection>
        </div>
      </div>

      {/* Modal */}
      {showRealModal && (
        <div className="fixed inset-0 bg-blue-50/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-blue-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-5 border-b border-blue-200">
              <div className="flex items-center">
                <div className="bg-blue-600 p-2 rounded-lg mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-blue-800">Détails de l&apos;aumônier</h2>
              </div>
              <p className="text-sm text-blue-600 mt-1">Renseignez les informations de contact</p>
            </div>

            <form onSubmit={handleRealisationSubmit} className="p-6 space-y-5">
              <div>
                <label className="flex items-center text-sm font-medium text-blue-700 mb-2">
                  <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
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

              <div>
                <label className="flex items-center text-sm font-medium text-blue-700 mb-2">
                  <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
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

              <div>
                <label className="flex items-center text-sm font-medium text-blue-700 mb-2">
                  <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
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

              <div>
                <label className="flex items-center text-sm font-medium text-blue-700 mb-2">
                  <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
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