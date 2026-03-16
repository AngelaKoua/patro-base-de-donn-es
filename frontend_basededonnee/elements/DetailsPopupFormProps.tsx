
// ...existing type definition...
export type DetailFormData = {
  domicile: string;
  quartier: string;
  rue: string;
  lot: string;
  nom_pere: string;
  profession_pere: string;
  nom_mere: string;
  profession_mere: string;
  personne_urgence: string;
  ecole: string;
  classe: string;
  portfolio: string;
  realisation: string;
  est_catechumene: boolean;
  est_bapteme: boolean;
  est_premiere_communion: boolean;
  est_confirmation: boolean;
  nombre_presence: number;
  nombre_presence_totale: number;
  communaute: string;
  nom_tuteur: string;
  prenom_tuteur: string;
  contact_tuteur: string;
  nom_tutrice: string;
  prenom_tutrice: string;
  contact_tutrice: string;
};

import React from 'react';
interface DetailsPopupFormProps {
  isOpen: boolean;
  onClose: () => void;
  formData: DetailFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const DetailsPopupForm: React.FC<DetailsPopupFormProps> = ({
  isOpen,
  onClose,
  formData,
  handleChange,
  handleSubmit
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-blue-50/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-blue-100">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-blue-100">
          <h2 className="text-2xl font-bold text-blue-800">Ajouter des détails</h2>
          <button
            onClick={onClose}
            className="text-blue-400 hover:text-blue-600 transition-colors p-1 hover:bg-blue-50 rounded-full"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Présence Section */}
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-800 mb-5 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              Présence
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Nombre de présence</label>
                <input
                  type="number"
                  name="nombre_presence"
                  value={formData.nombre_presence !== undefined && formData.nombre_presence !== null ? String(formData.nombre_presence) : ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Nombre de présence totale</label>
                <input
                  type="number"
                  name="nombre_presence_totale"
                  value={formData.nombre_presence_totale !== undefined && formData.nombre_presence_totale !== null ? String(formData.nombre_presence_totale) : ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Adresse Section */}
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-800 mb-5 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              Adresse
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Domicile</label>
                <input
                  type="text"
                  name="domicile"
                  value={formData.domicile}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Quartier</label>
                <input
                  type="text"
                  name="quartier"
                  value={formData.quartier}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Rue</label>
                <input
                  type="text"
                  name="rue"
                  value={formData.rue}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Lot</label>
                <input
                  type="text"
                  name="lot"
                  value={formData.lot}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Sacrements Section */}
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-800 mb-5 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Sacrements
            </h3>
            <div className="space-y-4">
              {[
                { id: "est_catechumene", label: "Catéchumène", value: formData.est_catechumene },
                { id: "est_bapteme", label: "Baptême", value: formData.est_bapteme },
                { id: "est_premiere_communion", label: "1ère Communion", value: formData.est_premiere_communion },
                { id: "est_confirmation", label: "Confirmation", value: formData.est_confirmation }
              ].map((sacrament) => (
                <div key={sacrament.id} className="flex items-center space-x-4 bg-white p-3 rounded-lg border border-blue-100">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={sacrament.id}
                      name={sacrament.id}
                      checked={sacrament.value}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={sacrament.id} className="ml-3 text-blue-800 font-medium">{sacrament.label}</label>
                  </div>
                  
                </div>
              ))}
            </div>
          </div>

          {/* Parents Section */}
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-800 mb-5 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Parents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Nom du père</label>
                <input type="text" name="nom_pere" value={formData.nom_pere} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Profession du père</label>
                <input type="text" name="profession_pere" value={formData.profession_pere} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Nom de la mère</label>
                <input type="text" name="nom_mere" value={formData.nom_mere} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Profession de la mère</label>
                <input type="text" name="profession_mere" value={formData.profession_mere} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-blue-700 mb-2">Personne à joindre en cas d'urgence</label>
                <input type="text" name="personne_urgence" value={formData.personne_urgence} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors" />
              </div>
            </div>
          </div>

          {/* Tuteurs/Tutrices Section */}
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-800 mb-5 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              Tuteur / Tutrice
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Nom du tuteur</label>
                <input type="text" name="nom_tuteur" value={formData.nom_tuteur || ''} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Prénom du tuteur</label>
                <input type="text" name="prenom_tuteur" value={formData.prenom_tuteur || ''} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Contact du tuteur</label>
                <input type="text" name="contact_tuteur" value={formData.contact_tuteur || ''} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Nom de la tutrice</label>
                <input type="text" name="nom_tutrice" value={formData.nom_tutrice || ''} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Prénom de la tutrice</label>
                <input type="text" name="prenom_tutrice" value={formData.prenom_tutrice || ''} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Contact de la tutrice</label>
                <input type="text" name="contact_tutrice" value={formData.contact_tutrice || ''} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors" />
              </div>
            </div>
          </div>

          {/* Communauté Section */}
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-800 mb-5 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              Communauté
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Communauté</label>
                <input type="text" name="communaute" value={formData.communaute || ''} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors" />
              </div>
            </div>
          </div>

          {/* Scolarité Section */}
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-800 mb-5 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
              Scolarité
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">École</label>
                <input
                  type="text"
                  name="ecole"
                  value={formData.ecole}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Classe</label>
                <input
                  type="text"
                  name="classe"
                  value={formData.classe}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Réalisations Section */}
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-800 mb-5 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Réalisations
            </h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Portfolio</label>
                <textarea
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Réalisations</label>
                <textarea
                  name="realisation"
                  value={formData.realisation}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-blue-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-blue-300 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-blue-200"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DetailsPopupForm;