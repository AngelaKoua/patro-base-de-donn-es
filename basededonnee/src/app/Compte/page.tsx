'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { API_URL } from '@/lib/api';

const inputClass =
    'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition-all duration-200 bg-gray-50 focus:bg-white';

export default function ComptePage() {
    const router = useRouter();
    const [emailActuel, setEmailActuel] = useState('');
    const [chargement, setChargement] = useState(true);

    useEffect(() => {
        axios
            .get(`${API_URL}/api/compte`, { withCredentials: true })
            .then((res) => setEmailActuel(res.data.user.email))
            .catch((err) => {
                if (err.response?.status === 401) {
                    alert('Votre session a expiré, veuillez vous reconnecter.');
                    router.push('/');
                } else {
                    alert(err.response?.data?.message || 'Impossible de charger les informations du compte');
                }
            })
            .finally(() => setChargement(false));
    }, [router]);

    const initialValues = {
        nouvel_email: '',
        nouveau_mot_de_passe: '',
        confirmation: '',
        mot_de_passe_actuel: '',
    };

    const validationSchema = Yup.object({
        nouvel_email: Yup.string().email('Email invalide'),
        nouveau_mot_de_passe: Yup.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
        confirmation: Yup.string().when('nouveau_mot_de_passe', {
            is: (v: string | undefined) => !!v,
            then: (schema) =>
                schema
                    .required('Veuillez confirmer le nouveau mot de passe')
                    .oneOf([Yup.ref('nouveau_mot_de_passe')], 'Les mots de passe ne correspondent pas'),
        }),
        mot_de_passe_actuel: Yup.string().required('Le mot de passe actuel est requis'),
    });

    const handleSubmit = async (
        values: typeof initialValues,
        { setSubmitting, resetForm }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void }
    ) => {
        if (!values.nouvel_email && !values.nouveau_mot_de_passe) {
            alert('Renseignez un nouvel email ou un nouveau mot de passe.');
            setSubmitting(false);
            return;
        }
        try {
            const res = await axios.put(
                `${API_URL}/api/compte`,
                {
                    nouvel_email: values.nouvel_email,
                    nouveau_mot_de_passe: values.nouveau_mot_de_passe,
                    mot_de_passe_actuel: values.mot_de_passe_actuel,
                },
                { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
            );
            setEmailActuel(res.data.email);
            try {
                localStorage.setItem('email', res.data.email);
            } catch {
                // stockage local indisponible : sans conséquence, la session est dans le cookie
            }
            resetForm();
            alert('Vos informations de connexion ont été mises à jour.');
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response) {
                if (err.response.status === 401) {
                    alert('Votre session a expiré, veuillez vous reconnecter.');
                    router.push('/');
                    return;
                }
                alert(err.response.data?.message || 'Une erreur est survenue');
            } else {
                alert('Impossible de contacter le serveur.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-start justify-center p-4 pt-10">
            <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8 lg:p-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion de compte</h1>
                    <p className="text-gray-600">Modifiez l&apos;email ou le mot de passe utilisés pour vous connecter</p>
                </div>

                <div className="mb-8 rounded-lg bg-sky-50 border border-sky-100 px-4 py-3">
                    <p className="text-sm text-gray-600">Email actuel</p>
                    <p className="font-semibold text-sky-700 break-all">{chargement ? 'Chargement…' : emailActuel || '—'}</p>
                </div>

                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    {({ isSubmitting }) => (
                        <Form className="space-y-6">
                            <div>
                                <label htmlFor="nouvel_email" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nouvel email <span className="font-normal text-gray-500">(laisser vide pour ne pas changer)</span>
                                </label>
                                <Field id="nouvel_email" name="nouvel_email" type="email" autoComplete="email" className={inputClass} placeholder="nouvel@email.com" />
                                <ErrorMessage name="nouvel_email" component="div" className="text-sm text-red-500 mt-2" />
                            </div>

                            <div>
                                <label htmlFor="nouveau_mot_de_passe" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nouveau mot de passe <span className="font-normal text-gray-500">(laisser vide pour ne pas changer)</span>
                                </label>
                                <Field id="nouveau_mot_de_passe" name="nouveau_mot_de_passe" type="password" autoComplete="new-password" className={inputClass} placeholder="••••••••" />
                                <ErrorMessage name="nouveau_mot_de_passe" component="div" className="text-sm text-red-500 mt-2" />
                            </div>

                            <div>
                                <label htmlFor="confirmation" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Confirmer le nouveau mot de passe
                                </label>
                                <Field id="confirmation" name="confirmation" type="password" autoComplete="new-password" className={inputClass} placeholder="••••••••" />
                                <ErrorMessage name="confirmation" component="div" className="text-sm text-red-500 mt-2" />
                            </div>

                            <div className="border-t border-gray-200 pt-6">
                                <label htmlFor="mot_de_passe_actuel" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Mot de passe actuel <span className="text-red-500">*</span>
                                </label>
                                <Field id="mot_de_passe_actuel" name="mot_de_passe_actuel" type="password" autoComplete="current-password" className={inputClass} placeholder="••••••••" />
                                <ErrorMessage name="mot_de_passe_actuel" component="div" className="text-sm text-red-500 mt-2" />
                                <p className="text-xs text-gray-500 mt-2">Requis pour confirmer toute modification.</p>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || chargement}
                                className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 shadow-md"
                            >
                                {isSubmitting ? 'Enregistrement…' : 'Enregistrer les modifications'}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
