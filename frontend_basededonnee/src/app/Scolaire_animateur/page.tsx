'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';

interface AnimateurForm {
  annee: number;
  nom: string;
  prenom: string;
  fonction: string;
  date_naissance: string;
  sexe: string;
  section: string;
  religion: string;
}

interface Animateur extends AnimateurForm {
  id: number;
}

const ScolaireAnimateur = () => {
  // State for editing
  const [editingAnimateur, setEditingAnimateur] = useState<Animateur | null>(null);
  // Form state for add/edit
  const [formAnimateur, setFormAnimateur] = useState<AnimateurForm>({
    annee: new Date().getFullYear(),
    nom: '',
    prenom: '',
    fonction: '',
    date_naissance: '',
    sexe: '',
    section: '',
    religion: ''
  });
  // Open modal for edit
  useEffect(() => {
    if (editingAnimateur) {
      setFormAnimateur({
        annee: editingAnimateur.annee,
        nom: editingAnimateur.nom,
        prenom: editingAnimateur.prenom,
        fonction: editingAnimateur.fonction,
        date_naissance: editingAnimateur.date_naissance,
        sexe: editingAnimateur.sexe,
        section: editingAnimateur.section,
        religion: editingAnimateur.religion
      });
    }
  }, [editingAnimateur]);

  // Reset form when closing modal
  const closeModal = () => {
    setShowAddModal(false);
    setEditingAnimateur(null);
    setFormAnimateur({
      annee: new Date().getFullYear(),
      nom: '',
      prenom: '',
      fonction: '',
      date_naissance: '',
      sexe: '',
      section: '',
      religion: ''
    });
  };

  // Handle form field change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormAnimateur(prev => ({ ...prev, [name]: value }));
  };

  // Add or update animateur
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Toujours caster l'année en nombre
    const dataToSend = { ...formAnimateur, annee: Number(formAnimateur.annee) };
    if (editingAnimateur) {
      // Update
      try {
        const response = await axios.put(
          `http://localhost:4400/api/animateurs/${editingAnimateur.id}`,
          { ...dataToSend, id: editingAnimateur.id }
        );
        if (response.data.success) {
          // Recharge la liste complète depuis l'API pour garantir la cohérence
          const refreshed = await axios.get('http://localhost:4400/api/animateurs');
          if (refreshed.data.success) {
            setAnimateurs(refreshed.data.animateurs);
          }
          closeModal();
        }
      } catch {
        alert("Erreur lors de la modification de l'animateur");
      }
    } else {
      // Add
      try {
        const response = await axios.post('http://localhost:4400/api/animateurs', dataToSend);
        if (response.data.success) {
          setAnimateurs([...animateurs, { ...dataToSend, id: response.data.animateurId }]);
          closeModal();
        }
      } catch {
        alert("Erreur lors de l'ajout de l'animateur");
      }
    }
  };
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
  // const [loading, setLoading] = useState(true); // plus utilisé
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAnimateur, setNewAnimateur] = useState({
    annee: new Date().getFullYear(),
    nom: '',
    prenom: '',
    fonction: '',
    date_naissance: '',
    sexe: '',
    section: '',
    religion: ''
  });
  // const [error, setError] = useState<string | null>(null); // plus utilisé

  // Open modal for edit (doit être après la déclaration de editingAnimateur)
  useEffect(() => {
    if (editingAnimateur) {
      setFormAnimateur({
        annee: editingAnimateur.annee,
        nom: editingAnimateur.nom,
        prenom: editingAnimateur.prenom,
        fonction: editingAnimateur.fonction,
        date_naissance: editingAnimateur.date_naissance,
        sexe: editingAnimateur.sexe,
        section: editingAnimateur.section,
        religion: editingAnimateur.religion
      });
    }
  }, [editingAnimateur]);

  const filteredAnimateurs = React.useMemo(() => {
    return animateurs.filter((a) => {
      const anneeMatch = filters.annee === '' || a.annee.toString().includes(filters.annee);
      const nomMatch = filters.nom === '' || a.nom.toLowerCase().includes(filters.nom.toLowerCase());
      const prenomMatch = filters.prenom === '' || a.prenom.toLowerCase().includes(filters.prenom.toLowerCase());
      const fonctionMatch = filters.fonction === '' || a.fonction.toLowerCase().includes(filters.fonction.toLowerCase());
      const sexeMatch = filters.sexe === '' || a.sexe === filters.sexe;
      const sectionMatch = filters.section === '' || a.section === filters.section;
      const religionMatch = filters.religion === '' || a.religion === filters.religion;
      return anneeMatch && nomMatch && prenomMatch && fonctionMatch && sexeMatch && sectionMatch && religionMatch;
    });
  }, [animateurs, filters]);

  // Nombre d'éléments filtrés (doit être après filteredAnimateurs)
  const [filteredCount, setFilteredCount] = useState(0);
  useEffect(() => {
    setFilteredCount(filteredAnimateurs.length);
  }, [filteredAnimateurs]);

  useEffect(() => {
    const fetchAnimateurs = async () => {
      try {
        const response = await axios.get('http://localhost:4400/api/animateurs');
        if (response.data.success) {
          setAnimateurs(response.data.animateurs);
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        // loading géré ailleurs
      }
    };
    fetchAnimateurs();
  }, []);

  // const handleAddAnimateur = async (e: React.FormEvent) => {
  //   // ...existing code...
  // } // plus utilisé

  const handleEdit = (animateur: Animateur) => {
    setEditingAnimateur(animateur);
    // You can add modal logic here if needed
  };
  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet animateur ?')) {
      try {
        const response = await axios.delete(`http://localhost:4400/api/animateurs/${id}`);
        if (response.data.success) {
          // Refetch la liste complète après suppression pour garantir la cohérence
          const refreshed = await axios.get('http://localhost:4400/api/animateurs');
          if (refreshed.data.success) {
            setAnimateurs(refreshed.data.animateurs);
          }
          alert('Animateur supprimé avec succès !');
        }
      } catch {
        alert('Erreur lors de la suppression de l\'animateur');
      }
    }
  };

  // Fonction d'export Excel
  const handleExportExcel = () => {
    if (!filteredAnimateurs.length) {
      alert('Aucune donnée à exporter.');
      return;
    }
    const data = filteredAnimateurs.map((a: Animateur) => ({
      'Année': a.annee,
      'Nom': a.nom,
      'Prénom': a.prenom,
      'Fonction': a.fonction,
      'Naissance': a.date_naissance,
      'Sexe': a.sexe === 'M' ? 'Masculin' : 'Féminin',
      'Section': a.section,
      'Religion': a.religion
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Animateurs scolaires');
    XLSX.writeFile(wb, 'animateurs_scolaires.xlsx');
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
            Retour à l&apos;accueil
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent mb-2">
            Tableau de Bord - Animateurs
          </h1>
          <p className="text-xl text-sky-600 font-semibold">Animateurs scolaires</p>
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
            onClick={() => setShowAddModal(true)}
            className="bg-sky-500 text-white hover:bg-sky-600 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium"
          >
            Ajouter un animateur
          </button>
        </div>

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

        {/* Modal Add/Edit Animateur */}
        {(showAddModal || editingAnimateur) && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-sky-500 to-blue-600 p-6 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    {editingAnimateur ? 'Modifier un animateur' : 'Ajouter un animateur'}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-white hover:bg-white/20 rounded-lg p-2 transition-all duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-sky-700 mb-2">Année</label>
                    <input
                      type="number"
                      name="annee"
                      value={formAnimateur.annee}
                      onChange={handleFormChange}
                      className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sky-700 mb-2">Nom</label>
                    <input
                      type="text"
                      name="nom"
                      value={formAnimateur.nom}
                      onChange={handleFormChange}
                      className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sky-700 mb-2">Prénom</label>
                    <input
                      type="text"
                      name="prenom"
                      value={formAnimateur.prenom}
                      onChange={handleFormChange}
                      className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sky-700 mb-2">Fonction</label>
                    <input
                      type="text"
                      name="fonction"
                      value={formAnimateur.fonction}
                      onChange={handleFormChange}
                      className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sky-700 mb-2">Date de naissance</label>
                    <input
                      type="date"
                      name="date_naissance"
                      value={formAnimateur.date_naissance}
                      onChange={handleFormChange}
                      className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sky-700 mb-2">Section</label>
                    <select
                      name="section"
                      value={formAnimateur.section}
                      onChange={handleFormChange}
                      className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                      required
                    >
                      <option value="">Sélectionner une section</option>
                      <option value="Ste Antoinette néo">Ste Antoinette néo (05-08 ans)</option>
                      <option value="Ste Maria Goretti">Ste Maria Goretti (09-12 ans)</option>
                      <option value="Ste Thérèse">Ste Thérèse (13-15 ans)</option>
                      <option value="Ste Bernadette">Ste Bernadette (16 ans +)</option>
                      <option value="St Ange">St Ange (05-08 ans)</option>
                      <option value="St Kizito">St Tharçis(09-14 ans)</option>
                      <option value="St Tharcis">St Kizito (15-16 ans)</option>
                      <option value="St Joseph">St Dominique (17-18 ans)</option>
                      <option value="St Vincent">St Vincent (18-20 ans)</option>
                      <option value="St Joseph">St Joseph (20 ans +)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sky-700 mb-2">Sexe</label>
                    <select
                      name="sexe"
                      value={formAnimateur.sexe}
                      onChange={handleFormChange}
                      className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                      required
                    >
                      <option value="">Sélectionner le sexe</option>
                      <option value="M">Masculin</option>
                      <option value="F">Féminin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sky-700 mb-2">Religion</label>
                    <select
                      name="religion"
                      value={formAnimateur.religion}
                      onChange={handleFormChange}
                      className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                      required
                    >
                      <option value="">Sélectionner la religion</option>
                      <option value="Chrétien catholique">Chrétien catholique</option>
                      <option value="Musulman">Musulman</option>
                      <option value="Protestant">Protestant</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-400 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-500 transition-all duration-200"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="bg-sky-600 text-white px-8 py-3 rounded-lg font-bold shadow-md hover:bg-sky-700 transition-all duration-200"
                  >
                    {editingAnimateur ? 'Enregistrer les modifications' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Filter Section */}
        {filterVisible && (
          <div className="mb-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-sky-100">
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
                  type="text"
                  value={filters.annee}
                  onChange={e => setFilters({ ...filters, annee: e.target.value })}
                  className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                  placeholder="Filtrer par année"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-sky-700 mb-2">Nom</label>
                <input
                  type="text"
                  value={filters.nom}
                  onChange={e => setFilters({ ...filters, nom: e.target.value })}
                  className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                  placeholder="Filtrer par nom"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-sky-700 mb-2">Prénom</label>
                <input
                  type="text"
                  value={filters.prenom}
                  onChange={e => setFilters({ ...filters, prenom: e.target.value })}
                  className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                  placeholder="Filtrer par prénom"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-sky-700 mb-2">Fonction</label>
                <input
                  type="text"
                  value={filters.fonction}
                  onChange={e => setFilters({ ...filters, fonction: e.target.value })}
                  className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                  placeholder="Filtrer par fonction"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-sky-700 mb-2">Sexe</label>
                <select
                  value={filters.sexe}
                  onChange={e => setFilters({ ...filters, sexe: e.target.value })}
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
                  onChange={e => setFilters({ ...filters, section: e.target.value })}
                  className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                >
                  <option value="">Toutes les sections</option>
                  <option value="Ste Antoinette néo">Ste Antoinette néo (05-08 ans)</option>
                  <option value="Ste Maria Goretti">Ste Maria Goretti (09-12 ans)</option>
                  <option value="Ste Thérèse">Ste Thérèse (13-15 ans)</option>
                  <option value="Ste Bernadette">Ste Bernadette (16 ans +)</option>
                  <option value="St Ange">St Ange (05-08 ans)</option>
                  <option value="St Kizito">St Tharçis(09-14 ans)</option>
                  <option value="St Tharcis">St Kizito (15-16 ans)</option>
                  <option value="St Joseph">St Dominique (17-18 ans)</option>
                  <option value="St Vincent">St Vincent (18-20 ans)</option>
                  <option value="St Joseph">St Joseph (20 ans +)</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => setFilters({ annee: '', nom: '', prenom: '', fonction: '', sexe: '', section: '', religion: '' })}
                  className="bg-gray-500 text-white hover:bg-gray-600 px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md"
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Section Filtres + compteur */}
        {filterVisible && (
          <div className="mb-4 px-6 flex flex-col md:flex-row md:items-center md:gap-8 gap-2">
            {/* ...section filtres existante... */}
            <div className="text-sky-700 font-bold text-lg flex items-center gap-2 mt-2 md:mt-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {filteredCount} élément{filteredCount !== 1 ? 's' : ''} trouvé{filteredCount !== 1 ? 's' : ''}
            </div>
          </div>
        )}
        {/* Table Section */}
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
                          <p className="text-sm text-gray-400">Ajoutez votre premier animateur en cliquant sur le bouton &quot;Ajouter un animateur&quot;</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAnimateurs.map((animateur: Animateur) => (
                    <tr key={animateur.id} className="hover:bg-sky-50/50 transition-colors duration-200 border-b border-sky-100">
                      <td className="px-6 py-4 text-sky-700 font-medium">{animateur.annee}</td>
                      <td className="px-6 py-4 text-gray-800 font-semibold">{animateur.nom}</td>
                      <td className="px-6 py-4 text-gray-800">{animateur.prenom}</td>
                      <td className="px-6 py-4 text-gray-600">{animateur.fonction}</td>
                      <td className="px-6 py-4 text-gray-600">{animateur.date_naissance}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-medium">
                          {animateur.section}
                        </span>
                      </td>
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
                            onClick={() => router.push(`/Scolaire_animateur/${animateur.id}`)}
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
      </div>
    </div>
  );
};

export default ScolaireAnimateur;