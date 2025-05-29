
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LoginModal } from '../components/LoginModal';
import { Dashboard } from '../components/Dashboard';
import { DatabaseService } from '../services/DatabaseService';
import { ExtendedUser } from '../types/User';
import { LogIn } from 'lucide-react';

const Index = () => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await DatabaseService.initialize();
        // Vérifier si l'utilisateur est déjà connecté (stocké en session)
        const storedUser = sessionStorage.getItem('currentUser');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          // Vérifier si le compte est toujours actif
          const authenticatedUser = await DatabaseService.authenticateUser(userData.username, userData.password || 'temp');
          if (authenticatedUser) {
            setUser(authenticatedUser);
          } else {
            // Compte inactif ou supprimé, nettoyer la session
            sessionStorage.removeItem('currentUser');
          }
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de la base de données:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeDatabase();
  }, []);

  const handleLogin = (userData: ExtendedUser) => {
    setUser(userData);
    sessionStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('currentUser');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header avec bouton de connexion */}
      <header className="w-full p-4">
        <div className="max-w-7xl mx-auto flex justify-end">
          <Button
            onClick={() => setIsLoginModalOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2 transition-all duration-200"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Connexion
          </Button>
        </div>
      </header>

      {/* Contenu principal de la page d'accueil */}
      <main className="flex items-center justify-center px-4" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mx-auto mb-8 h-24 w-24 bg-orange-500 rounded-full flex items-center justify-center shadow-2xl">
            <img
              src="/lovable-uploads/35137944-4fd5-4269-95e4-e24464bfaff4.png"
              alt="Logo LA MAÎTRISE"
              className="h-20 w-20 object-contain"
            />
          </div>

          {/* Titre */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            LA MAÎTRISE
          </h1>

          {/* Slogan */}
          <h2 className="text-2xl md:text-3xl font-semibold text-orange-600 mb-8">
            Services d'Ingénierie Électrique Complets
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto mb-12">
            Nous fournissons des solutions professionnelles d'ingénierie électrique adaptées pour répondre à vos besoins et défis spécifiques.
          </p>

          {/* Bouton d'action optionnel */}
          <div className="space-y-4">
            <Button
              onClick={() => setIsLoginModalOpen(true)}
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-8 py-3 text-lg transition-all duration-200"
            >
              Accéder au système de gestion
            </Button>
          </div>
        </div>
      </main>

      {/* Modal de connexion */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default Index;
