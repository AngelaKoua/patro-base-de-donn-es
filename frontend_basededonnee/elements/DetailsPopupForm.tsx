import React from 'react';
import TextInput from './TextInput';
import Checkbox from './Checkbox';

export interface DetailFormData {
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
  catechumene: boolean;
  catechumene_annee: string;
  bapteme: boolean;
  bapteme_annee: string;
  communion: boolean;
  communion_annee: string;
  confirmation: boolean;
  confirmation_annee: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  formData: DetailFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const DetailsPopupForm = ({ isOpen, onClose, formData, handleChange, handleCheckboxChange, handleSubmit }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-sky-700">Détails de l'élève</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput
              label="Domicile"
              name="domicile"
              value={formData.domicile}
              onChange={handleChange}
            />
            <TextInput
              label="Quartier"
              name="quartier"
              value={formData.quartier}
              onChange={handleChange}
            />
            <TextInput
              label="Rue"
              name="rue"
              value={formData.rue}
              onChange={handleChange}
            />
            <TextInput
              label="Lot"
              name="lot"
              value={formData.lot}
              onChange={handleChange}
            />
            <TextInput
              label="Nom du père"
              name="nom_pere"
              value={formData.nom_pere}
              onChange={handleChange}
            />
            <TextInput
              label="Profession du père"
              name="profession_pere"
              value={formData.profession_pere}
              onChange={handleChange}
            />
            <TextInput
              label="Nom de la mère"
              name="nom_mere"
              value={formData.nom_mere}
              onChange={handleChange}
            />
            <TextInput
              label="Profession de la mère"
              name="profession_mere"
              value={formData.profession_mere}
              onChange={handleChange}
            />
            <TextInput
              label="Personne à contacter en cas d'urgence"
              name="personne_urgence"
              value={formData.personne_urgence}
              onChange={handleChange}
            />
            <TextInput
              label="École"
              name="ecole"
              value={formData.ecole}
              onChange={handleChange}
            />
            <TextInput
              label="Classe"
              name="classe"
              value={formData.classe}
              onChange={handleChange}
            />
            <TextInput
              label="Portfolio"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleChange}
            />
            <TextInput
              label="Réalisation"
              name="realisation"
              value={formData.realisation}
              onChange={handleChange}
            />

            <div className="col-span-2">
              <h3 className="text-lg font-semibold text-sky-700 mb-4">Sacrements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-4">
                  <Checkbox
                    label="Catéchumène"
                    name="catechumene"
                    checked={formData.catechumene}
                    onChange={handleCheckboxChange}
                  />
                  <TextInput
                    label="Année"
                    name="catechumene_annee"
                    value={formData.catechumene_annee}
                    onChange={handleChange}
                    disabled={!formData.catechumene}
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <Checkbox
                    label="Baptême"
                    name="bapteme"
                    checked={formData.bapteme}
                    onChange={handleCheckboxChange}
                  />
                  <TextInput
                    label="Année"
                    name="bapteme_annee"
                    value={formData.bapteme_annee}
                    onChange={handleChange}
                    disabled={!formData.bapteme}
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <Checkbox
                    label="1ère Communion"
                    name="communion"
                    checked={formData.communion}
                    onChange={handleCheckboxChange}
                  />
                  <TextInput
                    label="Année"
                    name="communion_annee"
                    value={formData.communion_annee}
                    onChange={handleChange}
                    disabled={!formData.communion}
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <Checkbox
                    label="Confirmation"
                    name="confirmation"
                    checked={formData.confirmation}
                    onChange={handleCheckboxChange}
                  />
                  <TextInput
                    label="Année"
                    name="confirmation_annee"
                    value={formData.confirmation_annee}
                    onChange={handleChange}
                    disabled={!formData.confirmation}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn bg-gray-500 text-white hover:bg-gray-600"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn bg-sky-500 text-white hover:bg-sky-600"
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