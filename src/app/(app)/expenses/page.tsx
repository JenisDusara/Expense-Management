'use client';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import type { Expense, User } from '@/lib/definitions';
import { ExpensesTable, ExpenseDetailModal } from '@/components/expense-components';
import { useState } from 'react';
import { MOCK_EXPENSES, MOCK_USERS } from '@/lib/data';

export default function ExpensesPage() {
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const user = MOCK_USERS[0];
  const expenses = MOCK_EXPENSES;


  const handleRowClick = (expense: Expense) => {
    setSelectedExpense(expense);
  };

  const handleCloseModal = () => {
    setSelectedExpense(null);
  };

  const handleModalStateChange = (isOpen: boolean) => {
    if (!isOpen) {
      handleCloseModal();
    }
  }
  
  return (
    <>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="My Expenses"
          description="View and manage your expense submissions."
        >
          <Button asChild>
            <Link href="/expenses/new">
              <PlusCircle />
              <span>New Expense</span>
            </Link>
          </Button>
        </PageHeader>
        <ExpensesTable expenses={expenses || []} onRowClick={handleRowClick} />
      </div>
      <ExpenseDetailModal
        expense={selectedExpense}
        isOpen={!!selectedExpense}
        onClose={handleCloseModal}
        onOpenChange={handleModalStateChange}
        currentUser={user}
      />
    </>
  );
}
