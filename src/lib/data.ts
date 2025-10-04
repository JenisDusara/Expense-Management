import type { User, Company, Expense } from './definitions';

// This file used to contain functions to fetch data from Firestore.
// Since the database has been removed, this file is now mostly empty.
// We can keep it for defining mock data structures or future data logic.

export const MOCK_USERS: User[] = [
  { id: '1', name: 'Alicia Rodriguez', email: 'alicia@innovate.com', role: 'Admin', companyId: '1', avatarUrl: 'https://picsum.photos/seed/1/100/100' },
  { id: '2', name: 'Ben Carter', email: 'ben@innovate.com', role: 'Manager', managerId: '1', companyId: '1', avatarUrl: 'https://picsum.photos/seed/2/100/100' },
  { id: '3', name: 'Carlos Diaz', email: 'carlos@innovate.com', role: 'Employee', managerId: '2', companyId: '1', avatarUrl: 'https://picsum.photos/seed/3/100/100' },
];

export const MOCK_EXPENSES: Expense[] = [
    { id: '1', userId: '3', companyId: '1', amount: 150, currency: 'USD', category: 'Travel', description: 'Flight to SFO', date: '2024-05-10', status: 'Approved', approvalHistory: [] },
    { id: '2', userId: '3', companyId: '1', amount: 75, currency: 'USD', category: 'Food', description: 'Client Lunch', date: '2024-05-12', status: 'Pending', approvalHistory: [] },
    { id: '3', userId: '2', companyId: '1', amount: 300, currency: 'USD', category: 'Software', description: 'Figma Subscription', date: '2024-05-01', status: 'Approved', approvalHistory: [] },
    { id: '4', userId: '1', companyId: '1', amount: 25, currency: 'USD', category: 'Other', description: 'Office Coffee', date: '2024-05-15', status: 'Rejected', approvalHistory: [] },
];
