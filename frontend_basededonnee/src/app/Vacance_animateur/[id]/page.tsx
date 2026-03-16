'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
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
  religion?: string;
  photo?: string;
  email?: string;
  contact_whatsapp?: string;
  autre_contact?: string;
  realisation?: string;
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

export default function DetailVacanceAnimateurPage() {
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
  const [fetchError, setFetchError] = useState<string | null>(null);

  const handlePhotoUpdate = (photoUrl: string) => {
    setAnimateur(prev => prev ? { ...prev, photo: photoUrl } : null);
  };

  // Fetch UN animateur par son ID
  useEffect(() => {
    const fetchAnimateur = async () => {
      try {
        console.log('📋 Récupération de l\'animateur ID:', params.id);
        const response = await axios.get(`http://localhost:4400/api/vacance-animateurs/${params.id}`);

        if (response.data.success && response.data.animateur) {
          console.log('✅ Animateur trouvé:', response.data.animateur);
          setAnimateur(response.data.animateur);
          setFormData({
            email: response.data.animateur.email ?? '',
            contact_whatsapp: response.data.animateur.contact_whatsapp ?? '',
            autre_contact: response.data.animateur.autre_contact ?? '',
            religion: response.data.animateur.religion ?? '',
            realisation: response.data.animateur.realisation ?? '',
            communaute: response.data.animateur.communaute ?? '',
            est_catechumene: response.data.animateur.est_catechumene ?? false,
            est_bapteme: response.data.animateur.est_bapteme ?? false,
            est_premiere_communion: response.data.animateur.est_premiere_communion ?? false,
            est_confirmation: response.data.animateur.est_confirmation ?? false
          });
        } else {
          setFetchError('Animateur non trouvé');
        }
      } catch (error) {
        console.error('❌ Erreur:', error);
        setFetchError('Impossible de charger l\'animateur');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchAnimateur();
    }
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
      console.log('📤 Envoi des détails:', { animateur_id: params.id, ...formData });
      const response = await axios.post('http://localhost:4400/api/details-vacance-animateur', {
        animateur_id: params.id,
        ...formData
      });

      if (response.data.success) {
        const updatedResponse = await axios.get(`http://localhost:4400/api/vacance-animateurs/${params.id}`);

        if (updatedResponse.data.success && updatedResponse.data.animateur) {
          setAnimateur(updatedResponse.data.animateur);
          setShowForm(false);
          alert('Détails enregistrés avec succès');
        }
      }
    } catch (error: any) {
      console.error('❌ Erreur:', error);
      alert('Erreur lors de l\'ajout des détails: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return <div className="p-8 text-sky-600">Chargement...</div>;
  if (fetchError) {
    return (
      <div className="p-8 text-red-600 bg-red-50 border border-red-200 rounded-xl m-8">
        <strong>Erreur :</strong> {fetchError}
      </div>
    );
  }
  if (!animateur) {
    return (
      <div className="p-8 text-gray-600 bg-gray-50 border border-gray-200 rounded-xl m-8">
        Aucun animateur trouvé pour cet ID.
      </div>
    );
  }

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
          onClick={() => setShowForm(true)}
          className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg shadow-sm transition"
        >
          {animateur?.email ? 'Modifier les détails' : 'Ajouter des détails'}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-sky-700">
          Détails de l&apos;animateur - {animateur?.prenom} {animateur?.nom}
        </h1>

        {animateur && (
          <ImageUpload
            entityId={animateur.id}
            entityType="vacance_animateur"
            currentPhoto={animateur.photo}
            onPhotoUpdate={handlePhotoUpdate}
            label="l'animateur"
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardSection title="Informations de base">
            <InfoField label="Nom" value={animateur?.nom} />
            <InfoField label="Prénom" value={animateur?.prenom} />
            <InfoField label="Fonction" value={animateur?.fonction} />
            <InfoField label="Naissance" value={animateur?.naissance} />
            <InfoField label="Sexe" value={animateur?.sexe} />
            <InfoField label="Section" value={animateur?.section} />
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
              <InfoField label="Baptême" value={animateur?.est_bapteme ? "Oui" : "Non"} />
              <InfoField label="1ère communion" value={animateur?.est_premiere_communion ? "Oui" : "Non"} />
              <InfoField label="Confirmation" value={animateur?.est_confirmation ? "Oui" : "Non"} />
            </CardSection>
          )}

          <CardSection title="Réalisations" full>
            <InfoField label="Réalisations" value={animateur?.realisation} />
          </CardSection>
        </div>

        <DetailsPopupFormAnimateur
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          religion={formData.religion}
        />
      </div>
    </div>
  );
}

// ✅ Composants réutilisables CORRIGÉS
const InfoField = ({ label, value }: { label: string; value?: string | number | boolean }) => (
  <div className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
    <span className="text-sm font-medium text-gray-500">{label}</span>
    <p className={`text-base ${value ? 'text-gray-800' : 'text-gray-400 italic'}`}>
      {value || 'Non renseigné'}
    </p>
  </div>
);

const CardSection = ({ title, children, full }: { title: string; children: React.ReactNode; full?: boolean }) => (
  <div className={`${full ? "col-span-2" : ""} bg-gradient-to-r from-sky-50 via-white to-rose-50 p-4 rounded-xl shadow-sm`}>
    <h2 className="text-lg font-semibold text-sky-600 mb-3">{title}</h2>
    <div className="space-y-2">{children}</div>
  </div>
);