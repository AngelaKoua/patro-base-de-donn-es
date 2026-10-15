import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { API_URL } from "@/lib/api";

type NavLink = { href: string; label: string };
type NavGroup = { label: string; links: NavLink[] };
type NavItem = NavLink | NavGroup;

const NAV_ITEMS: NavItem[] = [
  { href: "/Accueil", label: "Accueil" },
  { href: "/Guide", label: "Guide" },
  {
    label: "Patro scolaire",
    links: [
      { href: "/Scolaire_enfant", label: "Patronnés / Patronnées" },
      { href: "/Scolaire_animateur", label: "Animateurs / Animatrices" },
      { href: "/Scolaire_directeur", label: "Directeurs" },
      { href: "/scolaire_aumonier", label: "Aumôniers" },
    ],
  },
  {
    label: "Patro vacances",
    links: [
      { href: "/Vacance_enfant", label: "Patronnés / Patronnées" },
      { href: "/Vacance_animateur", label: "Animateurs / Animatrices" },
      { href: "/Vacance_directeur", label: "Directeurs" },
      { href: "/Vacance_aumonier", label: "Aumôniers" },
    ],
  },
  {
    label: "Statistiques",
    links: [
      { href: "/Statistique_scolaire", label: "Patro scolaire" },
      { href: "/Statistique_vacance", label: "Patro vacances" },
    ],
  },
  {
    label: "Évènements",
    links: [
      { href: "/Scolaire_Evenement", label: "Patro scolaire" },
      { href: "/Vacance_evenement", label: "Patro vacances" },
    ],
  },
  { href: "/Compte", label: "Gestion de compte" },
];

const isGroup = (item: NavItem): item is NavGroup => "links" in item;

const LogoutIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const My_navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const desktopRef = useRef<HTMLUListElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  // Ferme les menus quand on change de page
  useEffect(() => {
    setIsMenuOpen(false);
    setOpenGroup(null);
  }, [pathname]);

  // Ferme le sous-menu ouvert au clic en dehors ou avec la touche Échap
  useEffect(() => {
    if (!openGroup) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!desktopRef.current?.contains(target) && !mobileRef.current?.contains(target)) setOpenGroup(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenGroup(null);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [openGroup]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const groupActive = (group: NavGroup) => group.links.some((l) => isActive(l.href));
  const toggleGroup = (label: string) => setOpenGroup((current) => (current === label ? null : label));

  const handleLogout = async () => {
    if (!window.confirm("Voulez-vous vous déconnecter ?")) return;
    try {
      await axios.post(`${API_URL}/api/logout`, {}, { withCredentials: true });
    } catch {
      // On déconnecte quand même côté navigateur
    }
    try {
      ["token", "userId", "email", "tokenExpiration"].forEach((key) => localStorage.removeItem(key));
    } catch {
      // stockage local indisponible
    }
    setIsMenuOpen(false);
    router.push("/");
  };

  const desktopItemClass = (active: boolean) =>
    `flex items-center gap-1 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
      active ? "bg-blue-600 text-white shadow-sm" : "text-blue-800 hover:bg-blue-100 hover:text-blue-900"
    }`;
  const mobileLinkClass = (active: boolean) =>
    `block py-2.5 px-4 rounded-lg transition-colors ${
      active ? "bg-blue-600 text-white" : "text-blue-800 hover:bg-blue-100"
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200 border-b-2 border-blue-200 shadow-lg">
      <div className="mx-auto max-w-screen-2xl px-3 sm:px-4">
        <div className="flex h-16 items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/Accueil" className="flex items-center gap-2 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo_patro.jpg" alt="Logo du patro" className="h-11 w-auto rounded-lg shadow-md" />
            <span className="text-xl font-bold text-blue-700 hidden sm:block">Patro</span>
          </Link>

          {/* Menu ordinateur (≥ 1280 px) */}
          <ul ref={desktopRef} className="hidden xl:flex items-center gap-1 text-[15px] font-medium">
            {NAV_ITEMS.map((item) =>
              isGroup(item) ? (
                <li key={item.label} className="relative">
                  <button
                    type="button"
                    onClick={() => toggleGroup(item.label)}
                    aria-expanded={openGroup === item.label}
                    className={desktopItemClass(groupActive(item))}
                  >
                    {item.label}
                    <ChevronIcon open={openGroup === item.label} />
                  </button>
                  {openGroup === item.label && (
                    <ul className="absolute left-0 top-full mt-2 min-w-56 bg-white shadow-xl rounded-xl p-2 border border-blue-100">
                      {item.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            onClick={() => setOpenGroup(null)}
                            className={`block px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                              isActive(link.href) ? "bg-blue-600 text-white" : "text-blue-800 hover:bg-blue-50"
                            }`}
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ) : (
                <li key={item.href}>
                  <Link href={item.href} className={desktopItemClass(isActive(item.href))}>
                    {item.label}
                  </Link>
                </li>
              )
            )}
            <li>
              <button
                type="button"
                onClick={handleLogout}
                className="ml-1 p-2 text-blue-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                aria-label="Se déconnecter"
                title="Se déconnecter"
              >
                <LogoutIcon className="w-6 h-6" />
              </button>
            </li>
          </ul>

          {/* Boutons mobile / tablette (< 1280 px) */}
          <div className="xl:hidden flex items-center gap-1">
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 text-blue-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="Se déconnecter"
              title="Se déconnecter"
            >
              <LogoutIcon className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={() => {
                // À l'ouverture, la section de la page en cours est dépliée
                setOpenGroup(isMenuOpen ? null : NAV_ITEMS.find((item) => isGroup(item) && groupActive(item))?.label ?? null);
                setIsMenuOpen((open) => !open);
              }}
              className="p-2 text-blue-700 hover:text-blue-900 hover:bg-blue-100 rounded-lg transition-colors"
              aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={isMenuOpen}
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile / tablette */}
      {isMenuOpen && (
        <div ref={mobileRef} className="xl:hidden border-t border-blue-200 bg-blue-50/95 backdrop-blur max-h-[calc(100dvh-4rem)] overflow-y-auto">
          <ul className="mx-auto max-w-screen-sm px-3 py-3 space-y-1 font-medium sm:grid sm:grid-cols-2 sm:gap-x-4 sm:space-y-0 sm:max-w-screen-md">
            {NAV_ITEMS.map((item) =>
              isGroup(item) ? (
                <li key={item.label} className="sm:py-1">
                  <button
                    type="button"
                    onClick={() => toggleGroup(item.label)}
                    aria-expanded={openGroup === item.label}
                    className={`w-full flex items-center justify-between py-2.5 px-4 rounded-lg transition-colors ${
                      groupActive(item) ? "text-blue-900 font-semibold" : "text-blue-800"
                    } hover:bg-blue-100`}
                  >
                    {item.label}
                    <ChevronIcon open={openGroup === item.label} />
                  </button>
                  {(openGroup === item.label) && (
                    <ul className="pl-4 mt-1 space-y-1 border-l-2 border-blue-200 ml-4">
                      {item.links.map((link) => (
                        <li key={link.href}>
                          <Link href={link.href} className={mobileLinkClass(isActive(link.href))}>
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ) : (
                <li key={item.href} className="sm:py-1">
                  <Link href={item.href} className={mobileLinkClass(isActive(item.href))}>
                    {item.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default My_navbar;
