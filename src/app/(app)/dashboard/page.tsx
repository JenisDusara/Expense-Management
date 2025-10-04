'use client';

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { ExpensesChart, StatCard } from "@/components/dashboard-components";
import { ExpensesToApprove } from "@/components/expense-components";
import type { Expense, User } from "@/lib/definitions";
import { MOCK_EXPENSES, MOCK_USERS } from "@/lib/data";

const user: User = MOCK_USERS[0];
const allExpenses: Expense[] = MOCK_EXPENSES;
const userRole = user.role;

export default function DashboardPage() {
    const totalPending = allExpenses?.filter(e => e.status === 'Pending').length || 0;
    const totalApproved = allExpenses?.filter(e => e.status === 'Approved').length || 0;
    const totalRejected = allExpenses?.filter(e => e.status === 'Rejected').length || 0;
    const totalSpent = allExpenses?.filter(e => e.status === 'Approved').reduce((sum, e) => sum + e.amount, 0) || 0;
    
    const pendingForApproval = allExpenses?.filter(e => e.status === 'Pending') || [];

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Dashboard"
                description={`Welcome back, ${user?.name || 'User'}. Here's your expense overview.`}
            >
                {userRole === 'Employee' && (
                     <Button asChild>
                        <Link href="/expenses/new">
                            <PlusCircle />
                            <span>New Expense</span>
                        </Link>
                    </Button>
                )}
            </PageHeader>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Spent (Approved)" value={`$${totalSpent.toFixed(2)}`} iconName="DollarSign" />
                <StatCard title="Pending Review" value={totalPending.toString()} iconName="Activity" />
                <StatCard title="Approved Expenses" value={totalApproved.toString()} iconName="CheckCircle2" />
                <StatCard title="Rejected Expenses" value={totalRejected.toString()} iconName="XCircle" />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <ExpensesChart expenses={allExpenses || []} />
                {userRole !== 'Employee' && <ExpensesToApprove expenses={pendingForApproval} />}
            </div>
        </div>
    )
}
