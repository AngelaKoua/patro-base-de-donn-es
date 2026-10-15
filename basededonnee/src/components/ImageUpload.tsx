// components/ImageUpload.tsx
// 🎯 COMPOSANT UNIQUE pour l'upload de photos, utilisable partout

import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '@/lib/api';
import CameraCaptureButton from './CameraCaptureButton';

interface ImageUploadProps {
    entityId: number;
    entityType: 'enfant' | 'animateur' | 'directeur' | 'aumonier' |
    'vacance_enfant' | 'vacance_animateur' | 'vacance_directeur' | 'vacance_aumonier';
    currentPhoto?: string;
    onPhotoUpdate: (photo: string) => void;
    label?: string;
}

/**
 * Configuration des endpoints API pour chaque type d'entité
 */
const API_CONFIG = {
    'enfant': {
        uploadEndpoint: '/api/upload-photo',
        deleteEndpoint: '/api/photos',
        idField: 'enfant_id'
    },
    'animateur': {
        uploadEndpoint: '/api/upload-photo-animateur',
        deleteEndpoint: '/api/photos-animateur',
        idField: 'animateur_id'
    },
    'directeur': {
        uploadEndpoint: '/api/upload-photo-directeur',
        deleteEndpoint: '/api/photos-directeur',
        idField: 'directeur_id'
    },
    'aumonier': {
        uploadEndpoint: '/api/upload-photo-aumonier',
        deleteEndpoint: '/api/photos-aumonier',
        idField: 'aumonier_id'
    },
    'vacance_enfant': {
        uploadEndpoint: '/api/upload-photo-vacance-enfant',
        deleteEndpoint: '/api/photos-vacance-enfant',
        idField: 'enfant_id'
    },
    'vacance_animateur': {
        uploadEndpoint: '/api/upload-photo-vacance-animateur',
        deleteEndpoint: '/api/photos-vacance-animateur',
        idField: 'animateur_id'
    },
    'vacance_directeur': {
        uploadEndpoint: '/api/upload-photo-vacance-directeur',
        deleteEndpoint: '/api/photos-vacance-directeur',
        idField: 'directeur_id'
    },
    'vacance_aumonier': {
        uploadEndpoint: '/api/upload-photo-vacance-aumonier',
        deleteEndpoint: '/api/photos-vacance-aumonier',
        idField: 'aumonier_id'
    }
};

const ImageUpload: React.FC<ImageUploadProps> = ({
    entityId,
    entityType,
    currentPhoto,
    onPhotoUpdate,
    label = "la photo"
}) => {
    const [uploading, setUploading] = useState(false);

    const config = API_CONFIG[entityType];

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;
        await uploadFile(file);
    };

    const uploadFile = async (file: File) => {
        console.log(`📤 Upload photo pour ${entityType} #${entityId}`);
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('photo', file);
            formData.append(config.idField, entityId.toString());

            const response = await axios.post(
                `${API_URL}${config.uploadEndpoint}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Accept': 'application/json'
                    },
                    timeout: 15000
                }
            );

            console.log('✅ Réponse serveur:', response.data);

            if (response.data.success && response.data.publicUrl) {
                const photoUrl = `${response.data.publicUrl}?t=${Date.now()}`;
                onPhotoUpdate(photoUrl);
                alert('Photo téléchargée avec succès !');
            } else {
                alert(response.data.message || 'Erreur lors du téléchargement');
            }
        } catch (error: any) {
            let errorMsg = "Erreur lors du téléchargement de l'image";

            if (error.response?.data?.message) {
                errorMsg += ` : ${error.response.data.message}`;
            } else if (error.message) {
                errorMsg += ` : ${error.message}`;
            }

            alert(errorMsg);
            console.error('❌ Erreur complète:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleDeletePhoto = async () => {
        if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${label} ?`)) {
            return;
        }

        try {
            const response = await axios.delete(
                `${API_URL}${config.deleteEndpoint}/${entityId}`
            );

            if (response.data.success) {
                onPhotoUpdate('');
                alert('Photo supprimée avec succès');
            }
        } catch (error) {
            console.error('❌ Erreur lors de la suppression:', error);
            alert('Erreur lors de la suppression de la photo');
        }
    };

    return (
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6">
            {/* Photo preview */}
            <div className="w-28 h-28 relative rounded-full overflow-hidden shadow-md border-2 border-sky-200">
                {currentPhoto ? (
                    <img
                        src={currentPhoto}
                        alt={`Photo de ${label}`}
                        className="w-full h-full object-cover"
                        key={currentPhoto}
                        onError={(e) => {
                            console.error('❌ Erreur de chargement de l\'image');
                            e.currentTarget.src = '';
                        }}
                    />
                ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                        </svg>
                    </div>
                )}

                {/* Loading spinner */}
                {uploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full sm:w-auto">
                <label
                    className={`cursor-pointer text-center whitespace-nowrap bg-sky-400 hover:bg-sky-500 text-white px-4 py-2 rounded-lg shadow-sm transition ${uploading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    <span>{uploading ? 'Téléchargement...' : 'Changer la photo'}</span>
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                    />
                </label>
                <CameraCaptureButton
                    onCapture={uploadFile}
                    disabled={uploading}
                    className="whitespace-nowrap bg-white border-2 border-sky-400 text-sky-600 hover:bg-sky-50 px-4 py-2 rounded-lg shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                />
            </div>
        </div>
    );
};

export default ImageUpload;