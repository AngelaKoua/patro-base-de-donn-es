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

const EvenementPage = () => {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [editingEvenement, setEditingEvenement] = useState<Evenement | null>(null);
  const [loading, setLoading] = useState(true);
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

  const [showFilter, setShowFilter] = useState(false);
  const [filteredCount, setFilteredCount] = useState<number>(0);

  useEffect(() => {
    fetchEvenements();
  }, []);

  useEffect(() => {
    setFilteredCount(filteredEvenements.length);
  }, [filteredEvenements]);

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
    XLSX.utils.book_append_sheet(wb, ws, 'Evènements scolaires');
    XLSX.writeFile(wb, 'evenements_scolaires.xlsx');
  };

  const fetchEvenements = async () => {
    setLoading(true);
    try {
      const response = await axios.get<{ success: boolean; evenements: Evenement[] }>('http://localhost:4400/api/scolaire_evenement');
      if (response.data.success) {
        setEvenements(response.data.evenements);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des évènements:', error);
      alert('Erreur lors du chargement des évènements');
    } finally {
      setLoading(false);
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
        const response = await axios.delete(`http://localhost:4400/api/scolaire_evenement/${id}`);
        if (response.data.success) {
          setEvenements(evenements.filter(ev => ev.id !== id));
          alert('Évènement supprimé avec succès !');
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
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
      console.log('Données à envoyer:', dataToSend);

      if (editingEvenement) {
        console.log('Modification de l\'événement:', editingEvenement.id);
        const response = await axios.put(
          `http://localhost:4400/api/scolaire_evenement/${editingEvenement.id}`,
          dataToSend
        );
        console.log('Réponse modification:', response.data);
        
        if (response.data.success) {
          await fetchEvenements();
          alert('Évènement modifié avec succès !');
        }
      } else {
        console.log('Ajout d\'un nouvel événement');
        const response = await axios.post(
          'http://localhost:4400/api/scolaire_evenement',
          dataToSend
        );
        console.log('Réponse ajout:', response.data);
        
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
    } catch (error) {
      console.error('Erreur détaillée:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 
          (editingEvenement ? 'Erreur lors de la modification' : 'Erreur lors de l\'ajout');
        alert(errorMessage);
      } else {
        alert(editingEvenement ? 'Erreur lors de la modification' : 'Erreur lors de l\'ajout');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'annee' ? value.replace(/\D/g, '') : value
    }));
  };

  if (loading) {
    return <div className="p-8 text-center text-lg font-semibold">Chargement...</div>;
  }

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 via-sky-25 to-blue-100 min-h-screen">
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
          Tableau de Bord - Évènements Scolaire
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
        <div className="mb-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100/50">
          <div className="flex items-center mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-sky-400 to-blue-600 rounded-full mr-4"></div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
              Filtrer les évènements
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-2 flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                Année
              </label>
              <input
                type="text"
                name="annee"
                value={filterCriteria.annee}
                onChange={handleFilterChange}
                className="w-full rounded-xl border-2 border-blue-100 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 p-3 transition-all duration-200 bg-white/90 shadow-sm hover:shadow-md"
                placeholder="Filtrer par année"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-2 flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                Évènement
              </label>
              <input
                type="text"
                name="evenement"
                value={filterCriteria.evenement}
                onChange={handleFilterChange}
                className="w-full rounded-xl border-2 border-blue-100 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 p-3 transition-all duration-200 bg-white/90 shadow-sm hover:shadow-md"
                placeholder="Filtrer par évènement"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-2 flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                Date de début
              </label>
              <input
                type="date"
                name="date_debut"
                value={filterCriteria.date_debut}
                onChange={handleFilterChange}
                className="w-full rounded-xl border-2 border-blue-100 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 p-3 transition-all duration-200 bg-white/90 shadow-sm hover:shadow-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-2 flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                Date de fin
              </label>
              <input
                type="date"
                name="date_fin"
                value={filterCriteria.date_fin}
                onChange={handleFilterChange}
                className="w-full rounded-xl border-2 border-blue-100 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 p-3 transition-all duration-200 bg-white/90 shadow-sm hover:shadow-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-blue-700 mb-2 flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                Cible
              </label>
              <input
                type="text"
                name="cible"
                value={filterCriteria.cible}
                onChange={handleFilterChange}
                className="w-full rounded-xl border-2 border-blue-100 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 p-3 transition-all duration-200 bg-white/90 shadow-sm hover:shadow-md"
                placeholder="Filtrer par cible"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6">
            <div className="flex items-center bg-gradient-to-r from-sky-50 to-blue-50 px-4 py-2 rounded-xl border border-sky-200">
              <div className="w-3 h-3 bg-sky-400 rounded-full mr-3 animate-pulse"></div>
              <span className="text-sky-700 font-semibold">
                {filteredCount} évènement{filteredCount !== 1 ? 's' : ''} trouvé{filteredCount !== 1 ? 's' : ''}
              </span>
            </div>
            
            <button
              onClick={resetFilters}
              className="bg-gray-500 text-white hover:bg-gray-600 px-4 py-2 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2 font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Réinitialiser les filtres
            </button>
          </div>
        </div>
      )}

      {/* Formulaire d'ajout/modification */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900/50 to-slate-900/60 backdrop-blur-md z-50 p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-4xl relative border border-blue-200/50 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-400 via-sky-500 to-blue-600 px-8 py-6 relative rounded-t-3xl">
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
                className="absolute top-4 right-4 text-white/90 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200 hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-3xl font-bold text-white text-center pr-12">
                {editingEvenement ? '✏️ Modifier l\'évènement' : '✨ Ajouter un nouvel évènement'}
              </h2>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-300 via-white/50 to-green-300"></div>
            </div>

            {/* Form Content */}
            <div className="p-8 bg-gradient-to-br from-blue-25 to-sky-50">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center text-blue-700 font-semibold mb-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                      Année
                    </label>
                    <input
                      type="number"
                      name="annee"
                      value={formData.annee}
                      onChange={handleChange}
                      className="w-full rounded-xl border-2 border-blue-100 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 p-4 transition-all duration-200 bg-white/90 shadow-sm hover:shadow-md font-medium"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center text-blue-700 font-semibold mb-3">
                      <div className="w-3 h-3 bg-sky-500 rounded-full mr-3"></div>
                      Évènement
                    </label>
                    <input
                      type="text"
                      name="evenement"
                      value={formData.evenement}
                      onChange={handleChange}
                      className="w-full rounded-xl border-2 border-sky-100 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 p-4 transition-all duration-200 bg-white/90 shadow-sm hover:shadow-md font-medium"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center text-blue-700 font-semibold mb-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      Date de début
                    </label>
                    <input
                      type="date"
                      name="date_debut"
                      value={formData.date_debut}
                      onChange={handleChange}
                      className="w-full rounded-xl border-2 border-green-100 focus:border-green-400 focus:ring-4 focus:ring-green-100 p-4 transition-all duration-200 bg-white/90 shadow-sm hover:shadow-md font-medium"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center text-blue-700 font-semibold mb-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                      Date de fin
                    </label>
                    <input
                      type="date"
                      name="date_fin"
                      value={formData.date_fin}
                      onChange={handleChange}
                      className="w-full rounded-xl border-2 border-orange-100 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 p-4 transition-all duration-200 bg-white/90 shadow-sm hover:shadow-md font-medium"
                      required
                    />
                  </div>
                  
                  <div className="lg:col-span-2">
                    <label className="flex items-center text-blue-700 font-semibold mb-3">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                      Cible
                    </label>
                    <input
                      type="text"
                      name="cible"
                      value={formData.cible}
                      onChange={handleChange}
                      className="w-full rounded-xl border-2 border-purple-100 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 p-4 transition-all duration-200 bg-white/90 shadow-sm hover:shadow-md font-medium"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 mt-8 pt-6 border-t border-blue-100">
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
                    className="bg-gray-300 text-gray-700 hover:bg-gray-400 px-6 py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 font-medium"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Annuler
                  </button>
                  
                  <button
                    type="submit"
                    className="bg-sky-500 text-white hover:bg-sky-600 px-8 py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 font-bold"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {editingEvenement ? 'Modifier' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
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
      {/* Tableau des évènements */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-sky-100 to-blue-100 border-b border-sky-200">
                <th className="px-6 py-4 text-left text-sm font-bold text-sky-800 uppercase tracking-wider">Année</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-sky-800 uppercase tracking-wider">Évènement</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-sky-800 uppercase tracking-wider">Date de début</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-sky-800 uppercase tracking-wider">Date de fin</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-sky-800 uppercase tracking-wider">Cible</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-sky-800 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {filteredEvenements.map((ev, index) => (
                <tr key={ev.id} className={`hover:bg-gradient-to-r hover:from-sky-25 hover:to-blue-25 transition-all duration-200 ${index % 2 === 0 ? 'bg-white/50' : 'bg-blue-25/30'}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ev.annee}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-800">{ev.evenement}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{ev.date_debut}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{ev.date_fin}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{ev.cible}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleEdit(ev)}
                        className="p-3 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110 group"
                        title="Modifier"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:scale-110 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                          <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => handleDelete(ev.id)}
                        className="p-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110 group"
                        title="Supprimer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:scale-110 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => router.push(`/Scolaire_Evenement/${ev.id}`)}
                        className="p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110 group"
                        title="Voir détails"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:scale-110 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EvenementPage;