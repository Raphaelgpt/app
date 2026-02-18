import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight,
  Play,
  CheckCircle,
  Clock,
  Award,
  BookOpen,
  Video,
  FileText,
  Users,
  Star
} from 'lucide-react';
import { useOS } from '../../../context/OSContext';

const courses = [
  {
    id: 'windows-basics',
    title: 'Les bases de Windows 11',
    description: 'Découvrez les fondamentaux de Windows 11',
    duration: '15 min',
    level: 'Débutant',
    modules: [
      { id: 1, title: 'Introduction à Windows 11', type: 'video', duration: '3 min', completed: false },
      { id: 2, title: 'Le bureau et la barre des tâches', type: 'video', duration: '4 min', completed: false },
      { id: 3, title: 'Le menu Démarrer', type: 'video', duration: '3 min', completed: false },
      { id: 4, title: 'Quiz: Les bases', type: 'quiz', duration: '5 min', completed: false },
    ],
    progress: 0,
  },
  {
    id: 'file-management',
    title: 'Gestion des fichiers',
    description: 'Maîtrisez l\'explorateur de fichiers',
    duration: '20 min',
    level: 'Débutant',
    modules: [
      { id: 1, title: 'Navigation dans les dossiers', type: 'video', duration: '5 min', completed: false },
      { id: 2, title: 'Copier, couper, coller', type: 'video', duration: '4 min', completed: false },
      { id: 3, title: 'Recherche de fichiers', type: 'video', duration: '4 min', completed: false },
      { id: 4, title: 'Exercice pratique', type: 'exercise', duration: '7 min', completed: false },
    ],
    progress: 0,
  },
  {
    id: 'admin-training',
    title: 'Formation Administrateur',
    description: 'Gérez les utilisateurs et le système',
    duration: '30 min',
    level: 'Avancé',
    adminOnly: true,
    modules: [
      { id: 1, title: 'Gestion des comptes utilisateurs', type: 'video', duration: '8 min', completed: false },
      { id: 2, title: 'Journal des connexions', type: 'video', duration: '5 min', completed: false },
      { id: 3, title: 'Utilisation du terminal', type: 'video', duration: '10 min', completed: false },
      { id: 4, title: 'Système de notifications', type: 'video', duration: '4 min', completed: false },
      { id: 5, title: 'Évaluation finale', type: 'quiz', duration: '3 min', completed: false },
    ],
    progress: 0,
  },
  {
    id: 'security',
    title: 'Sécurité informatique',
    description: 'Bonnes pratiques de sécurité',
    duration: '25 min',
    level: 'Intermédiaire',
    modules: [
      { id: 1, title: 'Mots de passe sécurisés', type: 'video', duration: '6 min', completed: false },
      { id: 2, title: 'Reconnaître le phishing', type: 'video', duration: '7 min', completed: false },
      { id: 3, title: 'Mises à jour système', type: 'video', duration: '5 min', completed: false },
      { id: 4, title: 'Quiz: Sécurité', type: 'quiz', duration: '7 min', completed: false },
    ],
    progress: 0,
  },
];

