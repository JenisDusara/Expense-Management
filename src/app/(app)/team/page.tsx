'use client';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useState, useMemo } from 'react';
import { UsersTable, UserFormModal } from '@/components/team-components';
import type { User } from '@/lib/definitions';
import { MOCK_USERS } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

export default function TeamPage() {
  const { toast } = useToast();

  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const currentUser = users.find(u => u.id === '1') || users[0];
  const userRole = currentUser?.role;

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
    toast({ title: 'User deleted' });
  };
  
  const handleSaveUser = (user: Omit<User, 'id' | 'companyId'> & { id?: string }) => {
    if (user.id) {
        // Editing an existing user
        setUsers(users.map(u => u.id === user.id ? { ...u, ...user, companyId: u.companyId } : u));
        toast({ title: 'User Updated' });
    } else {
        // Creating a new user
        const newUser: User = {
            ...user,
            id: (Math.random() * 10000).toString(),
            companyId: currentUser.companyId,
            avatarUrl: `https://picsum.photos/seed/${Math.random()}/100/100`
        }
        setUsers([...users, newUser]);
        toast({ title: 'User Added' });
    }
  };

  const managers = useMemo(() => {
    return users?.filter(u => u.role !== 'Employee') || [];
  }, [users]);
  
  const isLoading = false;

  return (
    <>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Team Management"
          description="View, add, and manage users in your organization."
        >
          {userRole === 'Admin' && (
            <Button onClick={handleAddUser}>
                <PlusCircle />
                <span>Add User</span>
            </Button>
          )}
        </PageHeader>
        <UsersTable 
            users={users || []} 
            onEdit={handleEditUser} 
            onDelete={handleDeleteUser}
            isLoading={isLoading}
            canEdit={userRole === 'Admin'}
        />
      </div>
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        user={selectedUser}
        managers={managers}
      />
    </>
  );
}
