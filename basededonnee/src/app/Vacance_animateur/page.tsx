
'use client';
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api';

interface AnimateurDetails {
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

interface Animateur {
  id: number;
  annee: number;
  numero_inscription: string;
  nom: string;
  prenom: string;
  fonction: string;
  naissance: string;
  sexe: string;
  section: string;
  religion: string;
  details?: AnimateurDetails | null;
}

const VacanceAnimateurPage = () => {
  const router = useRouter();
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    annee: '',
    numero_inscription: '',
    nom: '',
    prenom: '',
    fonction: '',
    sexe: '',
    section: '',
    religion: ''
  });
  const [animateurs, setAnimateurs] = useState<Animateur[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAnimateur, setNewAnimateur] = useState({
    annee: new Date().getFullYear(),
    numero_inscription: '',
    nom: '',
    prenom: '',
    fonction: '',
    naissance: '',
    sexe: '',
    section: '',
    religion: ''
  });
  const [error, setError] = useState<string | null>(null);

  // Fetch animateurs
  useEffect(() => {
    const fetchAnimateurs = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/vacance-animateurs`, { timeout: 15000 });
        if (response.data.success) {
          setAnimateurs(response.data.animateurs);
        }
      } catch (error) {
        console.error('Erreur:', error);
        setError('Impossible de charger les animateurs');
      } finally {
        setLoading(false);
      }
    };
    fetchAnimateurs();
  }, []);

  // Prévisualise le prochain numéro d'inscription (auto, par année) tant qu'on est en mode ajout
  useEffect(() => {
    if (!showAddModal) return;
    const anneeNum = Number(newAnimateur.annee);
    if (!Number.isFinite(anneeNum) || anneeNum <= 0) return;

    axios.get<{ success: boolean; next: number }>(`${API_URL}/api/vacance-animateurs/next-numero?annee=${anneeNum}`)
      .then(response => {
        if (response.data.success) {
          setNewAnimateur(prev => ({ ...prev, numero_inscription: String(response.data.next) }));
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAddModal, newAnimateur.annee]);

  // Filter animateurs
  const filteredAnimateurs = animateurs.filter((animateur) => {
    return (
      (filters.annee === '' || String(animateur.annee) === filters.annee) &&
      (filters.numero_inscription === '' || animateur.numero_inscription?.toLowerCase().includes(filters.numero_inscription.toLowerCase())) &&
      (filters.nom === '' || animateur.nom.toLowerCase().includes(filters.nom.toLowerCase())) &&
      (filters.prenom === '' || animateur.prenom.toLowerCase().includes(filters.prenom.toLowerCase())) &&
      (filters.fonction === '' || animateur.fonction.toLowerCase().includes(filters.fonction.toLowerCase())) &&
      (filters.sexe === '' || animateur.sexe === filters.sexe) &&
      (filters.section === '' || animateur.section === filters.section) &&
      (filters.religion === '' || animateur.religion?.toLowerCase().includes(filters.religion.toLowerCase()))
    );
  });

  // Export Excel
  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredAnimateurs.map(({ id, ...rest }) => rest));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'AnimateursVacances');
    XLSX.writeFile(wb, 'vacance_animateurs.xlsx');
  };

  // Add Animateur
  const handleAddAnimateur = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/vacance-animateurs`, newAnimateur);
      if (response.data.success) {
        setAnimateurs([...animateurs, response.data.animateur]);
        setShowAddModal(false);
        setNewAnimateur({
          annee: new Date().getFullYear(),
          numero_inscription: '',
          nom: '',
          prenom: '',
          fonction: '',
          naissance: '',
          sexe: '',
          section: '',
          religion: ''
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'ajout de l\'animateur');
    }
  };

  // Delete Animateur
  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet animateur ? Cette action est irréversible.')) {
      try {
        const response = await axios.delete(`${API_URL}/api/vacance-animateurs/${id}`);
        if (response.data.success) {
          setAnimateurs(animateurs.filter(a => a.id !== id));
          alert('Animateur supprimé avec succès');
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression de l\'animateur');
      }
    }
  };

  // Edit Animateur
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAnimateur, setEditingAnimateur] = useState<Animateur | null>(null);

  const handleEdit = (animateur: Animateur) => {
    setEditingAnimateur(animateur);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnimateur) return;

    try {
      const { id: _id, ...rest } = editingAnimateur;
      const response = await axios.put(`${API_URL}/api/vacance-animateurs/${editingAnimateur.id}`, rest);
      if (response.data.success) {
        setAnimateurs(animateurs.map(a =>
          a.id === editingAnimateur.id ? editingAnimateur : a
        ));
        setShowEditModal(false);
        setEditingAnimateur(null);
        alert('Animateur modifié avec succès');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la modification de l\'animateur');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-100">
      <div className="p-4 sm:p-6 lg:p-8" style={{ background: '#fff' }}>
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => router.push('/Accueil')}
            className="bg-gray-500 text-white hover:bg-gray-600 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Retour à l&apos;accueil
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent mb-2">
            Tableau de Bord - Animateurs
          </h1>
          <p className="text-xl text-sky-600 font-semibold">Animateurs vacances</p>
          <div className="w-24 h-1 bg-gradient-to-r from-sky-400 to-blue-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-between items-stretch sm:items-center gap-3 sm:gap-4 mb-8">
          <button
            onClick={() => setFilterVisible(!filterVisible)}
            className="bg-sky-500 text-white hover:bg-sky-600 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 font-medium"
          >
            {filterVisible ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Masquer les filtres
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Afficher les filtres
              </>
            )}
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-sky-500 text-white hover:bg-sky-600 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium"
          >
            Ajouter un animateur
          </button>
        </div>

        {/* Filter Section */}
        {filterVisible && (
          <div className="mb-8 p-4 sm:p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-sky-100">
            <h3 className="text-xl font-bold text-sky-700 mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
              </svg>
              Filtrer les animateurs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-semibold text-sky-700 mb-2">Année</label>
                <input
                  type="number"
                  value={filters.annee}
                  onChange={(e) => setFilters({ ...filters, annee: e.target.value })}
                  className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                  placeholder="Filtrer par année"
                  min="2000"
                  max="3000"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-sky-700 mb-2">N° d&apos;inscription</label>
                <input
                  type="text"
                  value={filters.numero_inscription}
                  onChange={(e) => setFilters({ ...filters, numero_inscription: e.target.value })}
                  className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                  placeholder="Filtrer par N° d'inscription"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-sky-700 mb-2">Nom</label>
                <input
                  type="text"
                  value={filters.nom}
                  onChange={(e) => setFilters({ ...filters, nom: e.target.value })}
                  className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                  placeholder="Filtrer par nom"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-sky-700 mb-2">Prénom</label>
                <input
                  type="text"
                  value={filters.prenom}
                  onChange={(e) => setFilters({ ...filters, prenom: e.target.value })}
                  className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                  placeholder="Filtrer par prénom"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-sky-700 mb-2">Fonction</label>
                <input
                  type="text"
                  value={filters.fonction}
                  onChange={(e) => setFilters({ ...filters, fonction: e.target.value })}
                  className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                  placeholder="Filtrer par fonction"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-sky-700 mb-2">Sexe</label>
                <select
                  value={filters.sexe}
                  onChange={(e) => setFilters({ ...filters, sexe: e.target.value })}
                  className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                >
                  <option value="">Tous</option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-sky-700 mb-2">Section</label>
                <select
                  value={filters.section}
                  onChange={(e) => setFilters({ ...filters, section: e.target.value })}
                  className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                >
                  <option value="">Toutes les sections</option>
                  <option value="Ste Antoinette néo">Ste Antoinette néo (05-08 ans) </option>
                  <option value="Ste Maria Goretti">Ste Maria Goretti (09-12 ans)</option>
                  <option value="Ste Thérèse">Ste Thérèse (13-15 ans)</option>
                  <option value="Ste Bernadette">Ste Bernadette (16 ans +)</option>
                  <option value="St Ange">St Ange (05-08 ans)</option>
                  <option value="St Kizito">St Tharçis(09-14 ans)</option>
                  <option value="St Tharcis">St Kizito (15-16 ans)</option>
                  <option value="St Joseph">St Dominique (17-18 ans)</option>
                  <option value="St Joseph">St Vincent (18-20 ans)</option>
                  <option value="St Vincent">St Joseph (20 ans +)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-sky-700 mb-2">Religion</label>
                <select
                  value={filters.religion}
                  onChange={(e) => setFilters({ ...filters, religion: e.target.value })}
                  className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                >
                  <option value="">Toutes</option>
                  <option value="Chrétien catholique">Chrétien catholique</option>
                  <option value="Musulman">Musulman</option>
                  <option value="Protestant">Protestant</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="p-4 bg-gradient-to-r from-sky-100 to-blue-100 rounded-lg flex-1">
                <div className="text-sky-700 font-bold text-lg flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                  </svg>
                  {filteredAnimateurs.length} {filteredAnimateurs.length > 1 ? 'animateurs trouvés' : 'animateur trouvé'}
                  {filteredAnimateurs.length !== animateurs.length && ` sur ${animateurs.length} au total`}
                </div>
              </div>
              <button
                onClick={() => setFilters({ annee: '', numero_inscription: '', nom: '', prenom: '', fonction: '', sexe: '', section: '', religion: '' })}
                className="bg-gray-300 text-gray-700 hover:bg-gray-400 px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        )}

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-sky-500 to-blue-600 p-4 sm:p-6 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Ajouter un animateur
                  </h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-white hover:bg-white/20 rounded-lg p-2 transition-all duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleAddAnimateur} className="p-4 sm:p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-sky-700 mb-2">N° d&apos;inscription</label>
                    <input
                      type="text"
                      readOnly
                      value={newAnimateur.numero_inscription}
                      className="w-full rounded-lg border-2 border-sky-100 bg-sky-50 text-sky-600 shadow-sm px-4 py-3 cursor-not-allowed"
                    />
                    <p className="text-xs text-sky-500 mt-1">
                      Attribué automatiquement selon l&apos;année (pas de doublon possible).
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sky-700 mb-2">Année</label>
                    <input
                      type="number"
                      required
                      className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                      value={newAnimateur.annee}
                      onChange={(e) => setNewAnimateur({ ...newAnimateur, annee: Number(e.target.value) })}
                      min="2000"
                      max="3000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sky-700 mb-2">Nom</label>
                    <input
                      type="text"
                      required
                      className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                      value={newAnimateur.nom}
                      onChange={(e) => setNewAnimateur({ ...newAnimateur, nom: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sky-700 mb-2">Prénom</label>
                    <input
                      type="text"
                      required
                      className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                      value={newAnimateur.prenom}
                      onChange={(e) => setNewAnimateur({ ...newAnimateur, prenom: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sky-700 mb-2">Fonction</label>
                    <input
                      type="text"
                      required
                      className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                      value={newAnimateur.fonction}
                      onChange={(e) => setNewAnimateur({ ...newAnimateur, fonction: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sky-700 mb-2">Date de naissance</label>
                    <input
                      type="date"
                      required
                      className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                      value={newAnimateur.naissance}
                      onChange={(e) => setNewAnimateur({ ...newAnimateur, naissance: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sky-700 mb-2">Sexe</label>
                    <select
                      required
                      className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                      value={newAnimateur.sexe}
                      onChange={(e) => setNewAnimateur({ ...newAnimateur, sexe: e.target.value })}
                    >
                      <option value="">Sélectionner</option>
                      <option value="M">Masculin</option>
                      <option value="F">Féminin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sky-700 mb-2">Section</label>
                    <select
                      required
                      className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                      value={newAnimateur.section}
                      onChange={(e) => setNewAnimateur({ ...newAnimateur, section: e.target.value })}
                    >
                      <option value="">Sélectionner</option>
                      <option value="Ste Antoinette néo">Ste Antoinette néo (05-08 ans) </option>
                      <option value="Ste Maria Goretti">Ste Maria Goretti (09-12 ans)</option>
                      <option value="Ste Thérèse">Ste Thérèse (13-15 ans)</option>
                      <option value="Ste Bernadette">Ste Bernadette (16 ans +)</option>
                      <option value="St Ange">St Ange (05-08 ans)</option>
                      <option value="St Kizito">St Tharçis(09-14 ans)</option>
                      <option value="St Tharcis">St Kizito (15-16 ans)</option>
                      <option value="St Joseph">St Dominique (17-18 ans)</option>
                      <option value="St Joseph">St Vincent (18-20 ans)</option>
                      <option value="St Vincent">St Joseph (20 ans +)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sky-700 mb-2">Religion</label>
                    <select
                      required
                      className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                      value={newAnimateur.religion}
                      onChange={(e) => setNewAnimateur({ ...newAnimateur, religion: e.target.value })}
                    >
                      <option value="">Sélectionner</option>
                      <option value="Chrétien catholique">Chrétien catholique</option>
                      <option value="Musulman">Musulman</option>
                      <option value="Protestant">Protestant</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-4 pt-6 border-t border-sky-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="bg-gray-300 text-gray-700 hover:bg-gray-400 px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="bg-sky-500 text-white hover:bg-sky-600 px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingAnimateur && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-sky-500 to-blue-600 p-4 sm:p-6 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Modifier l&apos;animateur
                  </h2>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingAnimateur(null);
                    }}
                    className="text-white hover:bg-white/20 rounded-lg p-2 transition-all duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleEditSubmit} className="p-4 sm:p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-sky-700 mb-2">N° d&apos;inscription</label>
                    <input
                      type="text"
                      readOnly
                      value={editingAnimateur.numero_inscription}
                      className="w-full rounded-lg border-2 border-sky-100 bg-sky-50 text-sky-600 shadow-sm px-4 py-3 cursor-not-allowed"
                    />
                    <p className="text-xs text-sky-500 mt-1">
                      Numéro attribué à la création, non modifiable.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sky-700 mb-2">Année</label>
                    <input
                      type="number"
                      required
                      className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                      value={editingAnimateur.annee}
                      onChange={(e) => setEditingAnimateur({ ...editingAnimateur, annee: Number(e.target.value) })}
                      min="2000"
                      max="3000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sky-700 mb-2">Nom</label>
                    <input
                      type="text"
                      required
                      className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                      value={editingAnimateur.nom}
                      onChange={(e) => setEditingAnimateur({ ...editingAnimateur, nom: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sky-700 mb-2">Prénom</label>
                    <input
                      type="text"
                      required
                      className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                      value={editingAnimateur.prenom}
                      onChange={(e) => setEditingAnimateur({ ...editingAnimateur, prenom: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sky-700 mb-2">Fonction</label>
                    <input
                      type="text"
                      required
                      className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                      value={editingAnimateur.fonction}
                      onChange={(e) => setEditingAnimateur({ ...editingAnimateur, fonction: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sky-700 mb-2">Date de naissance</label>
                    <input
                      type="date"
                      required
                      className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                      value={editingAnimateur.naissance}
                      onChange={(e) => setEditingAnimateur({ ...editingAnimateur, naissance: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sky-700 mb-2">Sexe</label>
                    <select
                      required
                      className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                      value={editingAnimateur.sexe}
                      onChange={(e) => setEditingAnimateur({ ...editingAnimateur, sexe: e.target.value })}
                    >
                      <option value="">Sélectionner</option>
                      <option value="M">Masculin</option>
                      <option value="F">Féminin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sky-700 mb-2">Section</label>
                    <select
                      required
                      className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                      value={editingAnimateur.section}
                      onChange={(e) => setEditingAnimateur({ ...editingAnimateur, section: e.target.value })}
                    >
                      <option value="">Sélectionner</option>
                      <option value="Ste Antoinette néo">Ste Antoinette néo (05-08 ans) </option>
                      <option value="Ste Maria Goretti">Ste Maria Goretti (09-12 ans)</option>
                      <option value="Ste Thérèse">Ste Thérèse (13-15 ans)</option>
                      <option value="Ste Bernadette">Ste Bernadette (16 ans +)</option>
                      <option value="St Ange">St Ange (05-08 ans)</option>
                      <option value="St Kizito">St Tharçis(09-14 ans)</option>
                      <option value="St Tharcis">St Kizito (15-16 ans)</option>
                      <option value="St Joseph">St Dominique (17-18 ans)</option>
                      <option value="St Joseph">St Vincent (18-20 ans)</option>
                      <option value="St Vincent">St Joseph (20 ans +)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sky-700 mb-2">Religion</label>
                    <select
                      required
                      className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                      value={editingAnimateur.religion}
                      onChange={(e) => setEditingAnimateur({ ...editingAnimateur, religion: e.target.value })}
                    >
                      <option value="">Sélectionner</option>
                      <option value="Chrétien catholique">Chrétien catholique</option>
                      <option value="Musulman">Musulman</option>
                      <option value="Protestant">Protestant</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-4 pt-6 border-t border-sky-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingAnimateur(null);
                    }}
                    className="bg-gray-300 text-gray-700 hover:bg-gray-400 px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="bg-sky-500 text-white hover:bg-sky-600 px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md"
                  >
                    Modifier
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {error && (
          <div className="text-red-500 mb-4">{error}</div>
        )}

        {/* Export Excel Button */}
        <div className="flex flex-col sm:flex-row sm:justify-end mb-4">
          <button
            onClick={handleExportExcel}
            className="bg-green-600 text-white hover:bg-green-700 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Exporter en Excel
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-sky-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-sky-400 to-blue-400 text-white">
                    <th className="whitespace-nowrap px-6 py-4 text-left font-bold">Année</th>
                    <th className="whitespace-nowrap px-6 py-4 text-left font-bold">N° d&apos;inscription</th>
                    <th className="whitespace-nowrap px-6 py-4 text-left font-bold">Nom</th>
                    <th className="whitespace-nowrap px-6 py-4 text-left font-bold">Prénom</th>
                    <th className="whitespace-nowrap px-6 py-4 text-left font-bold">Fonction</th>
                    <th className="whitespace-nowrap px-6 py-4 text-left font-bold">Date de Naissance</th>
                    <th className="whitespace-nowrap px-6 py-4 text-left font-bold">Sexe</th>
                    <th className="whitespace-nowrap px-6 py-4 text-left font-bold">Section</th>
                    <th className="whitespace-nowrap px-6 py-4 text-left font-bold">Religion</th>
                    <th className="whitespace-nowrap px-6 py-4 text-left font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAnimateurs.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-6 py-12 text-center text-gray-500 bg-sky-50/50">
                        <div className="flex flex-col items-center gap-4 sticky left-6 max-w-[calc(100vw-6rem)] sm:static sm:max-w-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-sky-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          <div>
                            <p className="text-lg font-medium text-sky-600">Aucun animateur trouvé</p>
                            <p className="text-sm text-gray-400">Ajoutez votre premier animateur en cliquant sur le bouton "Ajouter un animateur"</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredAnimateurs.map((animateur) => (
                      <tr key={animateur.id} className="hover:bg-sky-50/50 transition-colors duration-200 border-b border-sky-100">
                        <td className="whitespace-nowrap px-6 py-4 text-sky-700 font-medium">{animateur.annee}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sky-700 font-medium">{animateur.numero_inscription}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-gray-800 font-semibold">{animateur.nom}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-gray-800">{animateur.prenom}</td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                            {animateur.fonction}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-gray-600">{animateur.naissance}</td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            animateur.sexe === 'M'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-pink-100 text-pink-700'
                          }`}>
                            {animateur.sexe === 'M' ? 'Masculin' : 'Féminin'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-medium">
                            {animateur.section}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium">
                            {animateur.religion}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(animateur)}
                              className="p-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                              title="Modifier"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(animateur.id)}
                              className="p-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                              title="Supprimer"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                            <button
                              onClick={() => router.push(`/Vacance_animateur/${animateur.id}`)}
                              className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                              title="Voir détails"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VacanceAnimateurPage;
