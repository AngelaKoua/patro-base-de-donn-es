'use client';

import { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { API_URL } from '@/lib/api';
import CameraCaptureButton from './CameraCaptureButton';

interface EventMediaUploaderProps {
    evenementId: string | number;
    type: 'scolaire' | 'vacance';
    photos: string[];
    video: string;
    onPhotosChange: (photos: string[]) => void;
    onVideoChange: (video: string) => void;
}

export default function EventMediaUploader({
    evenementId,
    type,
    photos,
    video,
    onPhotosChange,
    onVideoChange
}: EventMediaUploaderProps) {
    const [uploadingPhoto, setUploadingPhoto] = useState<number | null>(null);
    const [uploadingVideo, setUploadingVideo] = useState(false);
    const [videoError, setVideoError] = useState('');

    // Upload photo - Utilise les routes correctes selon le type
    const handlePhotoUpload = async (idx: number, file: File | null) => {
        if (!file) return;

        setUploadingPhoto(idx);
        const formData = new FormData();
        formData.append('photo', file);
        formData.append('evenement_id', evenementId.toString());
        formData.append('index', idx.toString());

        try {
            // 🔥 Routes différenciées selon le type
            const uploadUrl = type === 'scolaire'
                ? `${API_URL}/api/upload-photo-evenement`
                : `${API_URL}/api/upload-photo-vacance-evenement`;

            console.log(`📸 Upload photo #${idx + 1} via ${uploadUrl}`);

            const res = await axios.post(uploadUrl, formData);

            if (res.data.success && res.data.photoUrl) {
                const newPhotos = [...photos];
                newPhotos[idx] = res.data.photoUrl;
                onPhotosChange(newPhotos);
                console.log(`✅ Photo ${idx + 1} uploadée: ${res.data.photoUrl}`);
            } else {
                throw new Error(res.data.message || 'Erreur lors de l\'upload');
            }
        } catch (error) {
            console.error('❌ Erreur upload photo:', error);
            alert('Erreur lors de l\'upload de la photo');
        } finally {
            setUploadingPhoto(null);
        }
    };

    // Upload vidéo - Utilise les routes correctes selon le type
    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setVideoError('');
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('video/')) {
            setVideoError('Seuls les fichiers vidéo sont acceptés.');
            return;
        }

        if (file.size > 200 * 1024 * 1024) {
            setVideoError('La vidéo ne doit pas dépasser 200 Mo.');
            return;
        }

        setUploadingVideo(true);
        const formData = new FormData();
        formData.append('video', file);
        formData.append('evenementId', evenementId.toString());

        try {
            // 🔥 Routes différenciées selon le type
            const uploadUrl = type === 'scolaire'
                ? `${API_URL}/api/upload-video-evenement`
                : `${API_URL}/api/upload-video-vacance-evenement`;

            console.log(`🎥 Upload vidéo via ${uploadUrl}`);

            const res = await axios.post(uploadUrl, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (res.data.success && res.data.data?.videoUrl) {
                onVideoChange(res.data.data.videoUrl);
                alert('Vidéo uploadée avec succès !');
                console.log(`✅ Vidéo uploadée: ${res.data.data.videoUrl}`);
            } else {
                setVideoError(res.data.message || 'Erreur lors de l\'upload vidéo.');
            }
        } catch (err: any) {
            console.error('❌ Erreur upload vidéo:', err);
            setVideoError(err?.response?.data?.message || 'Erreur lors de l\'upload vidéo.');
        } finally {
            setUploadingVideo(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Photos */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-blue-100">
                <div className="flex items-center mb-4">
                    <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full mr-3"></div>
                    <h3 className="text-xl font-bold text-blue-800">📸 Photos (max 10)</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {/* 🔥 TOUJOURS afficher 10 emplacements */}
                    {Array.from({ length: 10 }).map((_, idx) => {
                        const photo = photos[idx] || '';
                        return (
                            <div key={idx} className="group relative flex flex-col">
                                <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl p-2 border-2 border-dashed border-slate-300 hover:border-blue-400 transition-all duration-200">
                                    {photo && (photo.startsWith('http') || photo.startsWith('/uploads/')) ? (
                                        <div className="w-full h-24 relative">
                                            <Image
                                                src={photo.startsWith('http') ? photo : `${API_URL}${photo}`}
                                                alt={`Photo ${idx + 1}`}
                                                fill
                                                style={{ objectFit: 'cover', borderRadius: '0.5rem' }}
                                                className="shadow-sm"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-full h-24 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center rounded-lg text-slate-500">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}

                                    {uploadingPhoto === idx && (
                                        <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center z-10">
                                            <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {/* Bouton en dehors du cadre de la photo */}
                                <label className="mt-2 block">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => handlePhotoUpload(idx, e.target.files?.[0] || null)}
                                        className="w-full text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer"
                                        disabled={uploadingPhoto === idx}
                                    />
                                </label>
                                <CameraCaptureButton
                                    onCapture={file => handlePhotoUpload(idx, file)}
                                    disabled={uploadingPhoto === idx}
                                    className="mt-2 w-full py-1.5 px-3 rounded-full text-xs font-medium bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Vidéo */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-pink-100">
                <div className="flex items-center mb-4">
                    <div className="w-2 h-8 bg-gradient-to-b from-pink-500 to-rose-500 rounded-full mr-3"></div>
                    <h3 className="text-xl font-bold text-pink-800">🎥 Vidéo (max 200 Mo)</h3>
                </div>
                <div>
                    <label className="text-pink-700 text-sm font-medium block mb-2">
                        Fichier vidéo (max 200 Mo)
                    </label>
                    <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="w-full text-xs mt-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 file:cursor-pointer cursor-pointer"
                        disabled={uploadingVideo}
                    />

                    {uploadingVideo && (
                        <div className="mt-3 flex items-center text-pink-600">
                            <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Upload en cours...
                        </div>
                    )}

                    {videoError && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
                            <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="text-red-700 text-sm">{videoError}</span>
                        </div>
                    )}

                    {video && (
                        <div className="mt-4">
                            <p className="text-green-600 text-sm mb-2 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Vidéo uploadée avec succès
                            </p>
                            <video
                                controls
                                className="w-full max-w-md rounded-lg shadow-md border border-pink-200"
                                src={video.startsWith('http') ? video : `${API_URL}${video}`}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}