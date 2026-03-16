'use client';
import React, { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { useRouter } from 'next/navigation';

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
      const response = await axios.get<{ success: boolean; evenements: Evenement[] }>('http://localhost:4400/api/vacance-evenement');
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
        const response = await axios.delete(`http://localhost:4400/api/vacance_evenement/${id}`);
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
          `http://localhost:4400/api/vacance_evenement/${editingEvenement.id}`,
          dataToSend
        );
        if (response.data.success) {
          await fetchEvenements();
          alert('Évènement modifié avec succès !');
        }
      } else {
        const response = await axios.post(
          'http://localhost:4400/api/vacance_evenement',
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

  return (
    <div className="p-8">
       <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => router.push('/Accueil')}
          className="bg-gray-500 text-white hover:bg-gray-600 px-6 py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-3 font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Retour à l'accueil
        </button>
      </div>
      <div className="flex items-center mb-8">
        <div className="w-2 h-12 bg-gradient-to-b from-sky-500 to-blue-600 rounded-full mr-4"></div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-700 to-blue-800 bg-clip-text text-transparent">
          Tableau de Bord - Évènements Vacance
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="bg-sky-500 text-white hover:bg-sky-600 px-6 py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-3 font-medium"
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
          className="bg-sky-500 text-white hover:bg-sky-600 px-6 py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-3 font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          {showForm ? 'Fermer le formulaire' : 'Ajouter un évènement'}
        </button>
      </div>

      {showFilter && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Filtrer les évènements</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
              <input
                type="text"
                name="annee"
                value={filterCriteria.annee}
                onChange={handleFilterChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                placeholder="Filtrer par année"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Évènement</label>
              <input
                type="text"
                name="evenement"
                value={filterCriteria.evenement}
                onChange={handleFilterChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                placeholder="Filtrer par évènement"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
              <input
                type="date"
                name="date_debut"
                value={filterCriteria.date_debut}
                onChange={handleFilterChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
              <input
                type="date"
                name="date_fin"
                value={filterCriteria.date_fin}
                onChange={handleFilterChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cible</label>
              <input
                type="text"
                name="cible"
                value={filterCriteria.cible}
                onChange={handleFilterChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                placeholder="Filtrer par cible"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={resetFilters}
              className="btn bg-gray-500 text-white hover:bg-gray-600"
            >
              Réinitialiser les filtres
            </button>
          </div>
          <div className="text-sky-600 font-medium mt-2">
            {filteredCount} évènement{filteredCount !== 1 ? 's' : ''} trouvé{filteredCount !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      {/* Formulaire d'ajout/modification */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative">
            <button
              onClick={() => {
                setShowForm(false);
                setEditingEvenement(null);
                setFormData({
                  annee: new Date().getFullYear(),
                  evenement: '',
                  date_debut: '',
                  date_fin: '',
                  cible: ''
                });
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4 text-sky-600">
              {editingEvenement ? 'Modifier l\'évènement' : 'Ajouter un nouvel évènement'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Année</label>
                  <input
                    type="number"
                    name="annee"
                    value={formData.annee}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Évènement</label>
                  <input
                    type="text"
                    name="evenement"
                    value={formData.evenement}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date de début</label>
                  <input
                    type="date"
                    name="date_debut"
                    value={formData.date_debut}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date de fin</label>
                  <input
                    type="date"
                    name="date_fin"
                    value={formData.date_fin}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cible</label>
                  <input
                    type="text"
                    name="cible"
                    value={formData.cible}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingEvenement(null);
                    setFormData({
                      annee: new Date().getFullYear(),
                      evenement: '',
                      date_debut: '',
                      date_fin: '',
                      cible: ''
                    });
                  }}
                  className="btn bg-gray-300 text-gray-700 hover:bg-gray-400"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn bg-sky-500 text-white hover:bg-sky-600"
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
      {/* Tableau des évènements - Design amélioré */}
<div className="overflow-x-auto bg-gradient-to-br from-slate-50 to-blue-50 p-6 rounded-xl">
  <div className="bg-white shadow-xl rounded-xl border border-slate-200 overflow-hidden">
    <table className="w-full">
      <thead>
        <tr className="bg-gradient-to-r from-sky-600 to-blue-600 text-white">
          <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider border-r border-sky-500/30 last:border-r-0">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span>Année</span>
            </div>
          </th>
          <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider border-r border-sky-500/30 last:border-r-0">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <span>Évènement</span>
            </div>
          </th>
          <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider border-r border-sky-500/30 last:border-r-0">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>Début</span>
            </div>
          </th>
          <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider border-r border-sky-500/30 last:border-r-0">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>Fin</span>
            </div>
          </th>
          <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider border-r border-sky-500/30 last:border-r-0">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span>Cible</span>
            </div>
          </th>
          <th className="px-6 py-4 text-center font-semibold text-sm uppercase tracking-wider">
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              <span>Actions</span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200">
        {filteredEvenements.map((ev, index) => (
          <tr 
            key={ev.id} 
            className={`
              transition-all duration-200 ease-in-out
              hover:bg-gradient-to-r hover:from-blue-50 hover:to-sky-50 
              hover:shadow-lg hover:-translate-y-0.5
              ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}
            `}
          >
            <td className="px-6 py-4 border-r border-slate-100 last:border-r-0">
              <div className="flex items-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-800 border border-sky-200">
                  {ev.annee}
                </span>
              </div>
            </td>
            <td className="px-6 py-4 border-r border-slate-100 last:border-r-0">
              <div className="font-medium text-slate-900 max-w-xs truncate" title={ev.evenement}>
                {ev.evenement}
              </div>
            </td>
            <td className="px-6 py-4 border-r border-slate-100 last:border-r-0">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span className="text-sm text-slate-600 font-mono">
                  {ev.date_debut}
                </span>
              </div>
            </td>
            <td className="px-6 py-4 border-r border-slate-100 last:border-r-0">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                <span className="text-sm text-slate-600 font-mono">
                  {ev.date_fin}
                </span>
              </div>
            </td>
            <td className="px-6 py-4 border-r border-slate-100 last:border-r-0">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                {ev.cible}
              </span>
            </td>
            <td className="px-6 py-4">
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => handleEdit(ev)}
                        className="p-3 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110 group"
                  title="Modifier"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                  </svg>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Modifier
                  </div>
                </button>
                
                <button
                  onClick={() => handleDelete(ev.id)}
                        className="p-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110 group"
                  title="Supprimer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Supprimer
                  </div>
                </button>
                
                <button
                  onClick={() => router.push(`/Vacance_evenement/${ev.id}`)}
                        className="p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110 group"
                  title="Voir détails"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Voir détails
                  </div>
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  
  {/* Message si aucun événement */}
  {filteredEvenements.length === 0 && (
    <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-12 text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4h3a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-slate-900 mb-2">Aucun événement trouvé</h3>
      <p className="text-slate-500">Il n'y a actuellement aucun événement à afficher.</p>
    </div>
  )}
</div>
    </div>
  );
};

export default VacanceEvenementPage;