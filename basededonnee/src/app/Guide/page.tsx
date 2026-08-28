import React from "react";
import { BookOpen, Users, BarChart3, CalendarDays, Compass, HelpCircle, Star, Clock, Shield, Target } from "lucide-react";
import Footer from "../../../elements/Footer";

const GuidePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50 py-12 px-4 pt-30">
      <div className="max-w-6xl mx-auto">
        {/* Header avec design amélioré */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6 shadow-lg">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 bg-clip-text text-transparent mb-4">
            Guide d&apos;utilisation du site Patro
          </h1>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
            Bienvenue dans le guide de la plateforme de gestion du Patro ! Cette interface moderne et intuitive
            vous accompagne dans la gestion complète des activités du Patro St Charles Lwanga : gestion des enfants, événements,
            statistiques et bien plus encore.
          </p>

        </div>

        {/* Sections avec design amélioré */}
        <div className="grid gap-8 md:gap-6">

          {/* Gestion des enfants */}
          <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Users className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">1. Gestion des enfants</h3>
                  <p className="text-blue-100">Modification des informations des enfants du patro</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 text-lg mb-4">
                Cette application web propose deux espaces dédiés à la gestion des enfants :
                celui du <strong>patro scolaire</strong> et celui du <strong>patro vacances</strong>.

              </p>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-400 pl-4">
                  <h4 className="font-bold text-gray-800 text-lg mb-2">📘 Patro scolaire</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <span>Ajout, modification et suppression des enfants inscrits</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <span>Filtrage des enfants par différentes catégories</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <span>Consultation des fiches détaillées avec photo et informations personnelles</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <span>Suivi des réalisations et activités scolaires</span>
                    </li>
                  </ul>
                </div>

                <div className="border-l-4 border-green-400 pl-4">
                  <h4 className="font-bold text-gray-800 text-lg mb-2">🌞 Patro vacances</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                      <span>Gestion complète des enfants inscrits au patro vacance avec ajout, modification et suppression des enfants inscrits</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                      <span>Outils de recherche et de filtrage des enfants selon différentes catégories.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                      <span>Accès aux fiches individuelles avec photo et détails des enfants.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                      <span>Visualisation des réalisations et d'autres informations personnelles des enfants dans les détails </span>
                    </li>
                  </ul>
                </div>
              </div>



              <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <p className="text-blue-800 font-medium">
                  💡 Il est possible de modifier les détails de chaque enfant.
                </p>
              </div>

            </div>
          </div>

          {/* Gestion des animateurs */}
          <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-700 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Users className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">2. Gestion des animateurs</h3>
                  <p className="text-indigo-100">Modification des informations des animateurs du patro </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 text-lg mb-6">
                L'application web comporte également deux champs dédiés aux animateurs: un champ pour les animateur du patro scolaire et un second
                pour les animateurs du patro vacance.
              </p>

              <div className="space-y-6">
                <div className="border-l-4 border-blue-400 pl-4">
                  <h4 className="font-bold text-gray-800 text-lg mb-2">👨‍🏫 Patro scolaire</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <span>Tableau qui affiche la liste de tous les animateurs du patro scolaire avec la possibilité de
                        filtrer par catégories
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <span>Possibilité de modifier et rajouter un nouvelle animateur à la table </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <span>Il est également possible de voir les détails de chaque animateur à savoir les informations religieuses et les réalisations</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <span>Par ailleurs, on peut modifier les détails à savoir les photos, les réalisations etc</span>
                    </li>
                  </ul>
                </div>

                <div className="border-l-4 border-indigo-400 pl-4">
                  <h4 className="font-bold text-gray-800 text-lg mb-2">🌞 Patro Vacance</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2"></div>
                      <span>Tableau qui affiche la liste de tous les animateurs du patro vacance avec possibilité de filtrer par catégorie.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2"></div>
                      <span>On peut rajouter modifier et supprimer les animateurs.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2"></div>
                      <span>Finalement, il y a la  possibilité de voir les détails de chaque animateur.</span>
                    </li>
                  </ul>
                </div>


              </div>
            </div>
          </div>

          {/* Gestion des directeurs */}
          <div className="bg-white rounded-2xl shadow-xl border border-sky-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-sky-600 to-blue-600 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Users className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">3. Gestion des directeurs</h3>
                  <p className="text-sky-100">Coordination et suivi des responsables du patro</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 text-lg mb-6">
                L’application propose également deux sections dédiées aux directeurs : une pour le <strong>patro scolaire</strong> et une autre pour le <strong>patro vacances</strong>.
                Ces espaces permettent une gestion centralisée, la modification des informations et le suivi détaillé des directeurs.
              </p>

              <div className="space-y-6">

                <div className="border-l-4 border-sky-400 pl-4">
                  <h4 className="font-bold text-gray-800 text-lg mb-2">🏫 Patro scolaire</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-sky-400 rounded-full mt-2"></div>
                      <span>Tableau listant l’ensemble des directeurs du patro scolaire avec options de filtrage.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-sky-400 rounded-full mt-2"></div>
                      <span>Possibilité d’ajouter, modifier et supprimer des directeurs.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-sky-400 rounded-full mt-2"></div>
                      <span>Possibilité de voir les détails de chaque directeur qui comporte ses détails.</span>
                    </li>

                  </ul>
                </div>

                <div className="border-l-4 border-blue-400 pl-4">
                  <h4 className="font-bold text-gray-800 text-lg mb-2">🌴 Patro vacances</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <span>Tableau listant tous les directeurs du patro vacances avec filtres par catégorie.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <span>Ajout, modification et suppression des profils de directeurs.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <span>Accès aux détails : coordonnées complètes et réalisations.</span>
                    </li>

                  </ul>
                </div>
              </div>

              <div className="mt-6 bg-sky-50 p-4 rounded-lg border border-sky-200">
                <p className="text-sky-800 font-medium text-sm">
                  🔒 Toutes les données concernant les directeurs sont protégées et accessibles uniquement aux responsables autorisés.
                </p>
              </div>
            </div>
          </div>


          {/* Gestion des aumôniers */}
          <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-blue-700 to-indigo-700 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Users className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">4. Gestion des aumôniers</h3>
                  <p className="text-blue-100">Encadrement spirituel et accompagnement pastoral</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-700 text-lg mb-6">
                L’application intègre également une section dédiée aux aumôniers, séparée en deux espaces :
                le <strong>patro scolaire</strong> et le <strong>patro vacances</strong>.
                Ces aumôniers ont pour mission de permettre le suivi spirituel tout au long du patro.
              </p>

              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-bold text-gray-800 text-lg mb-2">📚 Patro scolaire</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <span>Liste de tous les aumôniers du patro scolaire avec des filtres.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <span>Ajout, modification et suppression des profils d’aumôniers.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <span>Consultation des informations spirituelles et de l’expérience pastorale de l'aumonier dans les détails.</span>
                    </li>
                  </ul>
                </div>

                <div className="border-l-4 border-indigo-500 pl-4">
                  <h4 className="font-bold text-gray-800 text-lg mb-2">🏕️ Patro vacances</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                      <span>Gestion des aumôniers dédiés aux camps et vacances.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                      <span>Ajout, modification et suppression des profils d’aumôniers du patro vacances.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                      <span>Possibilité de modifier les détails de chaque aumônier en rajoutant les contacts et les réalisations.</span>
                    </li>
                  </ul>
                </div>
              </div>


            </div>
          </div>


          {/* Evenements */}
          <div className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <CalendarDays className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">7. Evenements</h3>
                  <p className="text-orange-100">Activités organisées au sein du patro</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 text-lg mb-6">
                Plusieurs activités sont organisées tout au long de l'année pour les membres du patro.
                Ces activités comprennent des activités de loisir ainsi que des activités spirituelles.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-800">📚 Patro scolaire</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <span>Un tableau présentant toutes les activités du patro avec des possibilités de filtre.</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <span>Possibilité de voir les détails de chaque activité et de les modifier.</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <span>Caroussel présentant les images des activités (10 images maximum).</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <span>Possibilité d'intégrer une vidéo de 20 Mo maximum pour chaque activité. </span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-800"> 🏕️ Patro vacances</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span>Il y a également un tableau de toutes les activités avec la possibilité de supprimer, rajouter, modifier et filtrer les évènements.</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span>Caroussel d'image dans les détails (10 images maximum).</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span>On peut modifier également chaque détail.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">⚠️</div>
                    <div>
                      <p className="font-semibold text-amber-800 mb-2">Support d'urgence disponible</p>
                      <p className="text-amber-700 text-sm">
                        En cas de problème critique affectant le fonctionnement de votre organisation,
                        un support d'urgence est disponible 24h/24 via notre hotline dédiée.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* Statistiques */}
          <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <BarChart3 className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">5. Statistiques et analyses</h3>
                  <p className="text-purple-100">Tableaux de bord analytiques avancés</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 text-lg mb-6">
                Outils d'analyse puissants pour comprendre l'évolution de votre organisation et optimiser vos décisions.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-purple-500" />
                    <span>Répartition par classe (niveau primaire)</span>
                  </h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>•diagramme circulaire qui présente la répartition des élèves par classe</li>
                    <li>•Visualisation des pourcentages et des nombres d'élèves par catégories</li>

                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center space-x-2">
                    <Target className="w-5 h-5 text-purple-500" />
                    <span>Répartition par classe (niveau secondaire)</span>
                  </h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>•diagramme circulaire qui présente la répartition des élèves par classe</li>
                    <li>•Visualisation des pourcentages et des nombres d'élèves par catégories</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-purple-500" />
                    <span>Répartition par sexe</span>
                  </h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>•diagramme circulaire qui présente la répartition des enfants par sexe</li>
                    <li>•Visualisation des pourcentages et des nombres d'enfants par âge</li>

                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center space-x-2">
                    <Target className="w-5 h-5 text-purple-500" />
                    <span>Courbe d'évolution des effectifs</span>
                  </h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Choisir la plage sur laquelle la courbe sera représentée</li>
                    <li>• Visualisation de la courbe sur la plage d'années choisie</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-purple-500" />
                    <span>Courbe d'évolution du taux global de présence</span>
                  </h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Choisir la plage sur laquelle la courbe sera représentée</li>
                    <li>• Visualisation de la courbe sur la plage d'années choisie</li>

                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center space-x-2">
                    <Target className="w-5 h-5 text-purple-500" />
                    <span>Histogramme du Taux de présence par section</span>
                  </h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Choisir l'année pour laquelle l'histogramme sera affiché</li>
                    <li>• Visualisation des taux de présence par section de l'année choisie</li>
                  </ul>
                </div>
              </div>


            </div>
          </div>

        </div>

        {/* Footer avec informations supplémentaires */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">🎉 Plus de question ?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Si vous avez des questions ou des incompréhensions concernant cette application web,
              veuillez contacter le numéro suivant: +225 0747537075. Ou par email: angelakoua5@gmail.com
            </p>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GuidePage;