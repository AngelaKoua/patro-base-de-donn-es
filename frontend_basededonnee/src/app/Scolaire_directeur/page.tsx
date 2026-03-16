'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';

interface Directeur {
  id: number;
  annee: number;
  nom: string;
  prenom: string;
  fonction: string;
  naissance: string;
}

const ScolaireDirecteur = () => {
  const router = useRouter();
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    annee: '',
    nom: '',
    prenom: '',
    fonction: ''
  });
  const [directeurs, setDirecteurs] = useState<Directeur[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newDirecteur, setNewDirecteur] = useState({
    annee: new Date().getFullYear(),
    nom: '',
    prenom: '',
    fonction: '',
    naissance: ''
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDirecteurs = async () => {
      try {
        const response = await axios.get('http://localhost:4400/api/directeurs');
        if (response.data.success) {
          setDirecteurs(response.data.directeurs);
        }
      } catch (error) {
        console.error('Erreur:', error);
        setError('Impossible de charger les directeurs');
      } finally {
        setLoading(false);
      }
    };
    fetchDirecteurs();
  }, []);

  const handleAddDirecteur = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4400/api/directeurs', newDirecteur);
      if (response.data.success) {
        setDirecteurs([...directeurs, { ...newDirecteur, id: response.data.directeurId }]);
        setShowAddModal(false);
        setNewDirecteur({ annee: new Date().getFullYear(), nom: '', prenom: '', fonction: '', naissance: '' });
      }
    } catch (error) {
      setError('Erreur lors de l\'ajout du directeur');
    }
  };

  const filteredDirecteurs = directeurs.filter((directeur) => {
    return (
      (filters.annee === '' || String(directeur.annee) === filters.annee) &&
      (filters.nom === '' || directeur.nom.toLowerCase().includes(filters.nom.toLowerCase())) &&
      (filters.prenom === '' || directeur.prenom.toLowerCase().includes(filters.prenom.toLowerCase())) &&
      (filters.fonction === '' || directeur.fonction.toLowerCase().includes(filters.fonction.toLowerCase()))
    );
  });

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce directeur ? Cette action est irréversible.')) {
      try {
  const response = await axios.delete(`http://localhost:4400/api/directeurs/${id}`, { timeout: 10000 }); // 10 secondes
        if (response.data.success) {
          alert('Directeur supprimé avec succès');
        } else {
          alert('Suppression non confirmée côté serveur');
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression du directeur');
      } finally {
        // Toujours refetch la liste pour garantir la cohérence
        try {
          setLoading(true);
          const refreshed = await axios.get('http://localhost:4400/api/directeurs');
          if (refreshed.data.success) {
            console.log('Liste directeurs après suppression:', refreshed.data.directeurs);
            setDirecteurs(refreshed.data.directeurs);
          }
        } catch (err) {
          console.error('Erreur lors du refetch:', err);
        } finally {
          setLoading(false);
        }
        // Force le rechargement du composant (Next.js App Router)
        if (router && typeof router.refresh === 'function') {
          router.refresh();
        }
      }
    }
  };

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDirecteur, setEditingDirecteur] = useState<Directeur | null>(null);

  const handleEdit = (directeur: Directeur) => {
    setEditingDirecteur(directeur);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDirecteur) return;

    try {
      const response = await axios.put(`http://localhost:4400/api/directeurs/${editingDirecteur.id}`, editingDirecteur);
      if (response.data.success) {
        setDirecteurs(directeurs.map(a =>
          a.id === editingDirecteur.id ? editingDirecteur : a
        ));
        setShowEditModal(false);
        setEditingDirecteur(null);
        alert('Directeur modifié avec succès');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la modification du directeur');
    }
  };

  // Fonction d'export Excel
