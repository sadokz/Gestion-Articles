
export interface User {
  id: number;
  username: string;
  nom_complet: string;
}

export interface ExtendedUser extends User {
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  niveau_acces?: 'lecture_seule' | 'lecture_modification' | 'inactif';
  password?: string;
}
