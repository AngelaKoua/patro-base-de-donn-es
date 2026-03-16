import React, { useState } from "react";
import Link from "next/link";

const My_navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200 border-b-2 border-blue-200 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <img 
                src="logo_patro.jpg" 
                alt="Logo" 
                className="h-10 md:h-14 rounded-lg shadow-md" 
              />
              <span className="text-xl font-bold text-blue-700 hidden sm:block">Patro</span>
            </Link>
          </div>

          {/* Menu Desktop */}
          <div className="hidden lg:flex">
            <ul className="menu menu-horizontal px-1 text-blue-700 font-medium">
              <li>
                <Link href="/Accueil" className="hover:text-blue-900 hover:bg-blue-100 rounded-lg transition-all">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/Guide" className="hover:text-blue-900 hover:bg-blue-100 rounded-lg transition-all">
                  Guide
                </Link>
              </li>

              {/* Patro scolaire */}
              <li>
                <details className="dropdown">
                  <summary className="cursor-pointer hover:text-blue-900 hover:bg-blue-100 rounded-lg transition-all">
                    Patro scolaire
                  </summary>
                  <ul className="bg-white shadow-lg rounded-lg p-2 mt-2 w-48 border border-blue-100 absolute">
                    <li>
                      <Link href="/Scolaire_enfant" className="hover:bg-blue-100 rounded-md px-2 py-1 block">
                        Patronnés / Patronnées
                      </Link>
                    </li>
                    <li>
                      <Link href="/Scolaire_animateur" className="hover:bg-blue-100 rounded-md px-2 py-1 block">
                        Animateurs / Animatrices
                      </Link>
                    </li>
                    <li>
                      <Link href="/Scolaire_directeur" className="hover:bg-blue-100 rounded-md px-2 py-1 block">
                        Directeurs
                      </Link>
                    </li>
                    <li>
                      <Link href="/scolaire_aumonier" className="hover:bg-blue-100 rounded-md px-2 py-1 block">
                        Aumôniers
                      </Link>
                    </li>
                  </ul>
                </details>
              </li>

              {/* Patro vacances */}
              <li>
                <details className="dropdown">
                  <summary className="cursor-pointer hover:text-blue-900 hover:bg-blue-100 rounded-lg transition-all">
                    Patro vacances
                  </summary>
                  <ul className="bg-white shadow-lg rounded-lg p-2 mt-2 w-48 border border-blue-100 absolute">
                    <li>
                      <Link href="/Vacance_enfant" className="hover:bg-blue-100 rounded-md px-2 py-1 block">
                        Patronnés / patronnées
                      </Link>
                    </li>
                    <li>
                      <Link href="/Vacance_animateur" className="hover:bg-blue-100 rounded-md px-2 py-1 block">
                        Animateurs / Animatrices
                      </Link>
                    </li>
                    <li>
                      <Link href="/Vacance_directeur" className="hover:bg-blue-100 rounded-md px-2 py-1 block">
                        Directeurs
                      </Link>
                    </li>
                    <li>
                      <Link href="/Vacance_aumonier" className="hover:bg-blue-100 rounded-md px-2 py-1 block">
                        Aumôniers
                      </Link>
                    </li>
                  </ul>
                </details>
              </li>

              {/* Statistiques*/}
              <li>
                <details className="dropdown">
                  <summary className="cursor-pointer hover:text-blue-900 hover:bg-blue-100 rounded-lg transition-all">
                    Statistiques
                  </summary>
                  <ul className="bg-white shadow-lg rounded-lg p-2 mt-2 w-48 border border-blue-100 absolute">
                    <li>
                      <Link href="/Statistique_scolaire" className="hover:bg-blue-100 rounded-md px-2 py-1 block">
                        Patro scolaire
                      </Link>
                    </li>
                    <li>
                      <Link href="/Statistique_vacance" className="hover:bg-blue-100 rounded-md px-2 py-1 block">
                        Patro Vacance
                      </Link>
                    </li>
                  </ul>
                </details>
              </li>

              {/* Evènements */}
              <li>
                <details className="dropdown">
                  <summary className="cursor-pointer hover:text-blue-900 hover:bg-blue-100 rounded-lg transition-all">
                    Evènements
                  </summary>
                  <ul className="bg-white shadow-lg rounded-lg p-2 mt-2 w-48 border border-blue-100 absolute">
                    <li>
                      <Link href="/Scolaire_Evenement" className="hover:bg-blue-100 rounded-md px-2 py-1 block">
                        Patro scolaire
                      </Link>
                    </li>
                    <li>
                      <Link href="/Vacance_evenement" className="hover:bg-blue-100 rounded-md px-2 py-1 block">
                        Patro Vacance
                      </Link>
                    </li>
                  </ul>
                </details>
              </li>
            </ul>
          </div>

          {/* Menu Mobile Button */}
          <div className="lg:hidden">
            <button 
              onClick={toggleMenu}
              className="text-blue-700 hover:text-blue-900 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4">
            <ul className="text-blue-700 font-medium space-y-2">
              <li>
                <Link 
                  href="/Accueil" 
                  className="block py-2 px-4 hover:text-blue-900 hover:bg-blue-100 rounded-lg transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link 
                  href="/Guide" 
                  className="block py-2 px-4 hover:text-blue-900 hover:bg-blue-100 rounded-lg transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Guide
                </Link>
              </li>

              {/* Patro scolaire */}
              <li>
                <div className="py-2 px-4 font-semibold">Patro scolaire</div>
                <ul className="pl-6 space-y-1">
                  <li>
                    <Link 
                      href="/Scolaire_enfant" 
                      className="block py-2 px-4 hover:text-blue-900 hover:bg-blue-100 rounded-lg transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Patronnés / Patronnées
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/Scolaire_animateur" 
                      className="block py-2 px-4 hover:text-blue-900 hover:bg-blue-100 rounded-lg transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Animateurs / Animatrices
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/Scolaire_directeur" 
                      className="block py-2 px-4 hover:text-blue-900 hover:bg-blue-100 rounded-lg transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Directeurs
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/scolaire_aumonier" 
                      className="block py-2 px-4 hover:text-blue-900 hover:bg-blue-100 rounded-lg transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Aumôniers
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Patro vacances */}
              <li>
                <div className="py-2 px-4 font-semibold">Patro vacances</div>
                <ul className="pl-6 space-y-1">
                  <li>
                    <Link 
                      href="/Vacance_enfant" 
                      className="block py-2 px-4 hover:text-blue-900 hover:bg-blue-100 rounded-lg transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Patronnés / patronnées
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/Vacance_animateur" 
                      className="block py-2 px-4 hover:text-blue-900 hover:bg-blue-100 rounded-lg transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Animateurs / Animatrices
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/Vacance_directeur" 
                      className="block py-2 px-4 hover:text-blue-900 hover:bg-blue-100 rounded-lg transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Directeurs
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/Vacance_aumonier" 
                      className="block py-2 px-4 hover:text-blue-900 hover:bg-blue-100 rounded-lg transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Aumôniers
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Statistiques*/}
              <li>
                <div className="py-2 px-4 font-semibold">Statistiques</div>
                <ul className="pl-6 space-y-1">
                  <li>
                    <Link 
                      href="/Statistique_scolaire" 
                      className="block py-2 px-4 hover:text-blue-900 hover:bg-blue-100 rounded-lg transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Patro scolaire
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/Statistique_vacance" 
                      className="block py-2 px-4 hover:text-blue-900 hover:bg-blue-100 rounded-lg transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Patro Vacance
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Evènements */}
              <li>
                <div className="py-2 px-4 font-semibold">Evènements</div>
                <ul className="pl-6 space-y-1">
                  <li>
                    <Link 
                      href="/Scolaire_Evenement" 
                      className="block py-2 px-4 hover:text-blue-900 hover:bg-blue-100 rounded-lg transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Patro scolaire
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/Vacance_evenement" 
                      className="block py-2 px-4 hover:text-blue-900 hover:bg-blue-100 rounded-lg transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Patro Vacance
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default My_navbar;