const handleExportExcel = () => {
  if (!filteredDirecteurs.length) {
    alert('Aucune donnée à exporter.');
    return;
  }
  const data = filteredDirecteurs.map((d: Directeur) => ({
    'Année': d.annee,
    'Nom': d.nom,
    'Prénom': d.prenom,
    'Fonction': d.fonction,
    'Naissance': d.naissance
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Directeurs scolaires');
  XLSX.writeFile(wb, 'directeurs_scolaires.xlsx');
};

  return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-100">
          <div className="p-8">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
              <button
                onClick={() => router.push('/Accueil')}
                className="bg-gray-500 text-white hover:bg-gray-600 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Retour à l'accueil
              </button>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent mb-2">
                Tableau de Bord - Directeurs
              </h1>
              <p className="text-xl text-sky-600 font-semibold">Directeurs scolaires</p>
              <div className="w-24 h-1 bg-gradient-to-r from-sky-400 to-blue-500 mx-auto mt-4 rounded-full"></div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
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
                onClick={() => setShowAddModal(!showAddModal)}
                className="bg-sky-500 text-white hover:bg-sky-600 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium"
              >
                {showAddModal ? 'Fermer le formulaire' : 'Ajouter un directeur'}
              </button>
            </div>

            {/* Add Modal */}
            {showAddModal && (
              <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
                  <h2 className="text-2xl font-bold text-sky-700 mb-6">Ajouter un Directeur</h2>
                  <form onSubmit={handleAddDirecteur} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Année</label>
                        <input
                          type="number"
                          required
                          className="input input-bordered w-full"
                          value={newDirecteur.annee}
                          onChange={(e) => setNewDirecteur({ ...newDirecteur, annee: Number(e.target.value) })}
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
                          value={newDirecteur.nom}
                          onChange={(e) => setNewDirecteur({ ...newDirecteur, nom: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                        <input
                          type="text"
                          required
                          className="input input-bordered w-full"
                          value={newDirecteur.prenom}
                          onChange={(e) => setNewDirecteur({ ...newDirecteur, prenom: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Fonction</label>
                        <input
                          type="text"
                          required
                          className="input input-bordered w-full"
                          value={newDirecteur.fonction}
                          onChange={(e) => setNewDirecteur({ ...newDirecteur, fonction: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance</label>
                        <input
                          type="date"
                          required
                          className="input input-bordered w-full"
                          value={newDirecteur.naissance}
                          onChange={(e) => setNewDirecteur({ ...newDirecteur, naissance: e.target.value })}
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
            {filterVisible && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-lg shadow mb-6">
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

            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600">
                {filteredDirecteurs.length} {filteredDirecteurs.length > 1 ? 'directeurs trouvés' : 'directeur trouvé'}
                {filteredDirecteurs.length !== directeurs.length && ` sur ${directeurs.length} au total`}
              </p>
            </div>

            {/* Edit Modal */}
            {showEditModal && editingDirecteur && (
              <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
                  <h2 className="text-2xl font-bold text-sky-700 mb-6">Modifier le Directeur</h2>
                  <form onSubmit={handleEditSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Année</label>
                        <input
                          type="number"
                          required
                          className="input input-bordered w-full"
                          value={editingDirecteur.annee}
                          onChange={(e) => setEditingDirecteur({ ...editingDirecteur, annee: Number(e.target.value) })}
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
                          value={editingDirecteur.nom}
                          onChange={(e) => setEditingDirecteur({ ...editingDirecteur, nom: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                        <input
                          type="text"
                          required
                          className="input input-bordered w-full"
                          value={editingDirecteur.prenom}
                          onChange={(e) => setEditingDirecteur({ ...editingDirecteur, prenom: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Fonction</label>
                        <input
                          type="text"
                          required
                          className="input input-bordered w-full"
                          value={editingDirecteur.fonction}
                          onChange={(e) => setEditingDirecteur({ ...editingDirecteur, fonction: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance</label>
                        <input
                          type="date"
                          required
                          className="input input-bordered w-full"
                          value={editingDirecteur.naissance}
                          onChange={(e) => setEditingDirecteur({ ...editingDirecteur, naissance: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                      <button
                        type="button"
                        onClick={() => {
                          setShowEditModal(false);
                          setEditingDirecteur(null);
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

            {error && (
              <div className="text-red-500 mb-4">{error}</div>
            )}

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
            <th className="px-6 py-4 text-left font-bold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDirecteurs.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-gray-500 bg-sky-50/50">
                <div className="flex flex-col items-center gap-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-sky-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <div>
                    <p className="text-lg font-medium text-sky-600">Aucun directeur trouvé</p>
                    <p className="text-sm text-gray-400">Ajoutez votre premier directeur en cliquant sur le bouton "Ajouter un directeur"</p>
                  </div>
                </div>
              </td>
            </tr>
          ) : (
            filteredDirecteurs.map((directeur, idx) => (
              <tr key={directeur.id || idx} className="hover:bg-sky-50/50 transition-colors duration-200 border-b border-sky-100">
                <td className="px-6 py-4 text-sky-700 font-medium">{directeur.annee}</td>
                <td className="px-6 py-4 text-gray-800 font-semibold">{directeur.nom}</td>
                <td className="px-6 py-4 text-gray-800">{directeur.prenom}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    {directeur.fonction}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{directeur.naissance}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(directeur)}
                      className="p-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                      title="Modifier"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(directeur.id)}
                      className="p-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                      title="Supprimer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={() => router.push(`/Scolaire_directeur/${directeur.id}`)}
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
)}
          </div>
        </div>
      );
};

export default ScolaireDirecteur;