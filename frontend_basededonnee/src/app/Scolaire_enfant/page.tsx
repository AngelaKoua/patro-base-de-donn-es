'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';



import axios from 'axios';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import ImageUpload from '@/components/ImageUpload'; // 🎯 Import du composant unique

interface Student {
  id: number;
  numero_inscription: string;
  annee: number;
  nom: string;
  prenom: string;
  naissance: string;
  section: string;
  sexe: string;
  religion: string;
  classe: string;
}

interface FilterCriteria {
  annee: string;
  numero_inscription: string;
  nom: string;
  prenom: string;
  naissance: string;
  section: string;
  sexe: string;
  religion: string;
  classe: string;
}



const ScolairePage = () => {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    numero_inscription: '', // Ajouté
    annee: new Date().getFullYear(),
    nom: '',
    prenom: '',
    naissance: '',
    section: '',
    sexe: '',
    religion: '',
    classe: ''
  });

  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({
    annee: '',
    numero_inscription: '', // Ajouté
    nom: '',
    prenom: '',
    naissance: '',
    section: '',
    sexe: '',
    religion: '',
    classe: ''
  });

  const filteredStudents = useMemo(() => {
    let result = students.filter(student => {
      const anneeMatch = filterCriteria.annee === '' ||
        student.annee.toString().toLowerCase().includes(filterCriteria.annee.toLowerCase());
      const numeroInscriptionMatch = filterCriteria.numero_inscription === '' ||
        student.numero_inscription.toLowerCase().includes(filterCriteria.numero_inscription.toLowerCase());
      const nomMatch = filterCriteria.nom === '' ||
        student.nom.toLowerCase().includes(filterCriteria.nom.toLowerCase());
      const prenomMatch = filterCriteria.prenom === '' ||
        student.prenom.toLowerCase().includes(filterCriteria.prenom.toLowerCase());
      const naissanceMatch = filterCriteria.naissance === '' ||
        new Date(student.naissance).toISOString().split('T')[0] === filterCriteria.naissance;
      const sectionMatch = filterCriteria.section === '' ||
        student.section === filterCriteria.section;
      const sexeMatch = filterCriteria.sexe === '' ||
        student.sexe === filterCriteria.sexe;
      const religionMatch = filterCriteria.religion === '' ||
        student.religion === filterCriteria.religion;
      const classeMatch = filterCriteria.classe === '' ||
        student.classe.toLowerCase().includes(filterCriteria.classe.toLowerCase());

      return (
        anneeMatch && numeroInscriptionMatch && nomMatch && prenomMatch && naissanceMatch &&
        sectionMatch && sexeMatch && religionMatch && classeMatch
      );
    });
    // Si on filtre par année, trier par numéro d'inscription croissant
    if (filterCriteria.annee !== '') {
      result = result.slice().sort((a, b) =>
        a.numero_inscription.localeCompare(b.numero_inscription, undefined, { numeric: true })
      );
    }
    return result;
  }, [students, filterCriteria]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Traitement spécial pour les champs numériques
    if (name === 'annee') {
      const numValue = value === '' ? '' : value;
      setFilterCriteria(prev => ({
        ...prev,
        [name]: numValue
      }));
      return;
    }
    setFilterCriteria(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [showFilter, setShowFilter] = useState(false);
  useEffect(() => {
    fetchStudents();
  }, []);
  useEffect(() => {
    setFilteredCount(filteredStudents.length);
  }, [filteredStudents]);
  // Typage du state students

  const fetchStudents = async () => {
    try {
      const response = await axios.get<{ success: boolean; enfants: Student[] }>('http://localhost:4400/api/enfants');
      if (response.data.success) {
        setStudents(response.data.enfants);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des enfants:', error);
      alert('Erreur lors du chargement des enfants');
    }
  };

  const resetFilters = () => {
    setFilterCriteria({
      annee: '',
      numero_inscription: '', // Ajouté
      nom: '',
      prenom: '',
      naissance: '',
      section: '',
      sexe: '',
      religion: '',
      classe: ''
    });
  };

  // Ajouter le bouton de réinitialisation dans la section des filtres
  <div className="flex justify-end mt-4">
    <button
      onClick={resetFilters}
      className="btn bg-gray-500 text-white hover:bg-gray-600"
    >
      Réinitialiser les filtres
    </button>
  </div>

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet enfant ?')) {
      try {
        const response = await axios.delete(`http://localhost:4400/api/enfants/${id}`);
        if (response.data.success) {
          setStudents(students.filter(student => student.id !== id));
          alert('Enfant supprimé avec succès !');
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de l\'enfant');
      }
    }
  };


  // Add handleEdit function
  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      numero_inscription: student.numero_inscription, // Ajouté
      annee: student.annee,
      nom: student.nom,
      prenom: student.prenom,
      naissance: student.naissance,
      section: student.section,
      sexe: student.sexe,
      religion: student.religion,
      classe: student.classe
    });
    setShowForm(true);
  };

  const [filteredCount, setFilteredCount] = useState<number>(0);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        // Update existing student
        const response = await axios.put(`http://localhost:4400/api/enfants/${editingStudent.id}`, formData);
        if (response.data.success) {
          setStudents(students.map(student =>
            student.id === editingStudent.id ? { ...student, ...formData } : student
          ));
          alert('Enfant modifié avec succès !');
        }
      } else {
        // Add new student
        const response = await axios.post('http://localhost:4400/api/ajouter-enfant', formData);
        if (response.data.success) {
          await fetchStudents();
          alert('Enfant ajouté avec succès !');
        }
      }
      setShowForm(false);
      setEditingStudent(null);
      setFormData({
        numero_inscription: '', // Ajouté
        annee: new Date().getFullYear(),
        nom: '',
        prenom: '',
        naissance: '',
        section: '',
        sexe: '',
        religion: '',
        classe: ''
      });
    } catch (error) {
      console.error('Erreur:', error);
      alert(editingStudent ? 'Erreur lors de la modification' : 'Erreur lors de l\'ajout');
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const tableRef = useRef<HTMLDivElement>(null);
  const handleDownloadPDF = async () => {
    if (!tableRef.current) return;
    // Cible le <table> uniquement
    const table = tableRef.current.querySelector('table');
    if (!table) return;
    // Liste des éléments à forcer en blanc (table + parents jusqu'au body)
    const elements: HTMLElement[] = [];
    let el: HTMLElement | null = table;
    while (el && el.tagName !== 'BODY') {
      elements.push(el);
      el = el.parentElement;
    }
    // Sauvegarde les styles d'origine
    const prevStyles: string[] = elements.map(e => e.getAttribute('style') || '');
    elements.forEach(e => e.setAttribute('style', 'background: #fff !important; color: #222 !important;'));
    // Applique aussi le style blanc/noir à tous les th/td
    const cellElements = table.querySelectorAll('th,td');
    const prevCellStyles: string[] = [];
    cellElements.forEach((cell) => {
      prevCellStyles.push((cell as HTMLElement).getAttribute('style') || '');
      (cell as HTMLElement).setAttribute('style', 'background: #fff !important; color: #222 !important;');
    });
    try {
      const canvas = await html2canvas(table, { scale: 2, backgroundColor: '#fff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('patronnes_scolaires.pdf');
    } catch (err) {
      alert('Erreur lors de la génération du PDF. Vérifiez que le tableau est bien visible à l\'écran.');
      console.error('Erreur PDF:', err);
    } finally {
      // Restaure les styles d'origine
      elements.forEach((e, i) => {
        if (prevStyles[i]) {
          e.setAttribute('style', prevStyles[i]);
        } else {
          e.removeAttribute('style');
        }
      });
      cellElements.forEach((cell, i) => {
        if (prevCellStyles[i]) {
          (cell as HTMLElement).setAttribute('style', prevCellStyles[i]);
        } else {
          (cell as HTMLElement).removeAttribute('style');
        }
      });
    }
  };

  // Fonction d'export Excel
  const handleExportExcel = () => {
    if (!filteredStudents.length) {
      alert('Aucune donnée à exporter.');
      return;
    }
    const data = filteredStudents.map((s: Student) => ({
      'Année': s.annee,
      "N° d'inscription": s.numero_inscription,
      'Nom': s.nom,
      'Prénom': s.prenom,
      'Naissance': s.naissance,
      'Section': s.section,
      'Sexe': s.sexe === 'M' ? 'Masculin' : 'Féminin',
      'Classe': s.classe,
      'Religion': s.religion
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Patronnés scolaires');
    XLSX.writeFile(wb, 'patronnes_scolaires.xlsx');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-100">
      <div className="p-8" style={{ background: '#fff' }}>
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
          <p className="text-xl text-sky-600 font-semibold">Patronnés scolaire</p>
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
            {showForm ? 'Fermer le formulaire' : 'Ajouter un patronné'}
          </button>
        </div>

        {/* Filter Section */}
        {showFilter && (
          <div className="mb-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-sky-100">
            <h3 className="text-xl font-bold text-sky-700 mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
              </svg>
              Filtrer les patronniers
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
                <label className="block text-sm font-semibold text-sky-700 mb-2">Nom</label>
                <input
                  type="text"
                  name="nom"
                  value={filterCriteria.nom}
                  onChange={handleFilterChange}
                  className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                  placeholder="Filtrer par nom"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-sky-700 mb-2">Prénom</label>
                <input
                  type="text"
                  name="prenom"
                  value={filterCriteria.prenom}
                  onChange={handleFilterChange}
                  className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                  placeholder="Filtrer par prénom"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-sky-700 mb-2">Section</label>
                <select
                  name="section"
                  value={filterCriteria.section}
                  onChange={handleFilterChange}
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
              <div>
                <label className="block text-sm font-semibold text-sky-700 mb-2">Sexe</label>
                <select
                  name="sexe"
                  value={filterCriteria.sexe}
                  onChange={handleFilterChange}
                  className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                >
                  <option value="">Tous</option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-sky-700 mb-2">Classe</label>
                <select
                  name="classe"
                  value={filterCriteria.classe}
                  onChange={handleFilterChange}
                  className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                >
                  <option value="">Toutes</option>
                  <option value="CP1">CP1</option>
                  <option value="CP2">CP2</option>
                  <option value="CE1">CE1</option>
                  <option value="CE2">CE2</option>
                  <option value="CM1">CM1</option>
                  <option value="CM2">CM2</option>
                  <option value="6ème">6ème</option>
                  <option value="5ème">5ème</option>
                  <option value="4ème">4ème</option>
                  <option value="3ème">3ème</option>
                  <option value="2nd">2nd</option>
                  <option value="1ère">1ère</option>
                  <option value="Tle">Tle</option>
                  <option value="Néant">Néant</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-sky-700 mb-2">Religion</label>
                <select
                  name="religion"
                  value={filterCriteria.religion}
                  onChange={handleFilterChange}
                  className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                >
                  <option value="">Toutes</option>
                  <option value="Chrétien catholique">Chrétien catholique</option>
                  <option value="Musulman">Musulman</option>
                  <option value="Protestant">Protestant</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-sky-700 mb-2">Date de naissance</label>
                <input
                  type="date"
                  name="naissance"
                  value={filterCriteria.naissance}
                  onChange={handleFilterChange}
                  className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-sky-700 mb-2">N° d&apos;inscription</label>
                <input
                  type="text"
                  name="numero_inscription"
                  value={filterCriteria.numero_inscription}
                  onChange={handleFilterChange}
                  className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                  placeholder="Filtrer par N° d'inscription"
                />
              </div>
            </div>
            <div className="mt-6 p-4 bg-gradient-to-r from-sky-100 to-blue-100 rounded-lg">
              <div className="text-sky-700 font-bold text-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                </svg>
                {filteredCount} élément{filteredCount !== 1 ? 's' : ''} trouvé{filteredCount !== 1 ? 's' : ''}
              </div>
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
                    {editingStudent ? 'Modifier le patronné' : 'Ajouter un nouveau patronné'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingStudent(null);
                      setFormData({
                        numero_inscription: '',
                        annee: new Date().getFullYear(),
                        nom: '',
                        prenom: '',
                        naissance: '',
                        section: '',
                        sexe: '',
                        religion: '',
                        classe: ''
                      });
                    }}
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
                    <label className="block text-sm font-semibold text-sky-700 mb-2">N° d&apos;inscription</label>
                    <input
                      type="text"
                      name="numero_inscription"
                      value={formData.numero_inscription}
                      onChange={handleChange}
                      className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                      required
                    />
                  </div>
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
                    <label className="block text-sm font-semibold text-sky-700 mb-2">Nom</label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sky-700 mb-2">Prénom</label>
                    <input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sky-700 mb-2">Date de naissance</label>
                    <input
                      type="date"
                      name="naissance"
                      value={formData.naissance}
                      onChange={handleChange}
                      className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sky-700 mb-2">Section</label>
                    <select
                      name="section"
                      value={formData.section}
                      onChange={handleChange}
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
                      value={formData.sexe}
                      onChange={handleChange}
                      className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                      required
                    >
                      <option value="">Sélectionner le sexe</option>
                      <option value="M">Masculin</option>
                      <option value="F">Féminin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sky-700 mb-2">Classe</label>
                    <select
                      name="classe"
                      value={formData.classe}
                      onChange={handleChange}
                      className="w-full rounded-lg border-2 border-sky-200 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 px-4 py-3"
                      required
                    >
                      <option value="">Sélectionner la classe</option>
                      <option value="CP1">CP1</option>
                      <option value="CP2">CP2</option>
                      <option value="CE1">CE1</option>
                      <option value="CE2">CE2</option>
                      <option value="CM1">CM1</option>
                      <option value="CM2">CM2</option>
                      <option value="6ème">6ème</option>
                      <option value="5ème">5ème</option>
                      <option value="4ème">4ème</option>
                      <option value="3ème">3ème</option>
                      <option value="2nd">2nd</option>
                      <option value="1ère">1ère</option>
                      <option value="Tle">Tle</option>
                      <option value="Néant">Néant</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sky-700 mb-2">Religion</label>
                    <select
                      name="religion"
                      value={formData.religion}
                      onChange={handleChange}
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

                <div className="flex justify-end space-x-4 pt-6 border-t border-sky-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingStudent(null);
                      setFormData({
                        numero_inscription: '',
                        annee: new Date().getFullYear(),
                        nom: '',
                        prenom: '',
                        naissance: '',
                        section: '',
                        sexe: '',
                        religion: '',
                        classe: ''
                      });
                    }}
                    className="bg-gray-300 text-gray-700 hover:bg-gray-400 px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="bg-sky-500 text-white hover:bg-sky-600 px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md"
                  >
                    {editingStudent ? 'Modifier' : 'Ajouter'}
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
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-sky-100" ref={tableRef}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-sky-400 to-blue-400 text-white">
                  <th className="px-6 py-4 text-left font-bold">Année</th>
                  <th className="px-6 py-4 text-left font-bold">N° d&apos;inscription</th>
                  <th className="px-6 py-4 text-left font-bold">Nom</th>
                  <th className="px-6 py-4 text-left font-bold">Prénom</th>
                  <th className="px-6 py-4 text-left font-bold">Naissance</th>
                  <th className="px-6 py-4 text-left font-bold">Section</th>
                  <th className="px-6 py-4 text-left font-bold">Sexe</th>
                  <th className="px-6 py-4 text-left font-bold">Classe</th>
                  <th className="px-6 py-4 text-left font-bold">Religion</th>
                  <th className="px-6 py-4 text-left font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-12 text-center text-gray-500 bg-sky-50/50">
                      <div className="flex flex-col items-center gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-sky-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <div>
                          <p className="text-lg font-medium text-sky-600">Aucun patronné trouvé</p>
                          <p className="text-sm text-gray-400">Ajoutez votre premier patronné en cliquant sur le bouton &quot;Ajouter un patronné&quot;</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-sky-50/50 transition-colors duration-200 border-b border-sky-100">
                      <td className="px-6 py-4 text-sky-700 font-medium">{student.annee}</td>
                      <td className="px-6 py-4 text-sky-700 font-medium">{student.numero_inscription}</td>
                      <td className="px-6 py-4 text-gray-800 font-semibold">{student.nom}</td>
                      <td className="px-6 py-4 text-gray-800">{student.prenom}</td>
                      <td className="px-6 py-4 text-gray-600">{student.naissance}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-medium">
                          {student.section}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${student.sexe === 'M'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-pink-100 text-pink-700'
                          }`}>
                          {student.sexe === 'M' ? 'Masculin' : 'Féminin'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium">
                          {student.classe}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{student.religion}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(student)}
                            className="p-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                            title="Modifier"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                              <path fillRule="evenodd" d="M2 6a2 2 0 002-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(student.id)}
                            className="p-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                            title="Supprimer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                          <button
                            onClick={() => router.push(`/Scolaire_enfant/${student.id}`)}
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

export default ScolairePage;