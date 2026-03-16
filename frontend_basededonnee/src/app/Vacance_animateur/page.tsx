
'use client';
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { useRouter } from 'next/navigation';

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
        const response = await axios.get('http://localhost:4400/api/vacance-animateurs', { timeout: 15000 });
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

  // Filter animateurs
  const filteredAnimateurs = animateurs.filter((animateur) => {
    return (
      (filters.annee === '' || String(animateur.annee) === filters.annee) &&
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
      const response = await axios.post('http://localhost:4400/api/vacance-animateurs', newAnimateur);
      if (response.data.success) {
        setAnimateurs([...animateurs, response.data.animateur]);
        setShowAddModal(false);
        setNewAnimateur({
          annee: new Date().getFullYear(),
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
        const response = await axios.delete(`http://localhost:4400/api/vacance-animateurs/${id}`);
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
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAnimateur, setSelectedAnimateur] = useState<Animateur | null>(null);

  const handleEdit = (animateur: Animateur) => {
    setEditingAnimateur(animateur);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnimateur) return;

    try {
      const response = await axios.put(`http://localhost:4400/api/vacance-animateurs/${editingAnimateur.id}`, editingAnimateur);
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
    <div className="p-8">
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
      <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent mb-2">
              Tableau de Bord - Animateurs
            </h1>
            <p className="text-xl text-sky-600 font-semibold">Animateurs vacances</p>
            <div className="w-24 h-1 bg-gradient-to-r from-sky-400 to-blue-500 mx-auto mt-4 rounded-full"></div>
          </div>
      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-sky-700 mb-6">Ajouter un Animateur</h2>
            <form onSubmit={handleAddAnimateur} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Année</label>
                  <input
                    type="number"
                    required
                    className="input input-bordered w-full"
                    value={newAnimateur.annee}
                    onChange={(e) => setNewAnimateur({ ...newAnimateur, annee: Number(e.target.value) })}
                    min="2000"
                    max="3000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                  <input
                    type="text"
                    required
                    className="input input-bordered w-full"
                    value={newAnimateur.nom}
                    onChange={(e) => setNewAnimateur({ ...newAnimateur, nom: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                  <input
                    type="text"
                    required
                    className="input input-bordered w-full"
                    value={newAnimateur.prenom}
                    onChange={(e) => setNewAnimateur({ ...newAnimateur, prenom: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fonction</label>
                  <input
                    type="text"
                    required
                    className="input input-bordered w-full"
                    value={newAnimateur.fonction}
                    onChange={(e) => setNewAnimateur({ ...newAnimateur, fonction: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance</label>
                  <input
                    type="date"
                    required
                    className="input input-bordered w-full"
                    value={newAnimateur.naissance}
                    onChange={(e) => setNewAnimateur({ ...newAnimateur, naissance: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sexe</label>
                  <select
                    required
                    className="select select-bordered w-full"
                    value={newAnimateur.sexe}
                    onChange={(e) => setNewAnimateur({ ...newAnimateur, sexe: e.target.value })}
                  >
                    <option value="">Sélectionner</option>
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
                  <select
                    required
                    className="select select-bordered w-full"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
                  <select
                    required
                    className="select select-bordered w-full"
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
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn bg-gray-500 text-white hover:bg-gray-600"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn bg-sky-500 text-white hover:bg-sky-600"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setFilterVisible(!filterVisible)}
              className="bg-sky-500 text-white hover:bg-sky-600 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 font-medium"
          >
            {filterVisible ? 'Masquer les filtres' : 'Afficher les filtres'}
          </button>
          <button
            onClick={() => setShowAddModal(true)}
              className="bg-sky-500 text-white hover:bg-sky-600 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium"
          >
            Ajouter un animateur
          </button>
        </div>
        {filterVisible && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-lg shadow">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Année</label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={filters.annee}
                onChange={(e) => setFilters({ ...filters, annee: e.target.value })}
                placeholder="Filtrer par année"
                min="2000"
                max="3000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={filters.nom}
                onChange={(e) => setFilters({ ...filters, nom: e.target.value })}
                placeholder="Filtrer par nom"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={filters.prenom}
                onChange={(e) => setFilters({ ...filters, prenom: e.target.value })}
                placeholder="Filtrer par prénom"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fonction</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={filters.fonction}
                onChange={(e) => setFilters({ ...filters, fonction: e.target.value })}
                placeholder="Filtrer par fonction"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sexe</label>
              <select
                className="select select-bordered w-full"
                value={filters.sexe}
                onChange={(e) => setFilters({ ...filters, sexe: e.target.value })}
              >
                <option value="">Tous</option>
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
              <select
                className="select select-bordered w-full"
                value={filters.section}
                onChange={(e) => setFilters({ ...filters, section: e.target.value })}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
              <select
                className="select select-bordered w-full"
                value={filters.religion}
                onChange={(e) => setFilters({ ...filters, religion: e.target.value })}
              >
                <option value="">Toutes</option>
                <option value="Chrétien catholique">Chrétien catholique</option>
                <option value="Musulman">Musulman</option>
                <option value="Protestant">Protestant</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ annee: '', nom: '', prenom: '', fonction: '', sexe: '', section: '', religion: '' })}
                className="btn bg-gray-500 text-white hover:bg-gray-600"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-600">
          {filteredAnimateurs.length} {filteredAnimateurs.length > 1 ? 'animateurs trouvés' : 'animateur trouvé'}
          {filteredAnimateurs.length !== animateurs.length && ` sur ${animateurs.length} au total`}
        </p>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedAnimateur && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-sky-700 mb-6">Détails de {selectedAnimateur.prenom} {selectedAnimateur.nom}</h2>
            
            {selectedAnimateur.details ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Informations de contact</h3>
                  <p><span className="font-medium">Email:</span> {selectedAnimateur.details.email || '-'}</p>
                  <p><span className="font-medium">WhatsApp:</span> {selectedAnimateur.details.contact_whatsapp || '-'}</p>
                  <p><span className="font-medium">Autre contact:</span> {selectedAnimateur.details.autre_contact || '-'}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Informations religieuses</h3>
                  <p><span className="font-medium">Religion:</span> {selectedAnimateur.details.religion || '-'}</p>
                  <p><span className="font-medium">Communauté:</span> {selectedAnimateur.details.communaute || '-'}</p>
                  <p><span className="font-medium">Réalisation:</span> {selectedAnimateur.details.realisation || '-'}</p>
                </div>
                <div className="col-span-2">
                  <h3 className="font-semibold mb-2">Sacrements</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className={`p-2 rounded ${selectedAnimateur.details.est_catechumene ? 'bg-green-100' : 'bg-red-100'}`}>
                      <p className="font-medium">Catéchumène</p>
                      <p>{selectedAnimateur.details.est_catechumene ? 'Oui' : 'Non'}</p>
                    </div>
                    <div className={`p-2 rounded ${selectedAnimateur.details.est_bapteme ? 'bg-green-100' : 'bg-red-100'}`}>
                      <p className="font-medium">Baptême</p>
                      <p>{selectedAnimateur.details.est_bapteme ? 'Oui' : 'Non'}</p>
                    </div>
                    <div className={`p-2 rounded ${selectedAnimateur.details.est_premiere_communion ? 'bg-green-100' : 'bg-red-100'}`}>
                      <p className="font-medium">1ère Communion</p>
                      <p>{selectedAnimateur.details.est_premiere_communion ? 'Oui' : 'Non'}</p>
                    </div>
                    <div className={`p-2 rounded ${selectedAnimateur.details.est_confirmation ? 'bg-green-100' : 'bg-red-100'}`}>
                      <p className="font-medium">Confirmation</p>
                      <p>{selectedAnimateur.details.est_confirmation ? 'Oui' : 'Non'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Aucun détail n'a été ajouté pour cet animateur.</p>
            )}
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="btn bg-gray-500 text-white hover:bg-gray-600"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingAnimateur && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-sky-700 mb-6">Modifier l&apos;Animateur</h2>
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Année</label>
                  <input
                    type="number"
                    required
                    className="input input-bordered w-full"
                    value={editingAnimateur.annee}
                    onChange={(e) => setEditingAnimateur({ ...editingAnimateur, annee: Number(e.target.value) })}
                    min="2000"
                    max="3000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                  <input
                    type="text"
                    required
                    className="input input-bordered w-full"
                    value={editingAnimateur.nom}
                    onChange={(e) => setEditingAnimateur({ ...editingAnimateur, nom: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                  <input
                    type="text"
                    required
                    className="input input-bordered w-full"
                    value={editingAnimateur.prenom}
                    onChange={(e) => setEditingAnimateur({ ...editingAnimateur, prenom: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fonction</label>
                  <input
                    type="text"
                    required
                    className="input input-bordered w-full"
                    value={editingAnimateur.fonction}
                    onChange={(e) => setEditingAnimateur({ ...editingAnimateur, fonction: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance</label>
                  <input
                    type="date"
                    required
                    className="input input-bordered w-full"
                    value={editingAnimateur.naissance}
                    onChange={(e) => setEditingAnimateur({ ...editingAnimateur, naissance: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sexe</label>
                  <select
                    required
                    className="select select-bordered w-full"
                    value={editingAnimateur.sexe}
                    onChange={(e) => setEditingAnimateur({ ...editingAnimateur, sexe: e.target.value })}
                  >
                    <option value="">Sélectionner</option>
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
                  <select
                    required
                    className="select select-bordered w-full"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
                  <select
                    required
                    className="select select-bordered w-full"
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
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingAnimateur(null);
                  }}
                  className="btn bg-gray-500 text-white hover:bg-gray-600"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn bg-sky-500 text-white hover:bg-sky-600"
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

      <div className="mb-4">
        <button
          onClick={handleExportExcel}
          className="mb-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
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
            <th className="px-6 py-4 text-left font-bold">Année</th>
            <th className="px-6 py-4 text-left font-bold">Nom</th>
            <th className="px-6 py-4 text-left font-bold">Prénom</th>
            <th className="px-6 py-4 text-left font-bold">Fonction</th>
            <th className="px-6 py-4 text-left font-bold">Date de Naissance</th>
            <th className="px-6 py-4 text-left font-bold">Sexe</th>
            <th className="px-6 py-4 text-left font-bold">Section</th>
            <th className="px-6 py-4 text-left font-bold">Religion</th>
            <th className="px-6 py-4 text-left font-bold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAnimateurs.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-6 py-12 text-center text-gray-500 bg-sky-50/50">
                <div className="flex flex-col items-center gap-4">
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
                <td className="px-6 py-4 text-sky-700 font-medium">{animateur.annee}</td>
                <td className="px-6 py-4 text-gray-800 font-semibold">{animateur.nom}</td>
                <td className="px-6 py-4 text-gray-800">{animateur.prenom}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                    {animateur.fonction}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{animateur.naissance}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    animateur.sexe === 'M' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-pink-100 text-pink-700'
                  }`}>
                    {animateur.sexe === 'M' ? 'Masculin' : 'Féminin'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-medium">
                    {animateur.section}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium">
                    {animateur.religion}
                  </span>
                </td>
                <td className="px-6 py-4">
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
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" />
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
  );
};

export default VacanceAnimateurPage;