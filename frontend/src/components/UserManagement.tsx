import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DatabaseService } from '../services/DatabaseService';
import { ExtendedUser } from '../types/User';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Users, Shield, Eye, EyeOff } from 'lucide-react';

interface UserManagementProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({ isOpen, onClose }) => {
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<ExtendedUser | null>(null);
  const [userForm, setUserForm] = useState({
    nom: '',
    prenom: '',
    username: '',
    email: '',
    telephone: '',
    password: '',
    niveau_acces: 'lecture_modification' as 'lecture_seule' | 'lecture_modification' | 'inactif'
  });

  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  const loadUsers = async () => {
    try {
      const usersData = await DatabaseService.getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les utilisateurs",
        variant: "destructive",
      });
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setUserForm({
      nom: '',
      prenom: '',
      username: '',
      email: '',
      telephone: '',
      password: '',
      niveau_acces: 'lecture_modification' as 'lecture_seule' | 'lecture_modification' | 'inactif'
    });
    setIsEditingUser(true);
  };

  const handleEditUser = (user: ExtendedUser) => {
    setEditingUser(user);
    setUserForm({
      nom: user.nom || '',
      prenom: user.prenom || '',
      username: user.username,
      email: user.email || '',
      telephone: user.telephone || '',
      password: '', // Ne pas préremplir le mot de passe
      niveau_acces: (user.niveau_acces || 'lecture_modification') as 'lecture_seule' | 'lecture_modification' | 'inactif'
    });
    setIsEditingUser(true);
  };

  const handleSaveUser = async () => {
    try {
      if (editingUser) {
        await DatabaseService.updateUser({
          ...editingUser,
          ...userForm,
          nom_complet: `${userForm.prenom} ${userForm.nom}`.trim(),
          niveau_acces: userForm.niveau_acces
        });
        toast({
          title: "Utilisateur modifié",
          description: "L'utilisateur a été modifié avec succès",
        });
      } else {
        await DatabaseService.addUser({
          ...userForm,
          nom_complet: `${userForm.prenom} ${userForm.nom}`.trim(),
          niveau_acces: userForm.niveau_acces
        });
        toast({
          title: "Utilisateur ajouté",
          description: "L'utilisateur a été ajouté avec succès",
        });
      }
      setIsEditingUser(false);
      await loadUsers();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'utilisateur",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (user: ExtendedUser) => {
    if (user.username === 'admin') {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur admin",
        variant: "destructive",
      });
      return;
    }

    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.username}" ?`)) {
      try {
        await DatabaseService.deleteUser(user.id);
        toast({
          title: "Utilisateur supprimé",
          description: "L'utilisateur a été supprimé avec succès",
        });
        await loadUsers();
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'utilisateur",
          variant: "destructive",
        });
      }
    }
  };

  const getAccessBadge = (niveau: string) => {
    switch (niveau) {
      case 'lecture_seule':
        return <Badge variant="secondary"><Eye className="h-3 w-3 mr-1" />Lecture seule</Badge>;
      case 'lecture_modification':
        return <Badge variant="default"><Edit className="h-3 w-3 mr-1" />Lecture + Modification</Badge>;
      case 'inactif':
        return <Badge variant="destructive"><EyeOff className="h-3 w-3 mr-1" />Inactif</Badge>;
      default:
        return <Badge variant="outline">Non défini</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gestion des Utilisateurs
          </DialogTitle>
          <DialogDescription>
            Gérez les utilisateurs et leurs permissions d'accès
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Button onClick={handleAddUser} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un utilisateur
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>Liste des utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom complet</TableHead>
                    <TableHead>Identifiant</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Niveau d'accès</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.nom_complet}
                        {user.username === 'admin' && (
                          <Shield className="h-4 w-4 inline ml-2 text-orange-500" />
                        )}
                      </TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email || '-'}</TableCell>
                      <TableCell>{user.telephone || '-'}</TableCell>
                      <TableCell>{getAccessBadge(user.niveau_acces || 'lecture_modification')}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {user.username !== 'admin' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Modal pour éditer un utilisateur */}
        <Dialog open={isEditingUser} onOpenChange={setIsEditingUser}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="user-prenom">Prénom</Label>
                  <Input
                    id="user-prenom"
                    value={userForm.prenom}
                    onChange={(e) => setUserForm({ ...userForm, prenom: e.target.value })}
                    placeholder="Prénom"
                  />
                </div>
                <div>
                  <Label htmlFor="user-nom">Nom</Label>
                  <Input
                    id="user-nom"
                    value={userForm.nom}
                    onChange={(e) => setUserForm({ ...userForm, nom: e.target.value })}
                    placeholder="Nom"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="user-username">Identifiant (pseudo)</Label>
                <Input
                  id="user-username"
                  value={userForm.username}
                  onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                  placeholder="Identifiant unique"
                  disabled={editingUser?.username === 'admin'}
                />
              </div>

              <div>
                <Label htmlFor="user-email">Email</Label>
                <Input
                  id="user-email"
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  placeholder="email@exemple.com"
                />
              </div>

              <div>
                <Label htmlFor="user-telephone">Téléphone</Label>
                <Input
                  id="user-telephone"
                  value={userForm.telephone}
                  onChange={(e) => setUserForm({ ...userForm, telephone: e.target.value })}
                  placeholder="Numéro de téléphone"
                />
              </div>

              <div>
                <Label htmlFor="user-password">
                  {editingUser ? 'Nouveau mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe'}
                </Label>
                <Input
                  id="user-password"
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  placeholder="Mot de passe"
                />
              </div>

              <div>
                <Label htmlFor="user-access">Niveau d'accès</Label>
                <Select
                  value={userForm.niveau_acces || 'lecture_modification'}
                  onValueChange={(value: 'lecture_seule' | 'lecture_modification' | 'inactif') => 
                    setUserForm({ ...userForm, niveau_acces: value })}
                  disabled={editingUser?.username === 'admin'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un niveau d'accès" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lecture_seule">Lecture seule</SelectItem>
                    <SelectItem value="lecture_modification">Lecture + Modification</SelectItem>
                    <SelectItem value="inactif">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditingUser(false)}>
                Annuler
              </Button>
              <Button onClick={handleSaveUser}>
                {editingUser ? 'Modifier' : 'Ajouter'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};
