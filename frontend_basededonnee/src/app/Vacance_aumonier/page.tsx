'use client';
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Aumonier {
  id: number;
  annee: number;
  nom: string;
  prenom: string;
  fonction: string;
  naissance: string;
}

const VacanceAumonierPage = () => {
  // Fonction d'export Excel (doit être dans le composant pour accéder aux hooks)
  const handleExportExcel = () => {
    if (!filteredAumoniers.length) {
      alert('Aucune donnée à exporter.');
      return;
    }
    const data = filteredAumoniers.map((a) => ({
      'Année': a.annee,
      'Nom': a.nom,
      'Prénom': a.prenom,
      'Fonction': a.fonction,
      'Date de Naissance': a.naissance
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Aumoniers Vacances');
    XLSX.writeFile(wb, 'aumoniers_vacances.xlsx');
  };
  const router = useRouter();
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    annee: '',
    nom: '',
    prenom: '',
    fonction: ''
  });
  const [aumoniers, setAumoniers] = useState<Aumonier[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newAumonier, setNewAumonier] = useState({
    annee: new Date().getFullYear(),
    nom: '',
    prenom: '',
    fonction: '',
    naissance: ''
  });

  const [error, setError] = useState<string | null>(null);

  // Fetch aumoniers
  useEffect(() => {
    const fetchAumoniers = async () => {
      try {
        const response = await axios.get('http://localhost:4400/api/vacance-aumoniers');
        if (response.data.success) {
          setAumoniers(response.data.aumoniers);
        }
      } catch (error) {
        console.error('Erreur:', error);
        setError('Impossible de charger les aumôniers');
      } finally {
        setLoading(false);
      }
    };
    fetchAumoniers();
  }, []);

  // Filter aumoniers
  const filteredAumoniers = aumoniers.filter((aumonier) => {
    return (
      (filters.annee === '' || String(aumonier.annee) === filters.annee) &&
      (filters.nom === '' || aumonier.nom.toLowerCase().includes(filters.nom.toLowerCase())) &&
      (filters.prenom === '' || aumonier.prenom.toLowerCase().includes(filters.prenom.toLowerCase())) &&
      (filters.fonction === '' || aumonier.fonction.toLowerCase().includes(filters.fonction.toLowerCase()))
    );
  });

  // Add Aumonier
  const handleAddAumonier = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4400/api/vacance-aumoniers', newAumonier);
      if (response.data.success) {
        setAumoniers([...aumoniers, { ...newAumonier, id: response.data.aumonierId }]);
        setShowAddModal(false);
        setNewAumonier({ annee: new Date().getFullYear(), nom: '', prenom: '', fonction: '', naissance: '' });
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'ajout de l\'aumônier');
    }
  };

  // Delete Aumonier
  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet aumônier ? Cette action est irréversible.')) {
      try {
        const response = await axios.delete(`http://localhost:4400/api/vacance-aumoniers/${id}`);
        if (response.data.success) {
          setAumoniers(aumoniers.filter(a => a.id !== id));
          alert('Aumônier supprimé avec succès');
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression de l\'aumônier');
      }
    }
  };

  // Edit Aumonier
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAumonier, setEditingAumonier] = useState<Aumonier | null>(null);

  const handleEdit = (aumonier: Aumonier) => {
    setEditingAumonier(aumonier);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAumonier) return;

    try {
      const response = await axios.put(`http://localhost:4400/api/vacance-aumoniers/${editingAumonier.id}`, editingAumonier);
      if (response.data.success) {
        setAumoniers(aumoniers.map(a =>
          a.id === editingAumonier.id ? editingAumonier : a
        ));
        setShowEditModal(false);
        setEditingAumonier(null);
        alert('Aumônier modifié avec succès');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la modification de l\'aumônier');
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
              Tableau de Bord - Aumôniers
            </h1>
            <p className="text-xl text-sky-600 font-semibold">Aumôniers - Vacances</p>
            <div className="w-24 h-1 bg-gradient-to-r from-sky-400 to-blue-500 mx-auto mt-4 rounded-full"></div>
          </div>
      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-sky-700 mb-6">Ajouter un Aumônier</h2>
            <form onSubmit={handleAddAumonier} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Année</label>
                  <input
                    type="number"
                    required
                    className="input input-bordered w-full"
                    value={newAumonier.annee}
                    onChange={(e) => setNewAumonier({ ...newAumonier, annee: Number(e.target.value) })}
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
                    value={newAumonier.nom}
                    onChange={(e) => setNewAumonier({ ...newAumonier, nom: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                  <input
                    type="text"
                    required
                    className="input input-bordered w-full"
                    value={newAumonier.prenom}
                    onChange={(e) => setNewAumonier({ ...newAumonier, prenom: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fonction</label>
                  <input
                    type="text"
                    required
                    className="input input-bordered w-full"
                    value={newAumonier.fonction}
                    onChange={(e) => setNewAumonier({ ...newAumonier, fonction: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance</label>
                  <input
                    type="date"
                    required
                    className="input input-bordered w-full"
                    value={newAumonier.naissance}
                    onChange={(e) => setNewAumonier({ ...newAumonier, naissance: e.target.value })}
                  />
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
              className="bg-sky-500 text-white hover:bg-sky-600 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 font-medium"
          >
            Ajouter un aumônier
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
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ annee: '', nom: '', prenom: '', fonction: '' })}
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
          {filteredAumoniers.length} {filteredAumoniers.length > 1 ? 'aumôniers trouvés' : 'aumônier trouvé'}
          {filteredAumoniers.length !== aumoniers.length && ` sur ${aumoniers.length} au total`}
        </p>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingAumonier && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-sky-700 mb-6">Modifier l&apos;Aumônier</h2>
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Année</label>
                  <input
                    type="number"
                    required
                    className="input input-bordered w-full"
                    value={editingAumonier.annee}
                    onChange={(e) => setEditingAumonier({ ...editingAumonier, annee: Number(e.target.value) })}
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
                    value={editingAumonier.nom}
                    onChange={(e) => setEditingAumonier({ ...editingAumonier, nom: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                  <input
                    type="text"
                    required
                    className="input input-bordered w-full"
                    value={editingAumonier.prenom}
                    onChange={(e) => setEditingAumonier({ ...editingAumonier, prenom: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fonction</label>
                  <input
                    type="text"
                    required
                    className="input input-bordered w-full"
                    value={editingAumonier.fonction}
                    onChange={(e) => setEditingAumonier({ ...editingAumonier, fonction: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance</label>
                  <input
                    type="date"
                    required
                    className="input input-bordered w-full"
                    value={editingAumonier.naissance}
                    onChange={(e) => setEditingAumonier({ ...editingAumonier, naissance: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingAumonier(null);
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

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
        </div>
      ) : (
        <>
          {/* Export Excel Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={handleExportExcel}
              className="bg-green-600 text-white hover:bg-green-700 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Exporter le tableau en Excel
            </button>
          </div>
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
                    <th className="px-6 py-4 text-left font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAumoniers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500 bg-sky-50/50">
                        <div className="flex flex-col items-center gap-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-sky-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          <div>
                            <p className="text-lg font-medium text-sky-600">Aucun aumonier trouvé</p>
                            <p className="text-sm text-gray-400">Ajoutez votre premier aumonier en cliquant sur le bouton &quot;Ajouter un aumonier&quot;</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredAumoniers.map((aumonier) => (
                      <tr key={aumonier.id} className="hover:bg-sky-50/50 transition-colors duration-200 border-b border-sky-100">
                        <td className="px-6 py-4 text-sky-700 font-medium">{aumonier.annee}</td>
                        <td className="px-6 py-4 text-gray-800 font-semibold">{aumonier.nom}</td>
                        <td className="px-6 py-4 text-gray-800">{aumonier.prenom}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                            {aumonier.fonction}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{aumonier.naissance}</td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(aumonier)}
                              className="p-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                              title="Modifier"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(aumonier.id)}
                              className="p-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                              title="Supprimer"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                            <button
                              onClick={() => router.push(`/Vacance_aumonier/${aumonier.id}`)}
                              className="p-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                              title="Voir les détails"
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
        </>
      )}
    </div>
  );
};

export default VacanceAumonierPage;