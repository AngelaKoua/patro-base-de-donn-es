'use client';

import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-sky-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact</h3>
            <p className="mb-2">Patro Saint Charles Lwanga</p>
            <p className="mb-2">Air France 2, Bouaké</p>
            <p className="mb-2">Tel: +225 123 456 789</p>
            <p>Email: patrorsvbouake@gmail.com</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-sky-300 transition">
                  À propos de nous
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-sky-300 transition">
                  Nos Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-sky-300 transition">
                  Nous Contacter
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-sky-300 transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media & Newsletter */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Suivez-nous</h3>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="hover:text-sky-300 transition">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="hover:text-sky-300 transition">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="hover:text-sky-300 transition">
                <FaInstagram size={24} />
              </a>
              <a href="mailto:contact@patrodonbosco.org" className="hover:text-sky-300 transition">
                <FaEnvelope size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-sky-700 mt-8 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} Patro Saint Charles Lwanga. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

// Update the main page component
const StatistiquePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Your page content here */}
      </main>
      <Footer />
    </div>
  );
};

export default StatistiquePage;