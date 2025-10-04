'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const ExpenseFormSchema = z.object({
  amount: z.coerce.number().gt(0, { message: 'Please enter an amount greater than 0.' }),
  currency: z.string(),
  category: z.string().min(1, { message: 'Please select a category.' }),
  description: z.string().min(1, { message: 'Please enter a description.' }),
  date: z.date(),
  restaurantName: z.string().optional(),
  expenseLines: z.array(z.string()).optional(),
})

export async function createExpense(data: z.infer<typeof ExpenseFormSchema>, userId: string, companyId: string) {
  console.log("Mock createExpense", { data, userId, companyId });
  revalidatePath('/dashboard');
  revalidatePath('/expenses');
}

const SignUpSchema = z.object({
    email: z.string().email(),
    companyName: z.string().min(1),
    userName: z.string().min(1),
    country: z.string().min(1),
});

export async function createInitialCompanyAndUser(data: z.infer<typeof SignUpSchema>, userId: string) {
    console.log("Mock createInitialCompanyAndUser", { data, userId });
    revalidatePath('/team');
    return { userId, companyId: '1' };
}

const UserSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    role: z.enum(['Admin', 'Manager', 'Employee']),
    managerId: z.string().optional(),
    companyId: z.string(),
});

export async function createUser(userData: z.infer<typeof UserSchema>) {
    console.log("Mock createUser", { userData });
    revalidatePath('/team');
}

export async function processReceipt(receiptDataUri: string) {
    console.log("Processing receipt (mock)...");
    await new Promise(resolve => setTimeout(resolve, 1500));
    const mockOcrData = {
        amount: 55.47,
        date: '2024-05-12',
        description: 'Dinner at The Corner Bistro',
        expenseType: 'Food',
        restaurantName: 'The Corner Bistro',
        expenseLines: ['Truffle Fries - $12.00', 'Bistro Burger - $22.50', 'Craft Beer - $9.00'],
      };
    return { success: true, data: mockOcrData };
}

async function updateExpenseStatus(expenseId: string, companyId: string, userId: string, status: 'Approved' | 'Rejected', comment: string) {
    console.log("Mock updateExpenseStatus", { expenseId, companyId, userId, status, comment });
    revalidatePath('/dashboard');
    revalidatePath('/expenses');
}

export async function approveExpense(expenseId: string, companyId: string, userId: string, comment: string) {
    return updateExpenseStatus(expenseId, companyId, userId, 'Approved', comment);
}

export async function rejectExpense(expenseId: string, companyId: string, userId: string, comment: string) {
    return updateExpenseStatus(expenseId, companyId, userId, 'Rejected', comment);
}
