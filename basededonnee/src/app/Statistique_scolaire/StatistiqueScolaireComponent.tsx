"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie, Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  BarElement
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  BarElement,
  ChartDataLabels
);

const CLASSES_PRIMAIRE = ["CP1", "CP2", "CE1", "CE2", "CM1", "CM2"];
const CLASSES_SECONDAIRE = ["6ème", "5ème", "4ème", "3ème", "2nde", "1ère", "Tle"];

interface PresenceRateSection { section: string; taux: number; }
interface EvolutionData { annee: number; total: number; filles: number; garcons: number; }

const StatistiqueScolaireComponent = () => {
  console.log('Rendu du composant StatistiqueScolaireComponent');
  const router = useRouter();

  // États avec valeurs par défaut garanties
  const [years, setYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Chargement des années disponibles
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    const fetchYears = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/annees`);
        console.log('Réponse du serveur:', response.data); // Debug

        if (response.data && response.data.success) {
          const yearData = response.data.annees || [];
          if (Array.isArray(yearData)) {
            setYears(yearData);
            if (yearData.length > 0) {
              setSelectedYear(yearData[0]);
            }
          } else {
            console.error('Les données ne sont pas un tableau:', yearData);
            setError("Format de données invalide");
            setYears([]);
          }
        } else {
          console.error('Réponse invalide du serveur:', response.data);
          setError("Réponse invalide du serveur");
          setYears([]);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des années:', err);
        setError("Erreur lors du chargement des années disponibles");
        setYears([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchYears();
  }, []);
// Pour les diagrammes circulaires (répartition par classe)
const [repartitionClasse, setRepartitionClasse] = useState<{ classe: string; count: number }[]>([]);
const [pieLoading, setPieLoading] = useState(false);
// Pour le diagramme circulaire de répartition par sexe
const [repartitionSexe, setRepartitionSexe] = useState<{ sexe: string; count: number }[]>([
  { sexe: 'F', count: 0 },
  { sexe: 'M', count: 0 }
]);
const [sexeLoading, setSexeLoading] = useState(false);
// Récupère la répartition par sexe pour l'année sélectionnée
useEffect(() => {
  if (!selectedYear) return;
  setSexeLoading(true);
  axios.get(`${API_URL}/api/repartition-sexe?annee=${selectedYear}`)
    .then(res => {
      if (res.data.success) {
        const data: { sexe: string; count: number }[] = res.data.data;
        // On force toujours les deux entrées F et M
        const f = data.find((d: { sexe: string; count: number }) => d.sexe === 'F')?.count || 0;
        const m = data.find((d: { sexe: string; count: number }) => d.sexe === 'M')?.count || 0;
        setRepartitionSexe([
          { sexe: 'F', count: f },
          { sexe: 'M', count: m }
        ]);
      }
    })
    .catch(() => setError("Impossible de charger la répartition par sexe"))
    .finally(() => setSexeLoading(false));
}, [selectedYear]);
// Données pour le diagramme circulaire par sexe
const dataSexe = {
  labels: ["Filles", "Garçons"],
  datasets: [
    {
      data: [
        repartitionSexe.find(s => s.sexe === 'F')?.count || 0,
        repartitionSexe.find(s => s.sexe === 'M')?.count || 0
      ],
      backgroundColor: [
        '#2a78d6', // Filles
        '#eb6834'  // Garçons
      ],
    },
  ],
};
// Pour l'histogramme par section
const [presenceRate, setPresenceRate] = useState<PresenceRateSection[]>([]);
const [presenceYear, setPresenceYear] = useState<string>("");
const [presenceLoading, setPresenceLoading] = useState(false);
// Pour l'évolution des effectifs
const [startYear, setStartYear] = useState<string>("");
const [endYear, setEndYear] = useState<string>("");
const [evolutionData, setEvolutionData] = useState<EvolutionData[]>([]);
const [evolutionLoading, setEvolutionLoading] = useState(false);
// Pour l'évolution du taux global de présence
const [presenceStartYear, setPresenceStartYear] = useState<string>("");
const [presenceEndYear, setPresenceEndYear] = useState<string>("");
const [presenceEvolution, setPresenceEvolution] = useState<{ annee: number; taux: number }[]>([]);
const [presenceEvolutionLoading, setPresenceEvolutionLoading] = useState(false);
// Récupère les années disponibles au chargement
useEffect(() => {
  axios.get(`${API_URL}/api/annees`)
    .then(res => {
      if (res.data.success) {
        setYears(res.data.annees);
        if (res.data.annees.length > 0) {
          setSelectedYear(res.data.annees[0]);
          // Définir la plage par défaut pour la courbe d'évolution présence
          setPresenceStartYear(res.data.annees[0]);
          setPresenceEndYear(res.data.annees[res.data.annees.length - 1]);
        }
      }
    })
    .catch(() => {
      setError("Impossible de charger les années disponibles");
    });
}, []);
// Récupère la répartition par classe pour l'année sélectionnée
useEffect(() => {
  if (!selectedYear) return;
  setPieLoading(true);
  axios.get(`${API_URL}/api/repartition-classes?annee=${selectedYear}`)
    .then(res => {
      if (res.data.success) setRepartitionClasse(res.data.data);
    })
    .catch(() => setError("Impossible de charger la répartition par classe"))
    .finally(() => setPieLoading(false));
}, [selectedYear]);
// Récupère l'histogramme par section pour l'année choisie
useEffect(() => {
  if (!presenceYear) return;
  setPresenceLoading(true);
  axios.get(`${API_URL}/api/presence-rate-section?annee=${presenceYear}`)
    .then(res => {
      if (res.data.success) setPresenceRate(res.data.data);
    })
    .catch(() => setError("Erreur taux de présence par section"))
    .finally(() => setPresenceLoading(false));
}, [presenceYear]);
// Récupère l'évolution des effectifs
useEffect(() => {
  if (!startYear || !endYear) return;
  setEvolutionLoading(true);
  axios.get(`${API_URL}/api/evolution/${startYear}/${endYear}`)
    .then(res => {
      if (res.data.success) setEvolutionData(res.data.evolution);
    })
    .catch(() => setError("Erreur évolution effectifs"))
    .finally(() => setEvolutionLoading(false));
}, [startYear, endYear]);
// Récupère l'évolution du taux global de présence sur la plage choisie
useEffect(() => {
  if (!presenceStartYear || !presenceEndYear) {
    setPresenceEvolution([]);
    return;
  }
  // Si la plage est invalide (début > fin), on ne fait rien
  if (parseInt(presenceStartYear) > parseInt(presenceEndYear)) {
    setPresenceEvolution([]);
    return;
  }
  setPresenceEvolutionLoading(true);
  axios.get(`${API_URL}/api/presence-rate-evolution/${presenceStartYear}/${presenceEndYear}`)
    .then(res => {
      if (res.data.success) {
        console.log('Données reçues:', res.data.evolution);
        setPresenceEvolution(res.data.evolution);
      } else {
        console.log('Pas de données reçues');
        setPresenceEvolution([]);
      }
    })
    .catch(() => { setError("Erreur évolution taux présence"); setPresenceEvolution([]); })
    .finally(() => setPresenceEvolutionLoading(false));
}, [presenceStartYear, presenceEndYear]);
// Données pour les deux diagrammes circulaires
const dataPrimaire = {
  labels: CLASSES_PRIMAIRE,
  datasets: [
    {
      data: CLASSES_PRIMAIRE.map(classe => {
        const found = repartitionClasse.find(c => c.classe === classe);
        return found ? found.count : 0;
      }),
      backgroundColor: [
        '#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300'
      ],
    },
  ],
};
const dataSecondaire = {
  labels: CLASSES_SECONDAIRE,
  datasets: [
    {
      data: CLASSES_SECONDAIRE.map(classe => {
        const found = repartitionClasse.find(c => c.classe === classe);
        return found ? found.count : 0;
      }),
      backgroundColor: [
        '#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#4a3aa7'
      ],
    },
  ],
};
const pieOptions = {
  plugins: {
    datalabels: {
      color: '#0b0b0b',
  font: { weight: 'bold' as const },
      formatter: (value: number, context: any) => {
        const dataArr: number[] = context.chart.data.datasets[0].data as number[];
        const total = dataArr.reduce((a: number, b: number) => a + b, 0);
        if (!total) return '';
        const pct = (value / total) * 100;
        return pct > 0 ? pct.toFixed(0) + '%' : '';
      },
  anchor: 'end' as const,
  align: 'end' as const,
    },
    legend: { position: 'top' as const },
    title: { display: false },
  },
};
// ...existing code for barData, barOptions, lineData, lineOptions, presenceEvolutionData, presenceEvolutionOptions
// ...existing code for rendering (return ...)
return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-100 py-8 px-4">
    <div className="max-w-7xl mx-auto">
      {/* Header avec bouton retour */}
      <div className="flex justify-between items-center mb-5">
        <button
          onClick={() => router.back()}
          className="bg-gray-500 text-white hover:bg-gray-600 px-5 py-2.5 rounded-xl shadow-md transition-all duration-200 transform hover:scale-105 flex items-center gap-2 font-medium text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Retour
        </button>
        <div className="w-24"></div>
      </div>

      {/* Titre */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent mb-2">
          Tableau de Bord
        </h1>
        <p className="text-xl text-sky-600 font-semibold">Statistiques scolaires</p>
        <div className="w-24 h-1 bg-gradient-to-r from-sky-400 to-blue-500 mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Section de sélection d&apos;année */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 mb-8 border border-sky-100">
        <h3 className="text-sm font-bold text-sky-700 mb-4 flex items-center gap-2 pb-2 border-b border-sky-100 uppercase tracking-wide">
          <div className="w-1.5 h-1.5 bg-sky-500 rounded-full"></div>
          Année scolaire
        </h3>
        <div>
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-t-2 border-b-2 border-sky-500 rounded-full animate-spin"></div>
              <span className="text-gray-600">Chargement des années...</span>
            </div>
          ) : years && years.length > 0 ? (
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full md:w-64 border-2 border-sky-200 rounded-lg px-4 py-2 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all"
            >
              <option value="">Sélectionner une année</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          ) : (
            <div className="text-gray-500">Aucune année disponible</div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg shadow-md">
          <p>{error}</p>
        </div>
      )}



      {/* Graphiques en camembert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {/* Primaire */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 border border-sky-100 hover:shadow-2xl transition-shadow duration-300">
          <h3 className="text-sm font-bold text-sky-700 mb-4 flex items-center gap-2 pb-2 border-b border-sky-100 uppercase tracking-wide">
            <div className="w-1.5 h-1.5 bg-sky-500 rounded-full"></div>
            Répartition par classe (Primaire)
          </h3>
          {pieLoading ? (
            <div className="flex justify-center items-center h-60">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-200 border-t-sky-500"></div>
            </div>
          ) : (
            <div className="h-60">
              <Pie data={dataPrimaire} options={pieOptions} plugins={[ChartDataLabels]} />
            </div>
          )}
        </div>

        {/* Secondaire */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 border border-sky-100 hover:shadow-2xl transition-shadow duration-300">
          <h3 className="text-sm font-bold text-sky-700 mb-4 flex items-center gap-2 pb-2 border-b border-sky-100 uppercase tracking-wide">
            <div className="w-1.5 h-1.5 bg-sky-500 rounded-full"></div>
            Répartition par classe (Secondaire)
          </h3>
          {pieLoading ? (
            <div className="flex justify-center items-center h-60">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-200 border-t-sky-500"></div>
            </div>
          ) : (
            <div className="h-60">
              <Pie data={dataSecondaire} options={pieOptions} plugins={[ChartDataLabels]} />
            </div>
          )}
        </div>

        {/* Par sexe */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 border border-sky-100 hover:shadow-2xl transition-shadow duration-300">
          <h3 className="text-sm font-bold text-sky-700 mb-4 flex items-center gap-2 pb-2 border-b border-sky-100 uppercase tracking-wide">
            <div className="w-1.5 h-1.5 bg-sky-500 rounded-full"></div>
            Répartition par sexe
          </h3>
          {sexeLoading ? (
            <div className="flex justify-center items-center h-60">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-500"></div>
            </div>
          ) : (
            (dataSexe.datasets[0].data[0] > 0 || dataSexe.datasets[0].data[1] > 0) ? (
              <div className="h-60">
                <Pie data={dataSexe} options={pieOptions} plugins={[ChartDataLabels]} />
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12 flex flex-col items-center">
                <svg className="w-16 h-16 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Aucune donnée pour cette année</span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Évolution des effectifs */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 mb-8 border border-sky-100">
        <h3 className="text-sm font-bold text-sky-700 mb-6 flex items-center gap-2 pb-2 border-b border-sky-100 uppercase tracking-wide">
          <div className="w-1.5 h-1.5 bg-sky-500 rounded-full"></div>
          Évolution des effectifs
        </h3>

        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-sky-700 mb-2">Année de début</label>
            <select
              value={startYear}
              onChange={e => setStartYear(e.target.value)}
              className="w-full border-2 border-sky-200 rounded-lg px-4 py-2.5 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200"
            >
              <option value="">Sélectionner</option>
              {years.map(year => (
                <option key={`start-${year}`} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-sky-700 mb-2">Année de fin</label>
            <select
              value={endYear}
              onChange={e => setEndYear(e.target.value)}
              className="w-full border-2 border-sky-200 rounded-lg px-4 py-2.5 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200"
            >
              <option value="">Sélectionner</option>
              {years.filter(year => !startYear || parseInt(year) >= parseInt(startYear)).map(year => (
                <option key={`end-${year}`} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
        
        {evolutionLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-sky-200 border-t-sky-500"></div>
          </div>
        ) : evolutionData.length > 0 ? (
          <div className="h-96">
            <Line data={{
              labels: evolutionData.map(d => d.annee.toString()),
              datasets: [
                {
                  label: 'Total',
                  data: evolutionData.map(d => d.total),
                  borderColor: '#2a78d6',
                  backgroundColor: 'rgba(42,120,214,0.15)',
                  borderWidth: 2,
                  pointRadius: 4,
                  pointHoverRadius: 6,
                  tension: 0.1,
                  fill: true,
                },
                {
                  label: 'Filles',
                  data: evolutionData.map(d => d.filles),
                  borderColor: '#eb6834',
                  backgroundColor: 'rgba(235,104,52,0.15)',
                  borderWidth: 2,
                  pointRadius: 4,
                  pointHoverRadius: 6,
                  tension: 0.1,
                  fill: false,
                },
                {
                  label: 'Garçons',
                  data: evolutionData.map(d => d.garcons),
                  borderColor: '#1baf7a',
                  backgroundColor: 'rgba(27,175,122,0.15)',
                  borderWidth: 2,
                  pointRadius: 4,
                  pointHoverRadius: 6,
                  tension: 0.1,
                  fill: false,
                },
              ],
            }} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'top' as const },
                title: { display: true, text: 'Évolution des effectifs' },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: { display: true, text: "Nombre d'enfants" },
                },
                x: {
                  title: { display: true, text: 'Année' },
                },
              },
            }} />
          </div>
        ) : (
          <div className="text-center text-gray-500 py-12 flex flex-col items-center">
            <svg className="w-16 h-16 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Sélectionnez une plage d&apos;années pour voir l&apos;évolution</span>
          </div>
        )}
      </div>

      {/* Évolution du taux de présence */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 mb-8 border border-sky-100">
        <h3 className="text-sm font-bold text-sky-700 mb-6 flex items-center gap-2 pb-2 border-b border-sky-100 uppercase tracking-wide">
          <div className="w-1.5 h-1.5 bg-sky-500 rounded-full"></div>
          Évolution du taux global de présence
        </h3>
        {/* Sélection plage d'années */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-sky-700 mb-2">Année de début</label>
            <select
              value={presenceStartYear}
              onChange={e => {
                setPresenceStartYear(e.target.value);
                // Si la nouvelle année de début > année de fin, on ajuste la fin
                if (presenceEndYear && parseInt(e.target.value) > parseInt(presenceEndYear)) {
                  setPresenceEndYear(e.target.value);
                }
              }}
              className="w-full border-2 border-sky-200 rounded-lg px-4 py-2.5 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200"
            >
              <option value="">Sélectionner</option>
              {years.map(year => (
                <option key={`presence-start-${year}`} value={year} disabled={!!presenceEndYear && parseInt(year) > parseInt(presenceEndYear)}>{year}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-sky-700 mb-2">Année de fin</label>
            <select
              value={presenceEndYear}
              onChange={e => {
                setPresenceEndYear(e.target.value);
                // Si la nouvelle année de fin < année de début, on ajuste le début
                if (presenceStartYear && parseInt(e.target.value) < parseInt(presenceStartYear)) {
                  setPresenceStartYear(e.target.value);
                }
              }}
              className="w-full border-2 border-sky-200 rounded-lg px-4 py-2.5 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200"
            >
              <option value="">Sélectionner</option>
              {years.map(year => (
                <option key={`presence-end-${year}`} value={year} disabled={!!presenceStartYear && parseInt(year) < parseInt(presenceStartYear)}>{year}</option>
              ))}
            </select>
          </div>
        </div>
        {presenceEvolutionLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-sky-200 border-t-sky-500"></div>
          </div>
        ) : presenceEvolution.length > 0 ? (
          <div className="h-96">
            <Line data={{
              labels: presenceEvolution.map(d => d.annee.toString()),
              datasets: [
                {
                  label: 'Taux global de présence (%)',
                  data: presenceEvolution.map(d => d.taux),
                  borderColor: '#2a78d6',
                  backgroundColor: 'rgba(42,120,214,0.15)',
                  borderWidth: 2,
                  pointRadius: 4,
                  pointHoverRadius: 6,
                  tension: 0.1,
                  fill: true,
                },
              ],
            }} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'top' as const },
                title: { display: true, text: 'Évolution du taux global de présence par année' },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  title: { display: true, text: 'Pourcentage (%)' },
                },
                x: {
                  title: { display: true, text: 'Année' },
                },
              },
            }} />
          </div>
        ) : (
          <div className="text-center text-gray-500 py-12 flex flex-col items-center">
            <svg className="w-16 h-16 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{presenceStartYear && presenceEndYear ? "Aucune donnée pour cette plage d'années" : "Sélectionnez une plage d'années pour voir l'évolution"}</span>
          </div>
        )}
      </div>

      {/* Taux de présence par section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 border border-sky-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 border-b border-sky-100 pb-3">
          <h3 className="text-sm font-bold text-sky-700 flex items-center gap-2 uppercase tracking-wide">
            <div className="w-1.5 h-1.5 bg-sky-500 rounded-full"></div>
            Taux de présence par section
          </h3>
          <div className="flex items-center gap-4">
            <label className="block text-sm font-semibold text-sky-700">Année</label>
            <select
              value={presenceYear}
              onChange={e => setPresenceYear(e.target.value)}
              className="border-2 border-sky-200 rounded-lg px-4 py-2.5 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200"
            >
              <option value="">Sélectionner</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
        
        {presenceLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-200 border-t-sky-500"></div>
          </div>
        ) : presenceYear && (
          presenceRate.length > 0 ? (
            <div className="h-96">
              <Bar data={{
                labels: presenceRate.map(d => d.section),
                datasets: [
                  {
                    label: 'Taux de présence (%)',
                    data: presenceRate.map(d => d.taux),
                    backgroundColor: '#2a78d6',
                    borderRadius: 4,
                  },
                ],
              }} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  title: { display: true, text: 'Taux de présence par section' },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    title: { display: true, text: 'Pourcentage (%)' },
                  },
                  x: {
                    title: { display: true, text: 'Section' },
                  },
                },
              }} />
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12 flex flex-col items-center">
              <svg className="w-16 h-16 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Aucune donnée pour cette année</span>
            </div>
          )
        )}
      </div>
    </div>
  </div>
);
};

export default StatistiqueScolaireComponent;
