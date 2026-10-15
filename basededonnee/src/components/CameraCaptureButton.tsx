'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface CameraCaptureButtonProps {
    onCapture: (file: File) => void;
    disabled?: boolean;
    className?: string;
    label?: string;
}

/**
 * Bouton « Prendre une photo ».
 * - Téléphone / tablette : ouvre directement l'appareil photo (caméra arrière).
 * - Ordinateur : ouvre une fenêtre avec l'aperçu de la webcam et un bouton « Capturer ».
 * Si la webcam est inaccessible, un message explique comment autoriser la caméra.
 */
export default function CameraCaptureButton({
    onCapture,
    disabled = false,
    className = '',
    label = 'Prendre une photo',
}: CameraCaptureButtonProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [ready, setReady] = useState(false);

    const stopStream = () => {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
    };

    // Coupe la caméra si le composant disparaît pendant la prise de vue
    useEffect(() => stopStream, []);

    useEffect(() => {
        if (modalOpen && videoRef.current && streamRef.current) {
            videoRef.current.srcObject = streamRef.current;
        }
    }, [modalOpen]);

    const openNativeCamera = () => inputRef.current?.click();

    const handleClick = async () => {
        const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
        if (isTouchDevice || !navigator.mediaDevices?.getUserMedia) {
            openNativeCamera();
            return;
        }
        try {
            streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            setReady(false);
            setModalOpen(true);
        } catch (err) {
            console.error('Caméra inaccessible :', err);
            alert("Impossible d'accéder à la caméra. Vérifiez que vous avez autorisé son utilisation dans le navigateur.");
        }
    };

    const closeModal = () => {
        stopStream();
        setModalOpen(false);
    };

    const capture = () => {
        const video = videoRef.current;
        if (!video || !video.videoWidth) return;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d')?.drawImage(video, 0, 0);
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    alert('La capture a échoué, veuillez réessayer.');
                    return;
                }
                closeModal();
                onCapture(new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' }));
            },
            'image/jpeg',
            0.9
        );
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (file) onCapture(file);
    };

    return (
        <>
            <button type="button" onClick={handleClick} disabled={disabled} className={className}>
                📷 {label}
            </button>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
                disabled={disabled}
            />

            {modalOpen && createPortal(
                <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4" role="dialog" aria-modal="true">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-4">
                        <h3 className="text-lg font-bold text-sky-800 mb-3">Prendre une photo</h3>
                        <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                onLoadedMetadata={() => setReady(true)}
                                className="w-full h-full object-contain"
                            />
                            {!ready && (
                                <div className="absolute inset-0 flex items-center justify-center text-white text-sm">
                                    Activation de la caméra…
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                            >
                                Annuler
                            </button>
                            <button
                                type="button"
                                onClick={capture}
                                disabled={!ready}
                                className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-sm transition disabled:opacity-50"
                            >
                                📸 Capturer
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
