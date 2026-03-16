'use client';
import { usePathname } from 'next/navigation';
import My_navbar from '../../elements/My_navbar';
import Footer from '../../elements/Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Fonction pour vérifier si le chemin est une page de détails
  const isDetailPage = (path: string) => {
    return path.startsWith('/Scolaire_enfant/') && path !== '/Scolaire_enfant';
  };

  const isAnimateurDetailPage = (path: string) => {
    return path.startsWith('/Scolaire_animateur/') && path !== '/Scolaire_animateur';
  };

  const isDirecteurDetailPage = (path: string) => {
    return path.startsWith('/Scolaire_directeur/') && path !== '/Scolaire_directeur';
  };

  const isAumonierDetailPage = (path: string) => {
    return path.startsWith('/scolaire_aumonier/') && path !== '/scolaire_aumonier';
  };

  const isVacanceEnfantDetailPage = (path: string) => {
    return path.startsWith('/Vacance_enfant/') && path !== '/Vacance_enfant';
  };

  const isVacanceAnimateurDetailPage = (path: string) => {
    return path.startsWith('/Vacance_animateur/') && path !== '/Vacance_animateur';
  };

  const isVacanceDirecteurDetailPage = (path: string) => {
    return path.startsWith('/Vacance_directeur/') && path !== '/Vacance_directeur';
  };

  const isVacanceAumonierDetailPage = (path: string) => {
    return path.startsWith('/Vacance_aumonier/') && path !== '/Vacance_aumonier';
  };

  // Fonction pour vérifier si le chemin est une page de détail Evenement
  const isEvenementDetailPage = (path: string) => {
    return path.startsWith('/Evenement/') && path !== '/Evenement';
  };

  // Fonctions pour Scolaire_evenement[id] et Vacance_evenement[id]
  const isScolaireEvenementDetailPage = (path: string) => {
    // Masquer navbar/footer sur Scolaire_Evenement/[id] (insensible à la casse)
    return (
      path.toLowerCase().startsWith('/scolaire_evenement/') &&
      path.toLowerCase() !== '/scolaire_evenement'
    );
  };
  const isVacanceEvenementDetailPage = (path: string) => {
    return path.startsWith('/Vacance_evenement/') && path !== '/Vacance_evenement';
  };

  // Liste des pages publiques où le layout ne doit pas apparaître
  const publicPages = [
    '/Connexion',
    '/connexion',
    '/Inscription',
    '/inscription',
    '/Scolaire_enfant',
    '/Scolaire_animateur',
    '/scolaire_aumonier',
    '/Vacance_aumonier',
    '/Vacance_animateur',
    '/Scolaire_directeur',
    '/Vacance_directeur',
    '/Vacance_enfant',
    '/Evenement',
    '/Scolaire_Evenement',
    '/Vacance_evenement',
    '/Statistique_scolaire',
    '/Statistique_vacance'
  ];

  // Nouvelle logique : vérifier si c'est une page de détails
  const showLayout = !publicPages.includes(pathname) && 
                    !isDetailPage(pathname) && 
                    !isAnimateurDetailPage(pathname) &&
                    !isDirecteurDetailPage(pathname) &&
                    !isAumonierDetailPage(pathname) &&
                    !isVacanceEnfantDetailPage(pathname) &&
                    !isVacanceAnimateurDetailPage(pathname) &&
                    !isVacanceDirecteurDetailPage(pathname) &&
                    !isVacanceAumonierDetailPage(pathname) &&
                    !isEvenementDetailPage(pathname) &&
                    !isScolaireEvenementDetailPage(pathname) && // <-- Ajout ici
                    !isVacanceEvenementDetailPage(pathname) &&  // <-- Ajout ici
                    pathname !== '/';

  // Si on est sur la page d'accueil (/Accueil), on affiche aussi le layout
  const isAccueilPage = pathname === '/Accueil' || pathname === '/accueil';
  const shouldShowLayout = showLayout || isAccueilPage;

  return (
    <>
      {shouldShowLayout && <My_navbar />}
      {children}
    </>
  );
}