'use client';
import { PageHeader } from "@/components/page-header";
import { ExpenseForm } from "@/components/expense-components";
import { useRouter } from "next/navigation";

export default function NewExpensePage() {
    const router = useRouter();

    return (
        <div className="flex flex-col gap-6">
             <PageHeader
                title="Submit a New Expense"
                description="Fill in the details below or scan a receipt to get started."
            />
            <ExpenseForm userId="1" companyId="1" />
        </div>
    )
}