const ModuleContent = ({ module, onComplete, onBack }) => {
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
    setTimeout(() => {
      onComplete(module.id);
      onBack();
    }, 1500);
  };

  const getModuleContent = () => {
    switch (module.type) {
      case 'video':
        return (
          <div className="space-y-6">
            {/* Video placeholder */}
            <div className="aspect-video bg-black rounded-xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#60CDFF]/20 to-purple-500/20" />
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-white/30 transition-colors">
                  <Play className="w-8 h-8 text-white ml-1" fill="white" />
                </div>
                <p className="text-white/80">Cliquez pour démarrer la vidéo</p>
                <p className="text-white/50 text-sm mt-1">{module.duration}</p>
              </div>
            </div>
            
            {/* Description */}
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="font-medium mb-2">À propos de ce module</h3>
              <p className="text-white/60 text-sm">
                Dans ce module, vous apprendrez les concepts essentiels liés à "{module.title}". 
                Suivez attentivement la vidéo et prenez des notes si nécessaire.
              </p>
            </div>
          </div>
        );
      
      case 'quiz':
        return (
          <div className="space-y-6">
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="font-medium mb-4">Question 1/3</h3>
              <p className="text-lg mb-6">Quelle est la fonction principale de la barre des tâches Windows 11 ?</p>
              <div className="space-y-3">
                {[
                  'Afficher l\'heure uniquement',
                  'Accéder rapidement aux applications et fenêtres',
                  'Modifier les paramètres système',
                  'Naviguer sur internet',
                ].map((option, i) => (
                  <button
                    key={i}
                    className="w-full text-left p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'exercise':
        return (
          <div className="space-y-6">
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="font-medium mb-4">Exercice Pratique</h3>
              <div className="space-y-4 text-white/80">
                <p>Réalisez les actions suivantes :</p>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Ouvrez l'Explorateur de fichiers depuis le bureau</li>
                  <li>Naviguez vers le dossier "Documents"</li>
                  <li>Créez un nouveau dossier nommé "Test"</li>
                  <li>Retournez au dossier parent</li>
                </ol>
                <p className="text-white/50 text-sm mt-4">
                  Note: Ceci est une simulation. Dans un environnement réel, vous effectueriez ces actions.
                </p>
              </div>
            </div>
          </div>
        );
      
      default:
        return <p>Contenu non disponible</p>;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-white/10">
        <button 
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h2 className="font-medium">{module.title}</h2>
          <p className="text-sm text-white/50">{module.duration} • {module.type === 'video' ? 'Vidéo' : module.type === 'quiz' ? 'Quiz' : 'Exercice'}</p>
        </div>
        {!completed && (
          <button
            onClick={handleComplete}
            className="px-4 py-2 bg-[#60CDFF] text-black rounded-lg text-sm font-medium hover:bg-[#4CC2FF] transition-colors"
          >
            Marquer comme terminé
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {completed ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">Module terminé !</h3>
            <p className="text-white/60">Retour à la liste des modules...</p>
          </div>
        ) : (
          getModuleContent()
        )}
      </div>
    </div>
  );
};

export const Training = () => {
  const { currentUser, addNotification } = useOS();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [courseProgress, setCourseProgress] = useState({});

  const availableCourses = courses.filter(c => !c.adminOnly || currentUser?.role === 'admin');

  const handleModuleComplete = (courseId, moduleId) => {
    setCourseProgress(prev => ({
      ...prev,
      [courseId]: {
        ...(prev[courseId] || {}),
        [moduleId]: true,
      }
    }));
    addNotification({
      type: 'success',
      title: 'Module terminé',
      message: 'Félicitations ! Passez au module suivant.',
    });
  };

  const getModuleIcon = (type) => {
    switch (type) {
      case 'video': return Video;
      case 'quiz': return FileText;
      case 'exercise': return BookOpen;
      default: return FileText;
    }
  };

  const getCourseProgress = (course) => {
    const completed = course.modules.filter(m => courseProgress[course.id]?.[m.id]).length;
    return Math.round((completed / course.modules.length) * 100);
  };

  // Module view
  if (selectedModule) {
    return (
      <div data-testid="training-module-view" className="h-full bg-[#1a1a1a] text-white">
        <ModuleContent 
          module={selectedModule}
          onComplete={(moduleId) => handleModuleComplete(selectedCourse.id, moduleId)}
          onBack={() => setSelectedModule(null)}
        />
      </div>
    );
  }

  // Course detail view
  if (selectedCourse) {
    const progress = getCourseProgress(selectedCourse);
    
    return (
      <div data-testid="training-course-view" className="h-full bg-[#1a1a1a] text-white flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <button 
            onClick={() => setSelectedCourse(null)}
            className="flex items-center gap-2 text-[#60CDFF] mb-4 hover:underline"
          >
            <ChevronLeft className="w-4 h-4" /> Retour aux formations
          </button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold mb-2">{selectedCourse.title}</h1>
              <p className="text-white/60 mb-4">{selectedCourse.description}</p>
              <div className="flex items-center gap-4 text-sm text-white/50">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {selectedCourse.duration}</span>
                <span className="flex items-center gap-1"><Award className="w-4 h-4" /> {selectedCourse.level}</span>
                <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {selectedCourse.modules.length} modules</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-[#60CDFF]">{progress}%</div>
              <div className="text-sm text-white/50">Progression</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#60CDFF] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Modules list */}
        <div className="flex-1 overflow-y-auto p-6">
          <h2 className="text-lg font-medium mb-4">Modules du cours</h2>
          <div className="space-y-2">
            {selectedCourse.modules.map((module, index) => {
              const Icon = getModuleIcon(module.type);
              const isCompleted = courseProgress[selectedCourse.id]?.[module.id];
              
              return (
                <button
                  key={module.id}
                  data-testid={`module-${module.id}`}
                  onClick={() => setSelectedModule(module)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors text-left ${
                    isCompleted 
                      ? 'bg-green-500/10 border border-green-500/20' 
                      : 'bg-white/5 hover:bg-white/10 border border-transparent'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-green-500/20' : 'bg-white/10'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <span className="text-white/50">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${isCompleted ? 'text-green-400' : 'text-white'}`}>
                      {module.title}
                    </p>
                    <p className="text-sm text-white/50 flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {module.type === 'video' ? 'Vidéo' : module.type === 'quiz' ? 'Quiz' : 'Exercice'} • {module.duration}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/30" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Course list view
  return (
    <div data-testid="training-app" className="h-full bg-[#1a1a1a] text-white flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-semibold mb-2">Centre de Formation</h1>
        <p className="text-white/60">Développez vos compétences avec nos formations interactives</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 p-6 border-b border-white/10">
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#60CDFF]/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-[#60CDFF]" />
            </div>
            <div>
              <p className="text-2xl font-bold">{availableCourses.length}</p>
              <p className="text-sm text-white/50">Formations</p>
            </div>
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {availableCourses.filter(c => getCourseProgress(c) === 100).length}
              </p>
              <p className="text-sm text-white/50">Terminées</p>
            </div>
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {Object.keys(courseProgress).reduce((acc, cid) => acc + Object.keys(courseProgress[cid] || {}).length, 0)}
              </p>
              <p className="text-sm text-white/50">Modules complétés</p>
            </div>
          </div>
        </div>
      </div>

      {/* Course list */}
      <div className="flex-1 overflow-y-auto p-6">
        <h2 className="text-lg font-medium mb-4">Formations disponibles</h2>
        <div className="grid grid-cols-2 gap-4">
          {availableCourses.map((course) => {
            const progress = getCourseProgress(course);
            
            return (
              <button
                key={course.id}
                data-testid={`course-${course.id}`}
                onClick={() => setSelectedCourse(course)}
                className="text-left p-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-[#60CDFF]/20 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-[#60CDFF]" />
                  </div>
                  {course.adminOnly && (
                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs">
                      Admin
                    </span>
                  )}
                </div>
                <h3 className="font-medium mb-1 group-hover:text-[#60CDFF] transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-white/50 mb-3 line-clamp-2">{course.description}</p>
                <div className="flex items-center gap-3 text-xs text-white/40 mb-3">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration}</span>
                  <span className="flex items-center gap-1"><Award className="w-3 h-3" /> {course.level}</span>
                </div>
                
                {/* Progress bar */}
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#60CDFF] transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-white/40 mt-2">{progress}% terminé</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
