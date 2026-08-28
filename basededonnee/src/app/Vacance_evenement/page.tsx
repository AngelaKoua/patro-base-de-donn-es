'use client';
import React, { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api';

interface Evenement {
  id: number;
  annee: number;
  evenement: string;
  date_debut: string;
  date_fin: string;
  cible: string;
}

interface FilterCriteria {
  annee: string;
  evenement: string;
  date_debut: string;
  date_fin: string;
  cible: string;
}

const VacanceEvenementPage = () => {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [editingEvenement, setEditingEvenement] = useState<Evenement | null>(null);
  const [formData, setFormData] = useState({
    annee: new Date().getFullYear(),
    evenement: '',
    date_debut: '',
    date_fin: '',
    cible: ''
  });

  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({
    annee: '',
    evenement: '',
    date_debut: '',
    date_fin: '',
    cible: ''
  });

  const filteredEvenements = useMemo(() => {
    return evenements.filter(ev => {
      const anneeMatch = filterCriteria.annee === '' || ev.annee.toString().includes(filterCriteria.annee);
      const evenementMatch = filterCriteria.evenement === '' || ev.evenement.toLowerCase().includes(filterCriteria.evenement.toLowerCase());
      const dateDebutMatch = filterCriteria.date_debut === '' || ev.date_debut === filterCriteria.date_debut;
      const dateFinMatch = filterCriteria.date_fin === '' || ev.date_fin === filterCriteria.date_fin;
      const cibleMatch = filterCriteria.cible === '' || ev.cible.toLowerCase().includes(filterCriteria.cible.toLowerCase());
      return anneeMatch && evenementMatch && dateDebutMatch && dateFinMatch && cibleMatch;
    });
  }, [evenements, filterCriteria]);

  // Fonction d'export Excel
  const handleExportExcel = () => {
    if (!filteredEvenements.length) {
      alert('Aucune donnée à exporter.');
      return;
    }
    const data = filteredEvenements.map(ev => ({
      'Année': ev.annee,
      'Évènement': ev.evenement,
      'Date de début': ev.date_debut,
      'Date de fin': ev.date_fin,
      'Cible': ev.cible
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Evènements vacances');
    XLSX.writeFile(wb, 'evenements_vacances.xlsx');
  };

  const [showFilter, setShowFilter] = useState(false);
  const [filteredCount, setFilteredCount] = useState<number>(0);

  useEffect(() => {
    fetchEvenements();
  }, []);

  useEffect(() => {
    setFilteredCount(filteredEvenements.length);
  }, [filteredEvenements]);

  const fetchEvenements = async () => {
    try {
      const response = await axios.get<{ success: boolean; evenements: Evenement[] }>(`${API_URL}/api/vacance-evenement`);
      if (response.data.success) {
        setEvenements(response.data.evenements);
      }
    } catch (error) {
      alert('Erreur lors du chargement des évènements');
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilterCriteria(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilterCriteria({
      annee: '',
      evenement: '',
      date_debut: '',
      date_fin: '',
      cible: ''
    });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet évènement ?')) {
      try {
        const response = await axios.delete(`${API_URL}/api/vacance-evenement/${id}`);
        if (response.data.success) {
          setEvenements(evenements.filter(ev => ev.id !== id));
          alert('Évènement supprimé avec succès !');
        }
      } catch (error) {
        alert('Erreur lors de la suppression de l\'évènement');
      }
    }
  };

  const handleEdit = (ev: Evenement) => {
    setEditingEvenement(ev);
    setFormData({
      annee: ev.annee,
      evenement: ev.evenement,
      date_debut: ev.date_debut,
      date_fin: ev.date_fin,
      cible: ev.cible
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        annee: Number(formData.annee)
      };
      console.log('Données envoyées:', dataToSend);
      if (editingEvenement) {
        const response = await axios.put(
          `${API_URL}/api/vacance-evenement/${editingEvenement.id}`,
          dataToSend
        );
        if (response.data.success) {
          await fetchEvenements();
          alert('Évènement modifié avec succès !');
        }
      } else {
        const response = await axios.post(
          `${API_URL}/api/vacance-evenement`,
          dataToSend
        );
        if (response.data.success) {
          await fetchEvenements();
          alert('Évènement ajouté avec succès !');
        }
      }
      setShowForm(false);
      setEditingEvenement(null);
      setFormData({
        annee: new Date().getFullYear(),
        evenement: '',
        date_debut: '',
        date_fin: '',
        cible: ''
      });
    } catch (error: any) {
      console.error('Erreur détaillée:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur inconnue';
      alert(editingEvenement ?
        `Erreur lors de la modification: ${errorMessage}` :
        `Erreur lors de l'ajout: ${errorMessage}`
      );
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'annee' ? value.replace(/\D/g, '') : value
    }));
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingEvenement(null);
    setFormData({
      annee: new Date().getFullYear(),
      evenement: '',
      date_debut: '',
      date_fin: '',
      cible: ''
    });
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
            Tableau de Bord
          </h1>
          <p className="text-xl text-sky-600 font-semibold">Évènements vacances</p>
          <div className="w-24 h-1 bg-gradient-to-r from-sky-400 to-blue-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="bg-sky-500 text-white hover:bg-sky-600 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 font-medium"
          >
            {showFilter ? (
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
            onClick={() => setShowForm(!showForm)}
            className="bg-sky-500 text-white hover:bg-sky-600 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium"
          >
            {showForm ? 'Fermer le formulaire' : 'Ajouter un évènement'}
          </button>
        </div>

        {/* Filter Section */}
        {showFilter && (
          <div className="mb-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-sky-100">
            <h3 className="text-xl font-bold text-sky-700 mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
              </svg>
              Filtrer les évènements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-semibold text-sky-700 mb-2">Année</label>
                <input
                  type="text"
                  name="annee"
                  value={filterCriteria.annee}
                  onChange={handleFilterChange}
                  className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                  placeholder="Filtrer par année"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-sky-700 mb-2">Évènement</label>
                <input
                  type="text"
                  name="evenement"
                  value={filterCriteria.evenement}
                  onChange={handleFilterChange}
                  className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                  placeholder="Filtrer par évènement"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-sky-700 mb-2">Date de début</label>
                <input
                  type="date"
                  name="date_debut"
                  value={filterCriteria.date_debut}
                  onChange={handleFilterChange}
                  className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-sky-700 mb-2">Date de fin</label>
                <input
                  type="date"
                  name="date_fin"
                  value={filterCriteria.date_fin}
                  onChange={handleFilterChange}
                  className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-sky-700 mb-2">Cible</label>
                <input
                  type="text"
                  name="cible"
                  value={filterCriteria.cible}
                  onChange={handleFilterChange}
                  className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                  placeholder="Filtrer par cible"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6">
              <div className="p-4 bg-gradient-to-r from-sky-100 to-blue-100 rounded-lg">
                <div className="text-sky-700 font-bold text-lg flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                  </svg>
                  {filteredCount} évènement{filteredCount !== 1 ? 's' : ''} trouvé{filteredCount !== 1 ? 's' : ''}
                </div>
              </div>
              <button
                onClick={resetFilters}
                className="bg-gray-500 text-white hover:bg-gray-600 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-sky-500 to-blue-600 p-6 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    {editingEvenement ? 'Modifier l\'évènement' : 'Ajouter un nouvel évènement'}
                  </h2>
                  <button
                    onClick={closeForm}
                    className="text-white hover:bg-white/20 rounded-lg p-2 transition-all duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-sky-700 mb-2">Année</label>
                    <input
                      type="number"
                      name="annee"
                      value={formData.annee}
                      onChange={handleChange}
                      className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sky-700 mb-2">Évènement</label>
                    <input
                      type="text"
                      name="evenement"
                      value={formData.evenement}
                      onChange={handleChange}
                      className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sky-700 mb-2">Date de début</label>
                    <input
                      type="date"
                      name="date_debut"
                      value={formData.date_debut}
                      onChange={handleChange}
                      className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sky-700 mb-2">Date de fin</label>
                    <input
                      type="date"
                      name="date_fin"
                      value={formData.date_fin}
                      onChange={handleChange}
                      className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-sky-700 mb-2">Cible</label>
                    <input
                      type="text"
                      name="cible"
                      value={formData.cible}
                      onChange={handleChange}
                      className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-sky-100">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="bg-gray-300 text-gray-700 hover:bg-gray-400 px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="bg-sky-500 text-white hover:bg-sky-600 px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md"
                  >
                    {editingEvenement ? 'Modifier' : 'Ajouter'}
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

        {/* Table Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-sky-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-sky-400 to-blue-400 text-white">
                  <th className="px-6 py-4 text-left font-bold">Année</th>
                  <th className="px-6 py-4 text-left font-bold">Évènement</th>
                  <th className="px-6 py-4 text-left font-bold">Date de début</th>
                  <th className="px-6 py-4 text-left font-bold">Date de fin</th>
                  <th className="px-6 py-4 text-left font-bold">Cible</th>
                  <th className="px-6 py-4 text-left font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvenements.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 bg-sky-50/50">
                      <div className="flex flex-col items-center gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-sky-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4h3a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z" />
                        </svg>
                        <div>
                          <p className="text-lg font-medium text-sky-600">Aucun évènement trouvé</p>
                          <p className="text-sm text-gray-400">Ajoutez votre premier évènement en cliquant sur le bouton &quot;Ajouter un évènement&quot;</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEvenements.map((ev) => (
                    <tr key={ev.id} className="hover:bg-sky-50/50 transition-colors duration-200 border-b border-sky-100">
                      <td className="px-6 py-4 text-sky-700 font-medium">{ev.annee}</td>
                      <td className="px-6 py-4 text-gray-800 font-semibold">{ev.evenement}</td>
                      <td className="px-6 py-4 text-gray-600">{ev.date_debut}</td>
                      <td className="px-6 py-4 text-gray-600">{ev.date_fin}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                          {ev.cible}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(ev)}
                            className="p-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                            title="Modifier"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                              <path fillRule="evenodd" d="M2 6a2 2 0 002-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(ev.id)}
                            className="p-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                            title="Supprimer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                          <button
                            onClick={() => router.push(`/Vacance_evenement/${ev.id}`)}
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

export default VacanceEvenementPage;
