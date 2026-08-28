'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { API_URL } from '@/lib/api';

export default function ConnexionPage() {
    const router = useRouter();

    // Liste des emails autorisés à se connecter
    const allowedEmails = [
        'kouaangela606@gmail.com',
        'patrorsvbouake@gmail.com',
        'dialloba@gmail.com'
        // Ajoutez ici les emails autorisés
    ];

    const initialValues = {
        email: '',
        mot_de_passe: '',
    };

    const validationSchema = Yup.object({
        email: Yup.string()
            .email('Email invalide')
            .required('L\'email est requis'),
        mot_de_passe: Yup.string()
            .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
            .required('Le mot de passe est requis'),
    });

   const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
) => {
    try {
        if (!allowedEmails.includes(values.email)) {
            alert('Adresse email non autorisée.');
            return;
        }

        const response = await axios.post(`${API_URL}/api/userlogin`,
            {
                email: values.email.trim(),
                mot_de_passe: values.mot_de_passe
            },
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            }
        );

        // Vérifier d'abord si la réponse existe
        if (!response || !response.data) {
            throw new Error('Réponse invalide du serveur');
        }

        const userData = response.data;

        // Vérification de la réponse
        if (userData.Error === true) {
            throw new Error(userData.Message || 'Erreur de connexion');
        }

        // Le token est maintenant géré par les cookies HTTP-only
        // Stockage sécurisé des données locales
        try {
            const expirationDate = new Date();
            expirationDate.setHours(expirationDate.getHours() + 1); // Expire dans 1 heure

            localStorage.setItem('userId', userData.userId.toString());
            localStorage.setItem('email', values.email);
            localStorage.setItem('tokenExpiration', expirationDate.toISOString());
            console.log('Données d\'authentification stockées avec succès');
        } catch (storageError) {
            console.error('Erreur de stockage:', storageError);
            throw new Error('Impossible de sauvegarder la session');
        }

        alert('Connexion réussie !');
        await router.push('/Accueil');

    } catch (error: unknown) {
        console.error('Erreur détaillée:', error);

        if (axios.isAxiosError(error)) {
            if (error.response) {
                // Erreur avec réponse du serveur
                const message = error.response.data?.Message || 'Une erreur est survenue';
                switch (error.response.status) {
                    case 400:
                        alert(message || 'Données de connexion invalides');
                        break;
                    case 401:
                        alert(message || 'Email ou mot de passe incorrect');
                        break;
                    case 403:
                        alert(message || 'Accès non autorisé');
                        break;
                    case 404:
                        alert(message || 'Utilisateur non trouvé');
                        break;
                    case 500:
                        alert('Erreur serveur. Veuillez réessayer plus tard.');
                        break;
                    default:
                        alert(message);
                }
            } else if (error.request) {
                // La requête a été faite mais pas de réponse
                alert('Impossible de contacter le serveur. Vérifiez votre connexion.');
            } else {
                // Erreur lors de la préparation de la requête
                alert('Une erreur est survenue lors de la connexion');
            }
        } else if (error instanceof Error) {
            alert(error.message || 'Une erreur est survenue lors de la connexion');
        } else {
            alert('Une erreur inconnue est survenue');
        }
    } finally {
        setSubmitting(false);
    }
};

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center p-4">
            <div className="max-w-6xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                    {/* Section image à gauche */}
                    <div className="lg:w-1/2 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-sky-400/80 to-blue-500/80 z-10"></div>
                        <div 
                            className="h-full w-full bg-cover bg-center min-h-[400px] lg:min-h-[600px]"
                            style={{ 
                                backgroundImage: "url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')" 
                            }}
                        ></div>
                        
                        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white p-8">
                            <div className="text-center space-y-6 max-w-md">
                                <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold mb-4">
                                        Bienvenue sur l&apos;application de gestion du patro
                                    </h1>
                                    <p className="text-blue-100 text-lg leading-relaxed">
                                        Connectez-vous pour accéder à tous les outils de gestion de votre patro
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section formulaire à droite */}
                    <div className="lg:w-1/2 p-8 lg:p-12">
                        <div className="max-w-md w-full mx-auto">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Connexion</h2>
                                <p className="text-gray-600">Entrez vos identifiants pour accéder à votre compte</p>
                            </div>
                            
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                            >
                                {({ isSubmitting }) => (
                                    <Form className="space-y-6">
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                                Email
                                            </label>
                                            <Field
                                                id="email"
                                                name="email"
                                                type="email"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                                                placeholder="votre@email.com"
                                            />
                                            <ErrorMessage
                                                name="email"
                                                component="div"
                                                className="text-sm text-red-500 mt-2"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="mot_de_passe" className="block text-sm font-semibold text-gray-700 mb-2">
                                                Mot de passe
                                            </label>
                                            <Field
                                                id="mot_de_passe"
                                                name="mot_de_passe"
                                                type="password"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                                                placeholder="••••••••"
                                            />
                                            <ErrorMessage
                                                name="mot_de_passe"
                                                component="div"
                                                className="text-sm text-red-500 mt-2"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none shadow-md"
                                        >
                                            {isSubmitting ? (
                                                <div className="flex items-center justify-center space-x-2">
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    <span>Connexion en cours...</span>
                                                </div>
                                            ) : 'Se connecter'}
                                        </button>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}