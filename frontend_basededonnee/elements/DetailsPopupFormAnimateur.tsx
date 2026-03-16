
import React from 'react';

interface DetailsPopupFormAnimateurProps {
  isOpen: boolean;
  onClose: () => void;
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  religion?: string;
}

const DetailsPopupFormAnimateur: React.FC<DetailsPopupFormAnimateurProps> = ({
  isOpen,
  onClose,
  formData,
  handleChange,
  handleSubmit,
  religion
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-sky-100 animate-fadeIn">
        {/* Header modernisé */}
        <div className="sticky top-0 bg-gradient-to-r from-sky-600 to-blue-700 p-8 rounded-t-3xl flex justify-between items-center shadow-md">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-wide drop-shadow-lg">Modifier les détails</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Fermer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form className="p-8 space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-800 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-sky-100 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all bg-sky-50/50 text-gray-800 placeholder-gray-400 shadow-sm"
                placeholder="Entrez votre email"
              />
              <label className="block text-sm font-semibold text-gray-800 mb-2 mt-4">Contact WhatsApp</label>
              <input
                type="text"
                name="contact_whatsapp"
                value={formData.contact_whatsapp}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-sky-100 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all bg-sky-50/50 text-gray-800 placeholder-gray-400 shadow-sm"
                placeholder="Numéro WhatsApp"
              />
              <label className="block text-sm font-semibold text-gray-800 mb-2 mt-4">Autre contact</label>
              <input
                type="text"
                name="autre_contact"
                value={formData.autre_contact}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-sky-100 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all bg-sky-50/50 text-gray-800 placeholder-gray-400 shadow-sm"
                placeholder="Autre numéro"
              />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-800 mb-2">Religion</label>
              <select
                name="religion"
                value={formData.religion}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-sky-100 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all bg-sky-50/50 text-gray-800"
              >
                <option value="">Sélectionner une religion</option>
                <option value="Chrétien catholique">Chrétien catholique</option>
                <option value="Musulman">Musulman</option>
                <option value="Protestant">Protestant</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
          </div>

          {formData.religion === "Chrétien catholique" && (
            <div className="bg-gray-100 p-6 rounded-xl mt-4 transition-all duration-200">
              <label className="block text-sm font-semibold text-gray-800 mb-2">Communauté</label>
              <input
                type="text"
                name="communaute"
                value={formData.communaute}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-sky-100 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all bg-white text-gray-900 placeholder-gray-400 mb-4"
                placeholder="Nom de la communauté"
              />
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "est_catechumene", label: "Catéchumène" },
                  { name: "est_bapteme", label: "Baptême" },
                  { name: "est_premiere_communion", label: "1ère communion" },
                  { name: "est_confirmation", label: "Confirmation" }
                ].map((item) => (
                  <label key={item.name} className="flex items-center gap-3 text-gray-700">
                    <input
                      type="checkbox"
                      name={item.name}
                      checked={formData[item.name]}
                      onChange={handleChange}
                      className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Réalisations</label>
            <textarea
              name="realisation"
              value={formData.realisation}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border-2 border-sky-100 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all bg-sky-50/50 text-gray-800 placeholder-gray-400"
              placeholder="Décrivez vos réalisations"
            />
          </div>

          <div className="flex justify-end mt-8 gap-4">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold shadow hover:bg-gray-300 transition-all">Annuler</button>
            <button type="submit" className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-8 py-2 rounded-lg font-bold shadow hover:from-sky-600 hover:to-blue-700 transition-all">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DetailsPopupFormAnimateur;