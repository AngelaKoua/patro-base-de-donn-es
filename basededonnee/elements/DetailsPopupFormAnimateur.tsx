
import React from 'react';

// ============================================
// COMPOSANTS DE FORMULAIRE (même design que Scolaire_enfant/[id])
// ============================================

const FieldIcon = ({ icon }: { icon: string }) => {
  switch (icon) {
    case 'mail':
      return <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
    case 'phone':
      return <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm0 8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2zm8-8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zm8-8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
    case 'user':
      return <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z" /></svg>;
    case 'briefcase':
      return <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m2 0a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v3a2 2 0 002 2m10 0v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6" /></svg>;
    case 'users':
      return <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 10-8 0 4 4 0 008 0zm6 4v2a2 2 0 01-2 2h-4a2 2 0 01-2-2v-2a2 2 0 012-2h4a2 2 0 012 2z" /></svg>;
    case 'award':
      return <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>;
    default:
      return null;
  }
};

type InputFieldProps = {
  icon: string;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  placeholder?: string;
  textarea?: boolean;
};

const InputField: React.FC<InputFieldProps> = ({ icon, label, name, value, onChange, type = 'text', placeholder, textarea = false }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-semibold text-sky-700 flex items-center gap-2 mb-1">
      <FieldIcon icon={icon} /> {label}
    </label>
    {textarea ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={4}
        className="w-full border-2 border-sky-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all bg-sky-50/50 text-gray-800 placeholder-gray-400 shadow-sm"
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border-2 border-sky-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all bg-sky-50/50 text-gray-800 placeholder-gray-400 shadow-sm"
        autoComplete="off"
      />
    )}
  </div>
);

type SelectFieldProps = {
  icon: string;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
};

const SelectField: React.FC<SelectFieldProps> = ({ icon, label, name, value, onChange, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-semibold text-sky-700 flex items-center gap-2 mb-1">
      <FieldIcon icon={icon} /> {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border-2 border-sky-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all bg-sky-50/50 text-gray-800 shadow-sm"
    >
      {children}
    </select>
  </div>
);

type CheckboxFieldProps = {
  label: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  color: string;
};

const CheckboxField: React.FC<CheckboxFieldProps> = ({ label, name, checked, onChange, color }) => (
  <label className={`flex items-center gap-2 font-medium text-${color}-700 bg-${color}-50/60 px-3 py-2 rounded-lg border border-${color}-200 shadow-sm cursor-pointer transition-all`}>
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className={`accent-${color}-500 w-5 h-5 rounded focus:ring-2 focus:ring-${color}-400 transition-all`}
    />
    {label}
  </label>
);

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

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
            {/* Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-blue-700 flex items-center gap-2 mb-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Contact
              </h3>
              <InputField icon="mail" label="Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Entrez votre email" />
              <InputField icon="phone" label="Contact WhatsApp" name="contact_whatsapp" value={formData.contact_whatsapp} onChange={handleChange} placeholder="Numéro WhatsApp" />
              <InputField icon="phone" label="Autre contact" name="autre_contact" value={formData.autre_contact} onChange={handleChange} placeholder="Autre numéro" />
            </div>

            {/* Religion */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-purple-700 flex items-center gap-2 mb-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span> Informations religieuses
              </h3>
              <SelectField icon="users" label="Religion" name="religion" value={formData.religion} onChange={handleChange}>
                <option value="">Sélectionner une religion</option>
                <option value="Chrétien catholique">Chrétien catholique</option>
                <option value="Musulman">Musulman</option>
                <option value="Protestant">Protestant</option>
                <option value="Autre">Autre</option>
              </SelectField>
              {formData.religion === "Chrétien catholique" && (
                <>
                  <InputField icon="users" label="Communauté" name="communaute" value={formData.communaute} onChange={handleChange} placeholder="Nom de la communauté" />
                  <div className="flex flex-wrap gap-3 mt-2">
                    <CheckboxField label="Catéchumène" name="est_catechumene" checked={formData.est_catechumene} onChange={handleChange} color="sky" />
                    <CheckboxField label="Baptême" name="est_bapteme" checked={formData.est_bapteme} onChange={handleChange} color="blue" />
                    <CheckboxField label="1ère communion" name="est_premiere_communion" checked={formData.est_premiere_communion} onChange={handleChange} color="amber" />
                    <CheckboxField label="Confirmation" name="est_confirmation" checked={formData.est_confirmation} onChange={handleChange} color="purple" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <InputField icon="users" label="Année de baptême" name="annee_bapteme" value={formData.annee_bapteme} onChange={handleChange} />
                    <InputField icon="users" label="Année de confirmation" name="annee_confirmation" value={formData.annee_confirmation} onChange={handleChange} />
                  </div>
                </>
              )}
            </div>

            {/* Famille */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-green-700 flex items-center gap-2 mb-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span> Famille
              </h3>
              <InputField icon="user" label="Nom du père" name="nom_pere" value={formData.nom_pere} onChange={handleChange} placeholder="Nom du père" />
              <InputField icon="briefcase" label="Profession du père" name="profession_pere" value={formData.profession_pere} onChange={handleChange} placeholder="Profession du père" />
              <InputField icon="user" label="Nom de la mère" name="nom_mere" value={formData.nom_mere} onChange={handleChange} placeholder="Nom de la mère" />
              <InputField icon="briefcase" label="Profession de la mère" name="profession_mere" value={formData.profession_mere} onChange={handleChange} placeholder="Profession de la mère" />
            </div>

            {/* Réalisations */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-amber-700 flex items-center gap-2 mb-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span> Réalisations
              </h3>
              <InputField icon="award" label="Réalisations" name="realisation" value={formData.realisation} onChange={handleChange} placeholder="Décrivez vos réalisations" textarea />
            </div>
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