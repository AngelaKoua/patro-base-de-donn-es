"use client";

import { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

interface UploadedImage {
  id: number;
  public_url: string;
  file_path: string;
  mime_type: string;
  created_at: string;
}

export default function TestImageUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Gestion de la sélection du fichier
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation du type de fichier
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image valide');
      return;
    }

    // Validation de la taille (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('L\'image ne doit pas dépasser 5MB');
      return;
    }

    setSelectedFile(file);
    setError('');

    // Créer un aperçu de l'image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Upload de l'image
  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Veuillez sélectionner une image');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      console.log('Uploading image:', selectedFile.name);

      const response = await axios.post(
        'http://localhost:4400/api/test/upload-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000, // 30 secondes
        }
      );

      if (response.data.success) {
        setSuccess('Image uploadée avec succès !');
        setSelectedFile(null);
        setPreviewUrl('');
        
        // Recharger la liste des images
        await fetchImages();
      }
    } catch (err) {
      console.error('Erreur upload:', err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Erreur lors de l\'upload de l\'image');
      } else {
        setError('Erreur inconnue lors de l\'upload');
      }
    } finally {
      setLoading(false);
    }
  };

  // Récupérer toutes les images
  const fetchImages = async () => {
    try {
      const response = await axios.get('http://localhost:4400/api/test/images');
      if (response.data.success) {
        setUploadedImages(response.data.images);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des images:', err);
    }
  };

  // Supprimer une image
  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:4400/api/test/images/${id}`);
      
      if (response.data.success) {
        setSuccess('Image supprimée avec succès');
        await fetchImages();
      }
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError('Erreur lors de la suppression de l\'image');
    }
  };

  // Charger les images au montage du composant
  useState(() => {
    fetchImages();
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-t-4 border-indigo-500">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <svg className="w-10 h-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Test Upload Image Supabase
          </h1>
          <p className="text-gray-600 text-lg">
            Testez l&apos;upload et l&apos;affichage d&apos;images stockées dans Supabase Storage
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-green-700 font-medium">{success}</p>
            </div>
          </div>
        )}

        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <svg className="w-7 h-7 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Uploader une image
          </h2>

          <div className="space-y-6">
            {/* File Input */}
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-indigo-300 border-dashed rounded-xl cursor-pointer bg-indigo-50 hover:bg-indigo-100 transition-all duration-200">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-16 h-16 mb-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mb-2 text-sm text-gray-700 font-semibold">
                    <span className="text-indigo-600">Cliquez pour choisir</span> ou glissez-déposez
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF, WEBP (MAX. 5MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </label>
            </div>

            {/* Preview */}
            {previewUrl && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Aperçu :</h3>
                <div className="relative w-full max-w-md mx-auto aspect-video rounded-xl overflow-hidden shadow-lg border-2 border-indigo-200">
                  <Image
                    src={previewUrl}
                    alt="Aperçu"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <p className="text-sm text-gray-600 text-center mt-2">
                  {selectedFile?.name} ({(selectedFile?.size || 0 / 1024).toFixed(2)} KB)
                </p>
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={!selectedFile || loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Upload en cours...
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Uploader l&apos;image
                </>
              )}
            </button>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <svg className="w-7 h-7 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Galerie ({uploadedImages.length})
            </h2>
            <button
              onClick={fetchImages}
              className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Rafraîchir
            </button>
          </div>

          {uploadedImages.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <svg className="w-24 h-24 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xl font-medium">Aucune image uploadée</p>
              <p className="text-sm mt-2">Uploadez votre première image pour la voir ici</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uploadedImages.map((image) => (
                <div
                  key={image.id}
                  className="group relative bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-200 border-2 border-gray-200 hover:border-indigo-300"
                >
                  <div className="aspect-video relative">
                    <Image
                      src={image.public_url}
                      alt={`Image ${image.id}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  
                  <div className="p-4 bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        ID: {image.id}
                      </span>
                      <span className="text-xs text-gray-500 bg-indigo-50 px-2 py-1 rounded font-medium">
                        {image.mime_type}
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-500 mb-3 truncate" title={image.file_path}>
                      📁 {image.file_path}
                    </p>

                    <div className="flex gap-2">
                      <a
                        href={image.public_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Voir
                      </a>
                      <button
                        onClick={() => handleDelete(image.id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-gray-600 shadow-md">
                    {new Date(image.created_at).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
