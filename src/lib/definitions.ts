export type Role = 'Admin' | 'Manager' | 'Employee';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  managerId?: string;
  companyId: string;
};

export type NewUser = Omit<User, 'id'>;

export type Company = {
  id: string;
  name: string;
  currency: string;
  ownerId?: string;
};

export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';

export type ExpenseCategory = 'Travel' | 'Food' | 'Office Supplies' | 'Software' | 'Other';

export type Expense = {
  id: string;
  userId: string;
  companyId: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  description: string;
  date: string; // YYYY-MM-DD string or ISO string
  status: ApprovalStatus;
  approverId?: string; // Current approver
  approvalHistory: {
    approverId: string;
    status: ApprovalStatus;
    comment?: string;
    date: string;
  }[];
  receiptUrl?: string;
  restaurantName?: string;
  expenseLines?: string[];
  createdAt?: any; 
  updatedAt?: any; 
};

export type Country = {
  name: {
    common: string;
  };
  currencies: {
    [key: string]: {
      name: string;
      symbol: string;
    };
  };
};
